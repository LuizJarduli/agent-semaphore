import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

export class CursorDriver {
  private getSettingsPath(): string {
    const platform = os.platform();
    if (platform === 'darwin') {
      return path.join(os.homedir(), 'Library', 'Application Support', 'Cursor', 'User', 'settings.json');
    }
    if (platform === 'win32') {
      return path.join(os.homedir(), 'AppData', 'Roaming', 'Cursor', 'User', 'settings.json');
    }
    // Linux default
    return path.join(os.homedir(), '.config', 'Cursor', 'User', 'settings.json');
  }

  public async enable(): Promise<void> {
    const settingsPath = this.getSettingsPath();
    try {
      await fs.mkdir(path.dirname(settingsPath), { recursive: true });

      let settings: any = {};
      try {
        const fileContent = await fs.readFile(settingsPath, 'utf-8');
        settings = JSON.parse(fileContent);
      } catch {
        settings = {};
      }

      settings['terminal.integrated.bellToAlert'] = true;
      settings['terminal.integrated.enableBell'] = true;

      await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
      console.log(chalk.green('✔ Cursor terminal bell alerts enabled in user settings.json'));
      console.log(chalk.cyan('ℹ To play sound on Cursor Composer completion:'));
      console.log(chalk.cyan('  1. Open Cursor settings (Cmd+Shift+J)'));
      console.log(chalk.cyan('  2. Go to Features -> Composer'));
      console.log(chalk.cyan('  3. Toggle ON "Play sound on agent completion"'));
    } catch (error) {
      throw new Error(`Failed to configure Cursor: ${(error as Error).message}`);
    }
  }

  public async disable(): Promise<void> {
    const settingsPath = this.getSettingsPath();
    try {
      let settings: any = {};
      try {
        const fileContent = await fs.readFile(settingsPath, 'utf-8');
        settings = JSON.parse(fileContent);
      } catch {
        return; // No settings file, nothing to do
      }

      delete settings['terminal.integrated.bellToAlert'];
      delete settings['terminal.integrated.enableBell'];

      await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
      console.log(chalk.green('✔ Cursor terminal bell alerts disabled in user settings.json'));
    } catch (error) {
      throw new Error(`Failed to disable Cursor options: ${(error as Error).message}`);
    }
  }
}
