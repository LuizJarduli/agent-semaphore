import { spawn } from 'child_process';
import { AudioPlayer } from './AudioPlayer.js';

export class AudioPlayerLinuxImpl implements AudioPlayer {
  public play(source: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Use ffplay with flags to play without UI and auto exit
      const process = spawn('ffplay', ['-nodisp', '-autoexit', '-loglevel', 'quiet', source]);

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`ffplay process exited with code ${code}`));
        }
      });

      process.on('error', (err) => {
        reject(err);
      });
    });
  }
}
