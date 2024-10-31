import { DatabaseManager } from './database-manager';
import { Tables } from '../models/database-data-model';
import {
  PlaylistAllData,
  PlaylistCreateData,
} from '../models/playlist-data-model';

export class PlaylistManager {
  table: Tables = Tables.Playlist;

  constructor(private readonly database: DatabaseManager) {}

  async getAllPlaylists(): Promise<PlaylistAllData[]> {
    return this.database.findAll<PlaylistAllData>(this.table);
  }

  async create(data: PlaylistCreateData): Promise<PlaylistAllData> {
    return this.database.insert<PlaylistAllData>(this.table, data as any);
  }
}
