export interface PlaylistAllData {
  id: number;
  title: string;
  imageUrl?: string;
  dateCreated: Date;
  dateLastUpdated: Date;
}

export interface PlaylistCreateData {
  title: string;
  imageUrl: string | null | undefined;
}
