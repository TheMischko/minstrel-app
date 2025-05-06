import { Component, input, output } from "@angular/core";
import { PlaybackTrack } from "../../services/audio-engine/playback-track";
import { PlaybackTrackError } from "../../models/playback-track.model";
import { PlayerBarMainControlsComponent } from "./player-bar-main-controls/player-bar-main-controls.component";
import { PlayerProgressBarComponent } from "./player-progress-bar/player-progress-bar.component";

@Component({
  selector: "app-player-bar",
  imports: [PlayerBarMainControlsComponent, PlayerProgressBarComponent],
  templateUrl: "./player-bar.component.html",
  standalone: true,
  styleUrl: "./player-bar.component.scss",
})
export class PlayerBarComponent {
  track = input.required<PlaybackTrack | null>();
  trackLoading = input.required<boolean>();
  trackPlaying = input.required<boolean>();
  trackPosition = input<number>(0);
  trackPositionFormatted = input.required<string>();
  trackLength = input<number>(0);
  trackLengthFormatted = input.required<string>();
  trackError = input.required<PlaybackTrackError | null>();

  startPlaying = output<void>();
  pausePlaying = output<void>();
  stopPlaying = output<void>();
  next = output<void>();
  prev = output<void>();
  seek = output<number>();
  volume = output<number>();

  onSeekInput(position: number) {
    this.seek.emit(position);
  }

  onPlayButtonClicked() {
    if (this.trackPlaying()) {
      this.pausePlaying.emit();
      return;
    }
    this.startPlaying.emit();
  }

  onSeek(newVal: number) {
    this.seek.emit(newVal);
  }
}
