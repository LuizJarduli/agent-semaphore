export interface AudioPlayer {
  play(source: string): Promise<void>;
}
