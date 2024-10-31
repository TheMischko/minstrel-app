import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { PlaylistService } from '../playlist.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { finalize, map, pipe, switchMap, tap } from 'rxjs';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { PlaylistAllData } from '../../../../app/models/playlist-data-model';

type PlaylistStoreState = {
  loading: boolean;
};

const initialState: PlaylistStoreState = {
  loading: false,
};

export const PlaylistStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities<PlaylistAllData>(),
  withMethods((store, playlistService = inject(PlaylistService)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() => {
          return playlistService.listenToAllPlaylists().pipe(
            map((playlists) => {
              patchState(store, setAllEntities(playlists));
            }),
            finalize(() => {
              patchState(store, { loading: false });
            }),
          );
        }),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      store.load();
    },
  }),
);
