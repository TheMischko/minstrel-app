import { IController } from '../models/IController-model';
import { ipcMain } from 'electron';
import { PlaylistManager } from '../managers/playlist-manager';
import {
  ElectronRequest,
  RequestOperation,
} from '../models/request-data-model';
import { PlaylistCreateData } from '../models/playlist-data-model';

export class PlaylistController implements IController {
  constructor(private readonly playlistManager: PlaylistManager) {}

  registerHandlers() {
    console.log('PlaylistController registered.');
    ipcMain.handle('playlist', (_, request: ElectronRequest<any>) =>
      this.routeRequest(request),
    );
  }

  async routeRequest(request: ElectronRequest<any>) {
    switch (request.operation) {
      case RequestOperation.Create: {
        return await this.createPlaylist(request.data);
      }
      default:
        return await this.getAllPlaylists();
    }
  }

  async createPlaylist(data: PlaylistCreateData) {
    return await this.playlistManager.create(data);
  }

  async getAllPlaylists() {
    return await this.playlistManager.getAllPlaylists();
  }
}
