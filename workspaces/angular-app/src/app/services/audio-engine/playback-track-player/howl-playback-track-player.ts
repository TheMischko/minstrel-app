import {
  computed,
  effect,
  EffectRef,
  Injector,
  runInInjectionContext,
  signal,
} from "@angular/core";
import {
  PLAYBACK_POSITION_REFRESH_RATE,
  PlaybackTrackPlayer,
} from "./playback-track-player";
import { AudioTrackOptions } from "shared-lib/models/playback/sound.model";
import { HowlOptions, Howl } from "howler";

export class HowlPlaybackTrackPlayer implements PlaybackTrackPlayer {
  loaded = signal<boolean>(false);
  loadError = signal<string | null>(null);
  playing = signal<boolean>(false);
  playError = signal<string | null>(null);
  playbackPosition = signal<number>(0);
  ended = signal<boolean>(false);
  volume = signal<number>(1);
  trackLength = computed(() => {
    if (this.loaded()) {
      return this.howl.duration();
    }
    return null;
  });

  private howl: Howl;
  private positionScreeningTimer: unknown | null = null;
  private positionScreeningEffect: EffectRef | undefined;

  constructor(
    public readonly url: string,
    public readonly options: AudioTrackOptions,
    private injector?: Injector,
  ) {
    this.howl = new Howl({
      src: this.url,
      ...HowlPlaybackTrackPlayer.mapAudioTrackOptionsToHowlOptions(options),
    });
    this.setupHowl();
    this.setupPlaybackPositionScreening();
  }

  destroy() {
    this.positionScreeningEffect?.destroy();
  }

  load(): void {
    this.howl.load();
  }
  play(): void {
    this.howl.play();
  }
  stop(): void {
    this.howl.stop();
    this.playbackPosition.set(0);
  }
  seek(position: number): void {
    this.howl.seek(position);
    this.playbackPosition.set(position);
  }
  pause(): void {
    this.howl.pause();
  }
  setVolume(volume: number) {
    this.howl.volume(volume);
  }

  private setupHowl() {
    this.howl.on("load", () => {
      this.loaded.set(true);
    });
    this.howl.on("loaderror", (_, err) => {
      this.loadError.set(err as string);
    });
    this.howl.on("play", () => {
      this.playing.set(true);
      this.ended.set(false);
    });
    this.howl.on("playerror", (_, err) => {
      this.playError.set(err as string);
      this.playing.set(false);
    });
    this.howl.on("pause", () => {
      this.playing.set(false);
    });
    this.howl.on("end", () => {
      this.playing.set(false);
      this.ended.set(true);
    });
    this.howl.on("stop", () => {
      this.playing.set(false);
    });
    this.howl.on("volume", (_: unknown, volume: unknown) => {
      this.volume.set(Number.parseFloat((volume as number).toString()));
    });
  }

  private setupPlaybackPositionScreening() {
    if (!this.injector) {
      return;
    }
    runInInjectionContext(this.injector, () => {
      this.positionScreeningEffect = effect(() => {
        if (this.playing()) {
          if (!this.positionScreeningTimer) {
            this.positionScreeningTimer = setInterval(() => {
              this.playbackPosition.set(this.howl.seek() as number);
            }, PLAYBACK_POSITION_REFRESH_RATE);
          }
          return;
        }

        if (this.positionScreeningTimer) {
          clearInterval(this.positionScreeningTimer as number);
          this.positionScreeningTimer = null;
        }
      });
    });
  }

  private static mapAudioTrackOptionsToHowlOptions(
    options: AudioTrackOptions,
  ): Partial<HowlOptions> {
    return {
      volume: options.volume,
      rate: options.speed,
    };
  }
}
