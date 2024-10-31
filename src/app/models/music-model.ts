export interface Music {
  id: number;
  title: string;
  filePath: string;
  dateCreated: Date;
  dateLastUpdated: Date;
}

export interface CreateMusicData {
  title: string;
  filePath: string;
}

export interface MusicDeleteData {
  id: number;
}

export interface MusicUpdateData {
  id: number;
  title?: string;
  filePath?: string;
}
