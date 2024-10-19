import { IController } from '../models/IController-model';
import { ipcMain } from 'electron';
import { PlaylistManager } from '../managers/playlist-manager';

export class PlaylistController implements IController {
  constructor(private readonly playlistManager: PlaylistManager) {}

  registerHandlers() {
    console.log('PlaylistController registered.');
    ipcMain.handle('playlist/get-all', (_, request) =>
      this.routeRequest(request),
    );
  }

  async routeRequest(request: { operation: string }) {
    switch (request) {
      default:
        return await this.getAllPlaylists();
    }
  }

  async getAllPlaylists() {
    return await this.playlistManager.getAllPlaylists();
  }
}
