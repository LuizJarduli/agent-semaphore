import { AudioPlayer } from './AudioPlayer.js';
import chalk from 'chalk';
import figlet from 'figlet';

export class AudioPlayerService {
  constructor(private readonly _audioPlayer: AudioPlayer) {}

  public async play(soundPath: string): Promise<void> {
    try {
      await this._audioPlayer.play(soundPath);
    } catch (error) {
      // Fallback: Trigger terminal beep sound if system player fails
      process.stdout.write('\a');
      console.warn(chalk.yellow(`[SignalMe] Platform audio failed to play, triggered terminal beep. Detail: ${(error as Error).message}`));
    }
  }

  public greet(): void {
    console.log(chalk.cyan(figlet.textSync('SignalMe', { font: 'Speed' })));
  }
}
