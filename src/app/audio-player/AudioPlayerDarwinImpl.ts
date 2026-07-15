import { spawn } from 'child_process';
import { AudioPlayer } from './AudioPlayer.js';

export class AudioPlayerDarwinImpl implements AudioPlayer {
  public play(source: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn('afplay', [source]);

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`afplay process exited with code ${code}`));
        }
      });

      process.on('error', (err) => {
        reject(err);
      });
    });
  }
}
