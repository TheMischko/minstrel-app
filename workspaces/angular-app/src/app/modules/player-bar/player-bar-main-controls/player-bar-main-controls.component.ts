import { Component, input, output } from "@angular/core";
import {
  LucideAngularModule,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-angular";

@Component({
  selector: "app-player-bar-main-controls",
  imports: [LucideAngularModule],
  templateUrl: "./player-bar-main-controls.component.html",
  standalone: true,
  styleUrl: "./player-bar-main-controls.component.scss",
})
export class PlayerBarMainControlsComponent {
  trackPlaying = input.required<boolean>();

  trackPlay = output<void>();
  trackPause = output<void>();
  next = output<void>();
  prev = output<void>();

  readonly PlayIcon = PlayIcon;
  readonly PauseIcon = PauseIcon;
  readonly SkipForwardIcon = SkipForwardIcon;
  readonly SkipBackwardIcon = SkipBackIcon;
}
