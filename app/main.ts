import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { connectToVoice, loginBot, streamAudioData } from './discord-bot';
import ffmpeg from 'fluent-ffmpeg';
import Speaker from 'speaker';
import internal, { PassThrough, Writable } from 'node:stream';
import ffmpegPath from 'ffmpeg-static';
import { createAudioResource, StreamType } from '@discordjs/voice';
import { SoundManager } from './sound-manager';
import { DatabaseManager } from './managers/database-manager';
import { PlaylistManager } from './managers/playlist-manager';
import { PlaylistController } from './controllers/playlist-controller';
import { MusicController } from './controllers/music-controller';
import { MusicManager } from './managers/music-manager';

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

function createWindow(): BrowserWindow {
  const fullscreen: boolean = false;
  const size = fullscreen
    ? screen.getPrimaryDisplay().workAreaSize
    : { width: 1280, height: 720 };

  require('dotenv').config();

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,
    },
  });

  ffmpeg.setFfmpegPath(ffmpegPath!);

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  const songPath = 'E:\\Fantasy music\\day\\Celtic_Atmosphere.mp3';
  const ambiencePath = 'E:\\Fantasy music\\atmo\\forest-sounds.mp3';

  const soundManager = new SoundManager();

  let botConnected: boolean = false;
  let playingToSpeaker: boolean = false;

  app.on('ready', () => {
    setTimeout(createWindow, 400);

    const databaseManager = new DatabaseManager();

    // Managers

    const playlistManager = new PlaylistManager(databaseManager);
    const musicManager = new MusicManager(databaseManager);
    // Controllers

    const playlistController = new PlaylistController(playlistManager);
    playlistController.registerHandlers();
    const musicController = new MusicController(musicManager);
    musicController.registerHandlers();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('setup', (event, arg) => {
    console.log('setup');
    loginBot().then(() => {
      console.log('connecting to voice');
      connectToVoice();
      botConnected = true;
    });
  });

  ipcMain.on('play', async (event, arg) => {
    if (!playingToSpeaker) {
      await soundManager.addSound(songPath);
      if (!botConnected) {
        const speaker = new Speaker({
          channels: 2,
          bitDepth: 16,
          sampleRate: 48000,
        });
        console.log('playing to speaker');
        soundManager.stream.pipe(speaker);
        soundManager.startAll();
        playingToSpeaker = true;
        return;
      }
    } else {
      soundManager.stopAll();
      playingToSpeaker = false;
    }

    soundManager.startAll();
    const audioResource = createAudioResource(soundManager.stream, {
      inputType: StreamType.Raw,
    });
    streamAudioData(audioResource);
  });

  ipcMain.on('play-second', async () => {
    const playback = await soundManager.addSound(ambiencePath);
    playback.start();
  });

  ipcMain.on('pause', (event, arg) => {
    soundManager.stopAll();
  });

  ipcMain.on('login-bot', (event, arg) => {
    loginBot();
  });
  ipcMain.on('join-voice', (e, _) => {
    connectToVoice();
  });
  ipcMain.on('audio-data', async (event, buffer) => {
    streamAudioData(buffer);
  });
} catch (e) {
  console.error(e);
}

function playMp3AsPCM(filePath: string): Writable | PassThrough {
  const speaker = new Speaker({
    channels: 2,
    bitDepth: 16,
    sampleRate: 44100,
  });
  return ffmpeg(filePath)
    .format('wav')
    .audioChannels(2)
    .audioFrequency(44100)
    .pipe(speaker);
}

function getStreamablePCMStream(filePath: string): PassThrough {
  const stream = new PassThrough();

  ffmpeg(filePath)
    .audioCodec('pcm_s16le')
    .format('s16le')
    .audioChannels(2)
    .audioFrequency(48000)
    .pipe(stream);

  return stream;
}
