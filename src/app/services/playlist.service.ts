import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private playlists = new BehaviorSubject<Playlist[]>([]);

  listenToAllPlaylists(): Observable<Playlist[]> {
    return this.playlists.asObservable();
  }

  addPlaylist(playlist: Playlist): void {
    const oldVal = this.playlists.value;
    this.playlists.next([...oldVal, playlist]);
  }
}

type Playlist = string;
