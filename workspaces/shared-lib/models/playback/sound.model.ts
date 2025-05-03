export interface Sound {
  url: string;
  name: string;
}

export interface AudioTrackOptions {
  // Volume of the track between 0 and 1.
  volume?: number;
  // The playback speed of the track. Default is 1.
  speed?: number;
}
