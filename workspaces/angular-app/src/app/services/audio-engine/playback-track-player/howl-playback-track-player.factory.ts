import { PlaybackTrackPlayerFactory } from "./playback-track-player";
import { HowlPlaybackTrackPlayer } from "./howl-playback-track-player";
import { AudioTrackOptions } from "shared-lib/models/playback/sound.model";
import { Injector } from "@angular/core";

export class HowlPlaybackTrackPlayerFactory
  implements PlaybackTrackPlayerFactory
{
  create(
    url: string,
    options: AudioTrackOptions,
    injector?: Injector,
  ): HowlPlaybackTrackPlayer {
    return new HowlPlaybackTrackPlayer(url, options, injector);
  }
}
