import { BrowserWindow } from 'electron';
import { Window } from './window';
import * as process from 'node:process';
import path from 'node:path';

declare const global: Global;

export class SoundCaptureWindow extends Window {
	constructor() {
		super();
		this.createWindow();
		this.loadRenderer();
	}

	private get rendererPath(): string {
		if (process.env.NODE_ENV === 'development') {
			return path.join(
				__dirname,
				'../../workspaces/sound-capture-app/.dist/sound-capture.html'
			);
		}
		return path.join(__dirname, '../renderer/sound_capture/index.html');
	}

	private createWindow(): void {
		this._electronWindow = new BrowserWindow({
			show: false,
			icon: this.loadIcon(),
			webPreferences: {
				...this.getWebPreferencesDefault(),
			},
		});
	}

	private async loadRenderer(): Promise<void> {
		const rendererPath = this.rendererPath;
		await this.electronWindow.loadURL(`file://${rendererPath}`);

		if (global.appConfig.isOpenDevTools) {
			this.openDevTools();
		}

		this.electronWindow.on('closed', () => {
			delete this._electronWindow;
		});
	}
}
