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

@Component({
  selector: "app-player-progress-bar",
  imports: [],
  templateUrl: "./player-progress-bar.component.html",
  standalone: true,
  styleUrl: "./player-progress-bar.component.scss",
})
export class PlayerProgressBarComponent implements OnDestroy {
  trackPosition = input.required<number>();
  trackPositionFormatted = input.required<string>();
  trackLength = input.required<number>();
  trackLengthFormatted = input.required<string>();

  seek = output<number>();

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

  positionChanged(event: Event) {
    const value = (event?.srcElement as HTMLInputElement)?.value;
    if (value) {
      this.seek.emit(Number.parseFloat(value));
    }
  }
}
