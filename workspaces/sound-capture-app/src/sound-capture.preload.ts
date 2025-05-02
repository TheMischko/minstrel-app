import { ipcRenderer } from 'electron';
import { SoundCaptureChannels } from '../../shared-lib/models/messaging/sound-capture.channels';

export const api = {
	sendMessage(message: string): void {
		ipcRenderer.send(SoundCaptureChannels.INIT_MSG, message);
	},
	readMessage(callback: (message: string) => void): void {
		ipcRenderer.on(SoundCaptureChannels.INCOMING_MSG, (_, args) => {
			callback(args);
		});
	},
};
