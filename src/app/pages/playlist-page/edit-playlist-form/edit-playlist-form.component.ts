import { Component, input } from '@angular/core';
import { InputComponent } from '../../../shared/controls/input/input.component';
import { ButtonComponent } from '../../../shared/controls/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Playlist } from '../../../models/playlist-model';
import { PlaylistService } from '../../../services/playlist.service';

@Component({
  selector: 'app-edit-playlist-form',
  standalone: true,
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './edit-playlist-form.component.html',
  styleUrl: './edit-playlist-form.component.scss',
})
export class EditPlaylistFormComponent {
  originalPlaylist = input<Playlist | null>(null);

  data = new FormGroup({
    title: new FormControl<string>(''),
    imageUrl: new FormControl<string>(''),
  });

  constructor(private readonly playlistService: PlaylistService) {}

  submitForm() {
    const formValue = this.data.value;
    if (!formValue.title) {
      console.error('No value for Playlist title');
      return;
    }
    this.playlistService
      .addPlaylist({
        title: formValue.title,
        imageUrl: formValue.imageUrl,
      })
      .subscribe((newPlaylist) => console.log('New playlist', newPlaylist));
  }

  cancelForm() {}
}
