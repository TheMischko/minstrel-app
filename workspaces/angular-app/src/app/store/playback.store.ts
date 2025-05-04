import { Sound } from "shared-lib/models/playback/sound.model";
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from "@ngrx/signals";
import { computed, inject, Injector } from "@angular/core";
import { AudioEngineService } from "../services/audio-engine/audio-engine.service";
import { PlaybackTrack } from "../services/audio-engine/playback-track";
import { shuffleArray } from "shared-lib/utils/shuffle-array";
import { waitForSignal } from "../shared/utils/wait-for-signal";

export interface PlaybackState {
  mainTrackIndex: number | null;
  mainQueue: PlaybackTrack[];
}

const initialState: PlaybackState = {
  mainTrackIndex: null,
  mainQueue: [],
};

export const PlaybackStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withComputed((store) => {
    const mainTrack = computed(() => {
      const queue = store.mainQueue();
      const activeIndex = store.mainTrackIndex();
      if (activeIndex === null || queue.length === 0) {
        return null;
      }
      return queue[activeIndex];
    });

    return {
      mainTrack,
    };
  }),
  withMethods(
    (
      store,
      audioEngine: AudioEngineService = inject(AudioEngineService),
      injector = inject(Injector),
    ) => {
      const addToQueue = (sounds: Sound[]) => {
        const tracks = sounds
          .filter((sound) => {
            return store
              .mainQueue()
              .every((queueTrack) => queueTrack.url !== sound.url);
          })
          .map((sound) => audioEngine.createTrack(sound.url));
        patchState(store, { mainQueue: [...store.mainQueue(), ...tracks] });
      };

      const shuffleQueue = () => {
        const queue = store.mainQueue();
        if (queue.length === 0) {
          return;
        }

        patchState(store, { mainQueue: shuffleArray(queue) });
      };

      const playFromQueue = async () => {
        if (store.mainTrackIndex() === null && store.mainQueue().length > 0) {
          patchState(store, { mainTrackIndex: 0 });
        }
        const index = store.mainTrackIndex();
        const queue = store.mainQueue();
        if (index === null || index >= queue.length) {
          return;
        }
        const track = queue[index];
        track.load();
        await waitForSignal(track.loaded, injector, (value) => value === true);
        track.play();
      };

      const playSingle = async (sound: Sound) => {
        patchState(store, { mainQueue: [], mainTrackIndex: null });
        addToQueue([sound]);
        await playFromQueue();
      };

      return {
        addToQueue,
        shuffleQueue,
        playFromQueue,
        playSingle,
      };
    },
  ),
);
