import { IController } from '../models/IController-model';
import { MusicManager } from '../managers/music-manager';
import { ipcMain } from 'electron';
import {
  ElectronRequest,
  GetRequestData,
  RequestOperation,
} from '../models/request-data-model';
import {
  MusicCreateData,
  MusicDeleteData,
  MusicUpdateData,
} from '../models/music-data-model';

export class MusicController implements IController {
  constructor(private readonly musicManager: MusicManager) {}

  registerHandlers() {
    console.log('MusicController registered.');
    ipcMain.handle('music', (_, request: ElectronRequest<any>) => {
      this.routeRequest(request);
    });
  }

  private async routeRequest(request: ElectronRequest<any>) {
    switch (request.operation) {
      case RequestOperation.Create: {
        return await this.handleCreateMusic(request.data);
      }
      case RequestOperation.Delete: {
        return await this.handleDeleteMusic(request.data);
      }
      case RequestOperation.Update: {
        return await this.handleUpdateMusic(request.data);
      }
      default: {
        return await this.handleGetMusic(request.data);
      }
    }
  }

  private async handleCreateMusic(data: MusicCreateData) {
    return this.musicManager.create(data);
  }

  private async handleDeleteMusic(data: MusicDeleteData) {
    return this.musicManager.delete(data.id);
  }

  private async handleUpdateMusic(data: MusicUpdateData) {
    return this.musicManager.update(data.id, {
      title: data.title,
      filePath: data.filePath,
    });
  }

  private async handleGetMusic(data: GetRequestData) {
    if (data.get === 'byId') {
      return this.getById(data.id);
    }

    return this.getAllMusic();
  }

  private async getAllMusic() {
    return this.musicManager.getAllMusic();
  }

  private getById(id: number) {
    return this.musicManager.getById(id);
  }
}
