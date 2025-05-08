import { Component, input, output } from "@angular/core";
import {
  LucideAngularModule,
  PauseIcon,
  PlayIcon,
  Repeat1Icon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-angular";
import { PlaybackLoopState } from "../../../models/playback-track.model";

@Component({
  selector: "app-player-bar-main-controls",
  imports: [LucideAngularModule],
  templateUrl: "./player-bar-main-controls.component.html",
  standalone: true,
  styleUrl: "./player-bar-main-controls.component.scss",
})
export class PlayerBarMainControlsComponent {
  trackPlaying = input.required<boolean>();
  shuffle = input.required<boolean>();
  looping = input.required<PlaybackLoopState>();

  trackPlay = output<void>();
  trackPause = output<void>();
  next = output<void>();
  prev = output<void>();
  loopingChange = output<PlaybackLoopState>();
  shuffleChange = output<boolean>();

  changeLooping() {
    let nextLoopingState: PlaybackLoopState;
    switch (this.looping()) {
      case PlaybackLoopState.NONE: {
        nextLoopingState = PlaybackLoopState.PLAYLIST;
        break;
      }
      case PlaybackLoopState.PLAYLIST: {
        nextLoopingState = PlaybackLoopState.CURRENT;
        break;
      }
      case PlaybackLoopState.CURRENT: {
        nextLoopingState = PlaybackLoopState.NONE;
        break;
      }
    }
    this.loopingChange.emit(nextLoopingState);
  }

  changeShuffle() {
    this.shuffleChange.emit(!this.shuffle());
  }

  readonly PlayIcon = PlayIcon;
  readonly PauseIcon = PauseIcon;
  readonly SkipForwardIcon = SkipForwardIcon;
  readonly SkipBackwardIcon = SkipBackIcon;
  readonly ShuffleIcon = ShuffleIcon;
  readonly RepeatIcon = RepeatIcon;
  readonly RepeatOneIcon = Repeat1Icon;
  protected readonly PlaybackLoopState = PlaybackLoopState;
}
