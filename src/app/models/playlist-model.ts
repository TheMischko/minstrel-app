export interface Playlist {
  id: number;
  title: string;
  imageUrl?: string;
  dateCreated: Date;
  dateLastUpdated: Date;
}

export interface CreatePlaylistData {
  title: string;
  imageUrl?: string;
}
