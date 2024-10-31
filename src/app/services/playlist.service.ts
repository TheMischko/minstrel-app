import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, take, tap } from 'rxjs';
import { ElectronService } from './electron.service';
import { ElectronOperation } from '../models/electron-model';
import { PlaylistCreateData } from '../../../app/models/playlist-data-model';
import { Playlist } from '../models/playlist-model';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private channel = 'playlist';
  private playlists = new BehaviorSubject<Playlist[]>([]);
  private playlists$ = this.electronService
    .sendRequest<null, Playlist[]>(this.channel, {
      data: null,
      operation: ElectronOperation.Get,
    })
    .pipe(tap((playlists) => this.playlists.next(playlists)));

  constructor(private readonly electronService: ElectronService) {}

  listenToAllPlaylists(): Observable<Playlist[]> {
    this.playlists$.subscribe();
    return this.playlists.asObservable();
  }

  addPlaylist(playlist: PlaylistCreateData): Observable<Playlist> {
    const request = this.electronService.sendRequest<
      PlaylistCreateData,
      Playlist
    >(this.channel, {
      operation: ElectronOperation.Create,
      data: playlist,
    });

    return forkJoin([request, this.playlists$]).pipe(
      map(([playlist, playlists]) => playlist),
    );
  }
}
