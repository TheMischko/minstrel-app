import { DatabaseManager } from './database-manager';
import { Tables } from '../models/database-data-model';
import { PlaylistAllData } from '../models/playlist-data-model';

export class PlaylistManager {
  table: Tables = Tables.Playlist;

  constructor(private readonly database: DatabaseManager) {}

  async getAllPlaylists(): Promise<PlaylistAllData[]> {
    return this.database.findAll<PlaylistAllData>(this.table);
  }
}
