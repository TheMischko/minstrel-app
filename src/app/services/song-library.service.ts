import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SongLibraryService {
  songs = new BehaviorSubject<Song[]>([]);

  listenToAllSongs(): Observable<Song[]> {
    return this.songs.asObservable();
  }

  addSong(song: Song): void {
    const oldVal = this.songs.value;
    this.songs.next([...oldVal, song]);
  }
}

type Song = string;
