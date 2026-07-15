import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export interface SignalMeConfig {
  version: string;
  sounds: {
    success: string;
    error: string;
    attention: string;
  };
  enabledDrivers: string[];
}

export class ConfigManager {
  private readonly configDir = path.join(os.homedir(), '.signalme');
  private readonly configPath = path.join(this.configDir, 'config.json');

  public async init(): Promise<void> {
    try {
      // Create config directory if it does not exist
      await fs.mkdir(this.configDir, { recursive: true });

      // Create assets directory for custom sounds
      const assetsDir = path.join(this.configDir, 'assets');
      await fs.mkdir(assetsDir, { recursive: true });

      // Check if config.json exists
      try {
        await fs.access(this.configPath);
      } catch {
        // File does not exist, create default config
        const defaultConfig = this.getDefaultConfig();
        await fs.writeFile(this.configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
      }
    } catch (error) {
      throw new Error(`Failed to initialize configuration: ${(error as Error).message}`);
    }
  }

  public async readConfig(): Promise<SignalMeConfig> {
    try {
      await this.init(); // Make sure directory & file exist
      const data = await fs.readFile(this.configPath, 'utf-8');
      return JSON.parse(data) as SignalMeConfig;
    } catch (error) {
      throw new Error(`Failed to read configuration: ${(error as Error).message}`);
    }
  }

  public async updateConfig(newConfig: Partial<SignalMeConfig>): Promise<void> {
    try {
      const currentConfig = await this.readConfig();
      const updatedConfig = {
        ...currentConfig,
        ...newConfig,
        sounds: {
          ...currentConfig.sounds,
          ...(newConfig.sounds || {}),
        },
      };
      await fs.writeFile(this.configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Failed to update configuration: ${(error as Error).message}`);
    }
  }

  private getDefaultConfig(): SignalMeConfig {
    const platform = os.platform();
    let success = '';
    let error = '';
    let attention = '';

    if (platform === 'darwin') {
      success = '/System/Library/Sounds/Glass.aiff';
      error = '/System/Library/Sounds/Basso.aiff';
      attention = '/System/Library/Sounds/Ping.aiff';
    } else if (platform === 'win32') {
      success = 'C:\\Windows\\Media\\notify.wav';
      error = 'C:\\Windows\\Media\\Windows Background.wav';
      attention = 'C:\\Windows\\Media\\Windows Balloon.wav';
    } else {
      // Linux/Other fallback paths
      success = '/usr/share/sounds/freedesktop/stereo/complete.oga';
      error = '/usr/share/sounds/freedesktop/stereo/dialog-error.oga';
      attention = '/usr/share/sounds/freedesktop/stereo/message.oga';
    }

    return {
      version: '1.0.0',
      sounds: {
        success,
        error,
        attention,
      },
      enabledDrivers: [],
    };
  }
}
