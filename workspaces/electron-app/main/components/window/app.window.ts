import * as remoteMain from '@electron/remote/main';
import { BrowserWindow, ipcMain } from 'electron';
import * as path from 'node:path';
import { MultiplesService } from '../../services/multiples-service';
import { Window } from './window';
import * as process from 'node:process';

declare const global: Global;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export class AppWindow extends Window {
	constructor() {
		super();
		this.createWindow();
		this.loadRenderer();
		this.registerService<number, number[]>(new MultiplesService());
	}

	private createWindow(): void {
		this._electronWindow = new BrowserWindow({
			width: 1280,
			height: 720,
			backgroundColor: '#FFFFFF',
			icon: this.loadIcon(),
			webPreferences: {
				...this.getWebPreferencesDefault(),
				// Use a preload script to enhance security
				preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
			},
		});

		// Disable the remote module to enhance security
		if (global.appConfig.isEnableRemoteModule) {
			remoteMain.enable(this._electronWindow.webContents);
		}
	}

	private async loadRenderer(): Promise<void> {
		if (process.env.NODE_ENV === 'development') {
			await this.electronWindow.loadURL(`http://localhost:4200`);
		} else {
			const indexPath = path.join(
				__dirname,
				'../renderer/angular_window/index.html'
			);
			await this.electronWindow.loadURL(`file://${indexPath}`);
		}

		if (global.appConfig.isOpenDevTools) {
			this.openDevTools();
		}

		this._electronWindow.on('closed', () => {
			ipcMain.removeAllListeners();
			delete this._electronWindow;
		});
	}
}
