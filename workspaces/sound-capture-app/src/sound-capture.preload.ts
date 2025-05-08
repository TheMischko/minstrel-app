import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("SoundCaptureAPI", {
  send: (channel: string, data?: unknown) => ipcRenderer.send(channel, data),
  invoke: (channel: string, data?: unknown) =>
    ipcRenderer.invoke(channel, data),
});
