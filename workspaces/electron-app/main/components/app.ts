import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { AppWindow } from './window/app.window';
import path from 'node:path';
import { SoundCaptureChannels } from '../../../shared-lib/models/messaging/sound-capture.channels';
import * as process from 'node:process';
import { WindowManager } from './window/window.manager';
import { SoundCaptureWindow } from './window/sound-capture.window';

declare const global: Global;

export class App {
	private static _wrapper: AppWindow;
	private static _soundCaptureWindow: SoundCaptureWindow;

	public static launch(): void {
		app.on('window-all-closed', App.quit);
		app.on('activate', App.start);
		app.whenReady().then(App.start);
		console.log('env: ', process.env.NODE_ENV);

		// Limit navigation and open external links in default browser
		app.on('web-contents-created', App.openExternalLinksInDefaultBrowser);
	}

	public static get electronWindow(): BrowserWindow | undefined {
		return this._wrapper ? this._wrapper.electronWindow : undefined;
	}

	public static get soundCaptureWindow(): BrowserWindow | undefined {
		return this._soundCaptureWindow
			? this._soundCaptureWindow.electronWindow
			: undefined;
	}

	private static start() {
		// On MacOS it is common to re-create a window from app even after all windows have been closed
		if (!App.electronWindow) {
			App._wrapper = WindowManager.instance.createAppWindow();
		}
		if (!App.soundCaptureWindow) {
			App._soundCaptureWindow =
				WindowManager.instance.createSoundCaptureWindow();
		}

		ipcMain.on(SoundCaptureChannels.INIT_MSG, (_, data) => {
			console.log('got message: ', data);

			const randomInt = Math.ceil(Math.random() * 1000);
			App.soundCaptureWindow?.webContents.send(
				SoundCaptureChannels.INCOMING_MSG,
				`Message from main: ${randomInt}`
			);
		});
	}

	private static quit() {
		// On MacOS it is common for applications to stay open until the user explicitly quits
		// But WebDriverIO Test Runner does not handle that behaviour yet
		if (
			process.platform !== 'darwin' ||
			global.appConfig.configId === 'e2e-test'
		) {
			app.quit();
		}
	}

	private static openExternalLinksInDefaultBrowser = (
		event: Electron.Event,
		contents: Electron.WebContents
	) => {
		// Disabling creation of new windows
		contents.setWindowOpenHandler((handler: Electron.HandlerDetails) => {
			// Telling the user platform to open this event's url in the default browser
			shell.openExternal(handler.url);

			// Blocking this event from loading in current app
			return { action: 'deny' };
		});

		// Limiting navigation
		contents.on(
			'will-navigate',
			(event: Electron.Event, navigationUrl: string) => {
				const parsedUrl = new URL(navigationUrl);
				// Allowing local navigation only
				if (parsedUrl.origin !== 'http://localhost:4200') {
					event.preventDefault();
				}
			}
		);
	};
}
