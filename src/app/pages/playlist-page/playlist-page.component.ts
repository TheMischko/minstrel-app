import { Component, inject } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { AsyncPipe } from '@angular/common';
import { take } from 'rxjs';
import { ButtonComponent } from '../../shared/controls/button/button.component';
import { EditPlaylistFormComponent } from './edit-playlist-form/edit-playlist-form.component';
import { PlaylistStore } from '../../services/stores/playlist.store';

@Component({
  selector: 'app-playlist-page',
  standalone: true,
  imports: [AsyncPipe, ButtonComponent, EditPlaylistFormComponent],
  templateUrl: './playlist-page.component.html',
  styleUrl: './playlist-page.component.scss',
})
export class PlaylistPageComponent {
  playlistService = inject(PlaylistService);
  playlistStore = inject(PlaylistStore);

  updatePlaylists() {
    this.playlistService.listenToAllPlaylists().pipe(take(1)).subscribe();
  }
}
