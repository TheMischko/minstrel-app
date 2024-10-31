import { Tables } from '../models/database-data-model';
import { DatabaseManager } from './database-manager';
import { MusicAllData, MusicCreateData } from '../models/music-data-model';
import { PlaylistAllData } from '../models/playlist-data-model';

export class MusicManager {
  table: Tables = Tables.Music;

  constructor(private readonly database: DatabaseManager) {}

  async getAllMusic(): Promise<MusicAllData[]> {
    return this.database.findAll<MusicAllData>(this.table);
  }

  async getById(musicId: number): Promise<MusicAllData> {
    return this.database.findById(this.table, musicId);
  }

  async create(data: MusicCreateData): Promise<MusicAllData> {
    return this.database.insert<MusicAllData>(this.table, data);
  }

  async delete(musicId: number): Promise<number> {
    return await this.database.removeById(this.table, musicId);
  }

  async update(
    musicId: number,
    data: Partial<MusicCreateData>,
  ): Promise<number> {
    return await this.database.update<MusicAllData>(this.table, musicId, data);
  }
}
