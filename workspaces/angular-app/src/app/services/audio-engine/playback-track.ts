import {
  PlaybackTrackError,
  PlaybackTrackErrorType,
} from "../../models/playback-track.model";
import { computed, Injector } from "@angular/core";
import {
  PlaybackTrackPlayer,
  PlaybackTrackPlayerFactory,
} from "./playback-track-player/playback-track-player";
import { AudioTrackOptions } from "shared-lib/models/playback/sound.model";

export class PlaybackTrack {
  private trackPlayer!: PlaybackTrackPlayer;

  constructor(
    public readonly url: string,
    options: AudioTrackOptions,
    playerFactory: PlaybackTrackPlayerFactory,
    injector?: Injector,
  ) {
    this.trackPlayer = playerFactory.create(url, options, injector);
  }

  public loaded = computed(() => this.trackPlayer.loaded());
  public playing = computed(() => this.trackPlayer.playing());
  public position = computed(() => this.trackPlayer.playbackPosition());
  public ended = computed(() => this.trackPlayer.ended());
  public volume = computed(() => this.trackPlayer.volume());
  public trackLength = computed(() => this.trackPlayer.trackLength());
  public error = computed<PlaybackTrackError | null>(() => {
    const playError = this.trackPlayer.playError();
    if (playError) {
      return {
        type: PlaybackTrackErrorType.PLAYBACK_ERROR,
        message: playError,
      };
    }
    const loadError = this.trackPlayer.loadError();
    if (loadError) {
      return {
        type: PlaybackTrackErrorType.LOAD_ERROR,
        message: loadError,
      };
    }
    return null;
  });

  load(): void {
    this.trackPlayer.load();
  }
  play(): void {
    this.trackPlayer.play();
  }
  pause(): void {
    this.trackPlayer.pause();
  }
  stop(): void {
    this.trackPlayer.stop();
  }
  seek(position: number): void {
    this.trackPlayer.seek(position);
  }
  setVolume(volume: number): void {
    this.trackPlayer.setVolume(volume);
  }
}
