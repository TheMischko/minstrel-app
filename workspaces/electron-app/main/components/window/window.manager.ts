import { AppWindow } from './app.window';
import { SoundCaptureWindow } from './sound-capture.window';
import { Window } from './window';

export class WindowManager {
	private static _instance: WindowManager;

	private _windows: Window[] = [];

	public static get instance(): WindowManager {
		if (!WindowManager._instance) {
			WindowManager._instance = new WindowManager();
		}
		return WindowManager._instance;
	}

	public createAppWindow(): AppWindow {
		const window = new AppWindow();
		this.registerWindow(window);
		return window;
	}

	public createSoundCaptureWindow(): SoundCaptureWindow {
		const window = new SoundCaptureWindow();
		this.registerWindow(window);
		return window;
	}

	private registerWindow(window: Window): void {
		this._windows.push(window);
		window.electronWindow.on('closed', () => {
			const windowIndex = this._windows.indexOf(window);
			this._windows = [
				...this._windows.slice(0, windowIndex),
				...this._windows.slice(windowIndex),
			];
		});
	}
}
