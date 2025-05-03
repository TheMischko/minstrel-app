import { Injector, Signal } from "@angular/core";
import { AudioTrackOptions } from "shared-lib/models/playback/sound.model";

// Rate in which the current position of playing sound is evaluated.
export const PLAYBACK_POSITION_REFRESH_RATE = 500;

export interface PlaybackTrackPlayer {
  loaded: Signal<boolean>;
  loadError: Signal<string | null>;
  playing: Signal<boolean>;
  playError: Signal<string | null>;
  playbackPosition: Signal<number>;
  ended: Signal<boolean>;
  trackLength: Signal<number | null>;
  volume: Signal<number>;

  url: string;
  options: AudioTrackOptions;

  load(): void;
  play(): void;
  stop(): void;
  pause(): void;
  seek(position: number): void;
  setVolume(volume: number): void;
}

export interface PlaybackTrackPlayerFactory {
  create: (
    url: string,
    options: AudioTrackOptions,
    injector?: Injector,
  ) => PlaybackTrackPlayer;
}
