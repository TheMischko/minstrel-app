export interface SoundCaptureAPI {
  send: (channel: string, data?: unknown) => void;
  invoke: (channel: string, data?: unknown) => Promise<unknown>;
}

declare global {
  interface Window {
    SoundCaptureAPI: SoundCaptureAPI;
  }
}
