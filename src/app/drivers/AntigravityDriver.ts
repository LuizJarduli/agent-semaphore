import { ConfigManager } from '../config/ConfigManager.js';
import chalk from 'chalk';

export class AntigravityDriver {
  private readonly configManager = new ConfigManager();

  public async enable(): Promise<void> {
    try {
      const config = await this.configManager.readConfig();
      if (!config.enabledDrivers.includes('antigravity')) {
        config.enabledDrivers.push('antigravity');
        await this.configManager.updateConfig({ enabledDrivers: config.enabledDrivers });
      }
      console.log(chalk.green('✔ Antigravity Driver registered in ~/.signalme/config.json'));
      console.log(chalk.cyan('ℹ To alert yourself when Antigravity completes a task in shell:'));
      console.log(chalk.cyan('  Add this function to your ~/.zshrc or ~/.bashrc:'));
      console.log(chalk.grey(`
  sem() {
      "$@"
      local status=$?
      if [ $status -eq 0 ]; then
          signalme play success
      else
          signalme play error
      fi
      return $status
  }
      `));
      console.log(chalk.cyan('  Then execute your agent commands as:'));
      console.log(chalk.cyan('  sem agy "your command here"'));
    } catch (error) {
      throw new Error(`Failed to configure Antigravity driver: ${(error as Error).message}`);
    }
  }

  public async disable(): Promise<void> {
    try {
      const config = await this.configManager.readConfig();
      const updatedDrivers = config.enabledDrivers.filter(d => d !== 'antigravity');
      await this.configManager.updateConfig({ enabledDrivers: updatedDrivers });
      console.log(chalk.green('✔ Antigravity Driver deregistered from ~/.signalme/config.json'));
    } catch (error) {
      throw new Error(`Failed to disable Antigravity driver: ${(error as Error).message}`);
    }
  }
}
