import { spawn } from 'child_process';
import { AudioPlayer } from './AudioPlayer.js';

export class AudioPlayerWindowsImpl implements AudioPlayer {
  public play(source: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Use powershell SoundPlayer for headless wav file playback
      const psCommand = `(New-Object System.Media.SoundPlayer '${source}').PlaySync()`;
      const process = spawn('powershell.exe', ['-c', psCommand]);

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          // Fallback to starting wmplayer if powershell fails
          const wmplayer = spawn('cmd.exe', ['/c', `start wmplayer "${source}" /play /close`]);
          wmplayer.on('close', (wmCode) => {
            if (wmCode === 0) {
              resolve();
            } else {
              reject(new Error(`Failed to play sound on Windows. PS code: ${code}, WMP code: ${wmCode}`));
            }
          });
        }
      });

      process.on('error', (err) => {
        reject(err);
      });
    });
  }
}
