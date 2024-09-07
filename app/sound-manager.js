"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundManager = void 0;
const node_stream_1 = require("node:stream");
const node_web_audio_api_1 = require("node-web-audio-api");
const fs = __importStar(require("node:fs"));
const audio_source_1 = require("./audio-source");
class SoundManager {
    constructor() {
        this.audioContext = new node_web_audio_api_1.AudioContext();
        this.sources = [];
        this.gainNodes = [];
        this.mixedStream = new node_stream_1.PassThrough();
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
                    pcmData.writeInt16LE(sample < 0 ? sample * 0x8000 : sample * 0x7fff, i * 2);
                }
                this.mixedStream.write(pcmData);
            }
        };
        this.scriptProcessor.connect(this.audioContext.destination);
    }
    get stream() {
        return this.mixedStream;
    }
    async addSound(filePath, volume = 0.5) {
        console.log('adding sound', filePath);
        const audio = new audio_source_1.AudioSource(filePath, this.audioContext);
        await audio.init();
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = volume;
        audio.connect(gainNode);
        gainNode.connect(this.scriptProcessor);
        this.sources.push(audio);
        this.gainNodes.push(gainNode);
        return audio;
    }
    startAll() {
        if (this.isPlaying) {
            this.stopAll();
        }
        console.log('starting all');
        this.sources.forEach((source) => source.start());
        this.mixedStream.resume();
        this.isPlaying = true;
    }
    stopAll() {
        console.log('stopping all');
        this.sources.forEach((source) => source.stop());
        this.mixedStream.pause();
        this.isPlaying = false;
    }
    async loadAudioFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, async (err, data) => {
                if (err) {
                    reject(err.message);
                }
                resolve(await this.audioContext.decodeAudioData(data.buffer));
            });
        });
    }
}
exports.SoundManager = SoundManager;
//# sourceMappingURL=sound-manager.js.map