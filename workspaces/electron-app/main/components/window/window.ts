import { app, BrowserWindow, ipcMain, nativeImage } from 'electron';
import path from 'node:path';
import { Logger } from '../../utils/logger';
import { AbstractService } from '../../services/abstract-service';

declare const global: Global;

export class Window {
	protected _electronWindow: BrowserWindow | undefined;

	get electronWindow(): BrowserWindow | undefined{
		return this._electronWindow;
	}

	protected getWebPreferencesDefault(): Electron.WebPreferences {
		return {
			// Default behavior in Electron since 5, that
			// limits the powers granted to remote content
			nodeIntegration: global.appConfig.isNodeIntegration,
			// Isolate window context to protect against prototype pollution
			contextIsolation: global.appConfig.isContextIsolation,
			// Introduced in Electron 20 and enabled by default
			// Among others security constraints, it prevents from required
			// CommonJS modules imports to be bundled into preload script
			sandbox: global.appConfig.isSandbox,
		}
	}

	protected loadIcon(): Electron.NativeImage | undefined {
		let iconObject;
		if (global.appConfig.isIconAvailable) {
			const iconPath = path.join(__dirname, 'icons/icon.png');
			Logger.debug('Icon Path', iconPath);
			iconObject = nativeImage.createFromPath(iconPath);
			// Change dock icon on MacOS
			if (iconObject && process.platform === 'darwin') {
				app.dock.setIcon(iconObject);
			}
		}
		return iconObject;
	}

	protected openDevTools(): void {
		this._electronWindow.webContents.openDevTools();
		this._electronWindow.webContents.on('devtools-opened', () => {
			this._electronWindow.focus();
			setImmediate(() => {
				this._electronWindow.focus();
			});
		});
	}

	protected registerService<In, Out>(service: AbstractService<In, Out>) {
		ipcMain.on(
			service.receptionChannel(),
			async (event: Electron.IpcMainEvent, ...parameters: any[]) => {
				// Handling input
				const input = parameters[0];
				Logger.debug(`[${service.receptionChannel()}]  =====> `, input);
				const output: Out = service.process(input);

				// Handling output
				if (service.sendingChannel()) {
					Logger.debug(`[${service.sendingChannel()}] =====> `, output);
					this._electronWindow.webContents.send(
						service.sendingChannel(),
						output
					);
				}
			}
		);
	}
}
