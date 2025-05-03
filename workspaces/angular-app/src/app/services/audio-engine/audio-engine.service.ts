import { inject, Injectable, Injector } from "@angular/core";
import { HowlPlaybackTrackPlayerFactory } from "./playback-track-player/howl-playback-track-player.factory";
import { PlaybackTrack } from "./playback-track";
import { AudioTrackOptions } from "shared-lib/models/playback/sound.model";

@Injectable({
  providedIn: "root",
})
export class AudioEngineService {
  private injector = inject(Injector);
  private playbackTrackPlayerFactory = new HowlPlaybackTrackPlayerFactory();
  private baseOptions: AudioTrackOptions = {
    volume: 1,
    speed: 1,
  };

  public createTrack(url: string): PlaybackTrack {
    return new PlaybackTrack(
      url,
      this.baseOptions,
      this.playbackTrackPlayerFactory,
    );
  }

  public setBaseOptions(options: AudioTrackOptions) {
    this.baseOptions = options;
  }
}
