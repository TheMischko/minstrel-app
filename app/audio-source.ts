import fs from 'node:fs';

export class AudioSource {
  private bufferedSource: AudioBufferSourceNode | undefined;

  get playing() {
    return !!this.bufferedSource;
  }

  constructor(
    private sourcePath: string,
    private audioContext: AudioContext,
  ) {}

  async init(): Promise<void> {
    const buffer = await this.loadAudioFile(this.sourcePath);
    this.bufferedSource = this.audioContext.createBufferSource();
    this.bufferedSource.buffer = buffer;
  }

  connect(gain: GainNode) {
    if (!this.bufferedSource) {
      throw Error(
        'Illegal aaction on unitialized AudioSource, action = ' + 'connect',
      );
    }
    this.bufferedSource.connect(gain);
  }

  async start(): Promise<void> {
    if (!this.playing) {
      await this.init();
      // @ts-ignore
      this.bufferedSource?.start();
    }
  }

  stop(): void {
    if (!this.bufferedSource) {
      throw Error(
        'Illegal aaction on unitialized AudioSource, action = ' + 'stop',
      );
    }
    if (this.playing) {
      this.bufferedSource.stop();
      this.bufferedSource = undefined;
    }
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
