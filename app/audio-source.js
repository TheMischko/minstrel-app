"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioSource = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
class AudioSource {
    get playing() {
        return !!this.bufferedSource;
    }
    constructor(sourcePath, audioContext) {
        this.sourcePath = sourcePath;
        this.audioContext = audioContext;
    }
    async init() {
        const buffer = await this.loadAudioFile(this.sourcePath);
        this.bufferedSource = this.audioContext.createBufferSource();
        this.bufferedSource.buffer = buffer;
    }
    connect(gain) {
        if (!this.bufferedSource) {
            throw Error('Illegal aaction on unitialized AudioSource, action = ' + 'connect');
        }
        this.bufferedSource.connect(gain);
    }
    async start() {
        if (!this.playing) {
            await this.init();
            // @ts-ignore
            this.bufferedSource?.start();
        }
    }
    stop() {
        if (!this.bufferedSource) {
            throw Error('Illegal aaction on unitialized AudioSource, action = ' + 'stop');
        }
        if (this.playing) {
            this.bufferedSource.stop();
            this.bufferedSource = undefined;
        }
    }
    async loadAudioFile(filePath) {
        return new Promise((resolve, reject) => {
            node_fs_1.default.readFile(filePath, async (err, data) => {
                if (err) {
                    reject(err.message);
                }
                resolve(await this.audioContext.decodeAudioData(data.buffer));
            });
        });
    }
}
exports.AudioSource = AudioSource;
//# sourceMappingURL=audio-source.js.map