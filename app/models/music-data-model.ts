export interface MusicAllData {
  id: number;
  title: string;
  filePath: string;
  dateCreated: Date;
  dateLastUpdated: Date;
}

export interface MusicCreateData {
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
