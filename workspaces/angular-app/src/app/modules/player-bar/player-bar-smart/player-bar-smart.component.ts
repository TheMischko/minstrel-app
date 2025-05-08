import { Component, computed, inject, signal } from "@angular/core";
import { PlaybackStore } from "../../../store/playback.store";
import { PlaybackTrack } from "../../../services/audio-engine/playback-track";
import { PlayerBarComponent } from "../player-bar.component";
import { PlaybackLoopState } from "../../../models/playback-track.model";

@Component({
  selector: "app-player-bar-smart",
  imports: [PlayerBarComponent],
  templateUrl: "./player-bar-smart.component.html",
  standalone: true,
})
export class PlayerBarSmartComponent {
  playbackStore = inject(PlaybackStore);
  track = computed<PlaybackTrack | null>(() => this.playbackStore.mainTrack());
  trackLoading = computed(() => !this.track()?.loaded());
  trackPlaying = computed(() => this.track()?.playing());
  trackPosition = computed(() => this.track()?.position());
  trackPositionFormatted = computed(() =>
    this.formatTimeString(this.trackPosition()),
  );
  trackLength = computed(() => this.track()?.trackLength());
  trackLengthFormatted = computed(() =>
    this.formatTimeString(this.trackLength()),
  );
  trackError = computed(() => this.track()?.error());

  shuffle = signal<boolean>(true);
  looping = signal<PlaybackLoopState>(PlaybackLoopState.NONE);

  play(): void {
    this.track()?.play();
  }

  pause(): void {
    this.track()?.pause();
  }

  seek(newPos: number) {
    this.track()?.seek(newPos);
  }

  changeShuffle(shuffle: boolean): void {
    this.shuffle.set(shuffle);
  }

  changeLooping(looping: PlaybackLoopState): void {
    this.looping.set(looping);
  }

  private formatTimeString(time: number | undefined | null): string {
    if (!time) {
      return "--:--";
    }
    const seconds = Math.floor(time) % 60;
    const minutes = Math.floor(time / 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}
