import os from 'os';
import { AudioPlayer } from './AudioPlayer.js';
import { AudioPlayerDarwinImpl } from './AudioPlayerDarwinImpl.js';
import { AudioPlayerLinuxImpl } from './AudioPlayerLinuxImpl.js';
import { AudioPlayerWindowsImpl } from './AudioPlayerWindowsImpl.js';

export class AudioPlayerPlatformFactory {
  public static create(): AudioPlayer {
    const platform = os.platform();
    if (platform === 'darwin') {
      return new AudioPlayerDarwinImpl();
    }
    if (platform === 'win32') {
      return new AudioPlayerWindowsImpl();
    }
    // Default to Linux (ffplay)
    return new AudioPlayerLinuxImpl();
  }
}
