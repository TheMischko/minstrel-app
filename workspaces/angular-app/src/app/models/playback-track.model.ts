export enum PlaybackTrackErrorType {
  LOAD_ERROR = "LOAD_ERROR",
  PLAYBACK_ERROR = "PLAYBACK_ERROR",
}

export interface PlaybackTrackError {
  type: PlaybackTrackErrorType;
  message: string;
}

export enum PlaybackLoopState {
  NONE,
  CURRENT,
  PLAYLIST
}