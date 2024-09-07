import { PassThrough } from 'node:stream';
import { AudioContext } from 'node-web-audio-api';
import * as fs from 'node:fs';
import { AudioSource } from './audio-source';

export class SoundManager {
  private audioContext: AudioContext;
  private sources: AudioSource[];
  private gainNodes: GainNode[];
  private scriptProcessor: ScriptProcessorNode;
  private mixedStream: PassThrough;
  private isPlaying: boolean;

  constructor() {
    this.audioContext = new AudioContext();
    this.sources = [];
    this.gainNodes = [];
    this.mixedStream = new PassThrough();
    this.isPlaying = false;

    this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 2, 2);
    this.scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
      const inputBuffer = audioProcessingEvent.inputBuffer;
      const outputBuffer = audioProcessingEvent.outputBuffer;

      for (let channel = 0; channel < 1; channel++) {
        const inputData = inputBuffer.getChannelData(channel);
        const outputData = outputBuffer.getChannelData(channel);
        outputData.set(inputData);

        // Convert float32 audio data to PCM 16-bit and push to the stream
        const pcmData = Buffer.alloc(outputData.length * 2);
        for (let i = 0; i < outputData.length; i++) {
          const sample = Math.max(-1, Math.min(1, outputData[i]));
          pcmData.writeInt16LE(
            sample < 0 ? sample * 0x8000 : sample * 0x7fff,
            i * 2,
          );
        }
        this.mixedStream.write(pcmData);
      }
    };

    this.scriptProcessor.connect(this.audioContext.destination);
  }

  get stream(): PassThrough {
    return this.mixedStream;
  }

  async addSound(filePath: string, volume: number = 0.5): Promise<AudioSource> {
    console.log('adding sound', filePath);
    const audio = new AudioSource(filePath, this.audioContext);
    await audio.init();

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;
    audio.connect(gainNode);
    gainNode.connect(this.scriptProcessor);

    this.sources.push(audio);
    this.gainNodes.push(gainNode);
    return audio;
  }

  startAll(): void {
    if (this.isPlaying) {
      this.stopAll();
    }
    console.log('starting all');
    this.sources.forEach((source) => source.start());
    this.mixedStream.resume();
    this.isPlaying = true;
  }

  stopAll(): void {
    console.log('stopping all');
    this.sources.forEach((source) => source.stop());
    this.mixedStream.pause();
    this.isPlaying = false;
  }

  private async loadAudioFile(filePath: string): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, async (err: Error | null, data: Buffer) => {
        if (err) {
          reject(err.message);
        }
        resolve(await this.audioContext.decodeAudioData(data.buffer));
      });
    });
  }
}
