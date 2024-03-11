export const compatibleFormats: IcompatibleFormats = {
  wav: ["wav", "mp3", "aac", "flac", "ogg", "wma", "aiff", "ac3", "m4a"],
  mp3: ["mp3", "wav", "aac", "flac", "ogg", "wma", "m4a"],
  aac: ["aac", "mp3", "wav", "flac", "ogg", "m4a"],
  flac: ["flac", "wav", "mp3", "aac", "ogg", "m4a"],
  ogg: ["ogg", "flac", "mp3", "aac", "wav"],
  mkv: ["mkv", "mp4", "avi", "mov", "flv", "webm", "mpeg"],
  mp4: ["mp4", "mkv", "avi", "mov", "flv", "webm", "mpeg"],
  avi: ["avi", "mp4", "mkv", "mov", "flv", "webm", "mpeg"],
  mov: ["mov", "mp4", "mkv", "avi", "flv", "webm", "mpeg"],
  webm: ["webm", "mkv", "mp4", "avi", "mov", "flv", "mpeg"],
  mpeg: ["mpeg", "mp4", "mkv", "avi", "mov", "flv", "webm"]
}

interface IcompatibleFormats {
  [key: string]: string[];
}