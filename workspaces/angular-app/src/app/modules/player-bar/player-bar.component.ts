import {
  Component,
  effect,
  EffectRef,
  ElementRef,
  input,
  OnDestroy,
  output,
  viewChild,
} from "@angular/core";
import { PlaybackTrack } from "../../services/audio-engine/playback-track";
import { PlaybackTrackError } from "../../models/playback-track.model";
import { PlayerBarMainControlsComponent } from "./player-bar-main-controls/player-bar-main-controls.component";

@Component({
  selector: "app-player-bar",
  imports: [PlayerBarMainControlsComponent],
  templateUrl: "./player-bar.component.html",
  standalone: true,
  styleUrl: "./player-bar.component.scss",
})
export class PlayerBarComponent implements OnDestroy {
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

  trackPositionInput = viewChild("trackPositionInput", {
    read: ElementRef<HTMLInputElement>,
  });

  positionInputEffect: EffectRef | undefined;

  constructor() {
    this.positionInputEffect = effect(() => {
      const positionInput = this.trackPositionInput()?.nativeElement;
      if (positionInput) {
        positionInput.value = this.trackPosition();
        const value = positionInput.value / this.trackLength();
        positionInput.style.background = `linear-gradient(to right, dodgerblue 0%, dodgerblue ${value * 100}%, transparent ${value * 100}%, transparent 100%)`;

        positionInput.addEventListener("input", () => {
          const value = positionInput.value / this.trackLength();
          positionInput.style.background = `linear-gradient(to right, dodgerblue 0%, dodgerblue ${value * 100}%, transparent ${value * 100}%, transparent 100%)`;
        });
      }
    });
  }

  ngOnDestroy() {
    this.positionInputEffect?.destroy();
  }

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

  positionChanged(event: Event) {
    const value = (event?.srcElement as HTMLInputElement)?.value;
    if (value) {
      this.seek.emit(Number.parseFloat(value));
    }
  }
}
