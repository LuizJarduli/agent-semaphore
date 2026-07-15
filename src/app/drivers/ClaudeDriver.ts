import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

export class ClaudeDriver {
  private readonly claudeConfigPath = path.join(os.homedir(), '.claude', 'settings.json');

  public async enable(): Promise<void> {
    try {
      // Ensure the directory exists
      await fs.mkdir(path.dirname(this.claudeConfigPath), { recursive: true });

      let settings: any = {};
      try {
        const fileContent = await fs.readFile(this.claudeConfigPath, 'utf-8');
        settings = JSON.parse(fileContent);
      } catch (error) {
        // File does not exist or invalid JSON, initialize as empty object
        settings = {};
      }

      if (!settings.hooks) {
        settings.hooks = {};
      }

      // 1. Inject PermissionRequest Hook
      if (!settings.hooks.PermissionRequest) {
        settings.hooks.PermissionRequest = [];
      }
      this.injectHook(settings.hooks.PermissionRequest, 'signalme play attention');

      // 2. Inject Stop Hook
      if (!settings.hooks.Stop) {
        settings.hooks.Stop = [];
      }
      this.injectHook(settings.hooks.Stop, 'signalme play success');

      // Save updated settings.json
      await fs.writeFile(this.claudeConfigPath, JSON.stringify(settings, null, 2), 'utf-8');
      console.log(chalk.green('✔ Claude Code hooks enabled in ~/.claude/settings.json'));
    } catch (error) {
      throw new Error(`Failed to enable Claude Code hooks: ${(error as Error).message}`);
    }
  }

  public async disable(): Promise<void> {
    try {
      let settings: any = {};
      try {
        const fileContent = await fs.readFile(this.claudeConfigPath, 'utf-8');
        settings = JSON.parse(fileContent);
      } catch (error) {
        // No file to disable hooks on
        console.log(chalk.yellow('ℹ No Claude Code settings file found to disable hooks.'));
        return;
      }

      if (!settings.hooks) return;

      // Filter out our hooks
      if (settings.hooks.PermissionRequest) {
        settings.hooks.PermissionRequest = this.removeHook(settings.hooks.PermissionRequest, 'signalme play');
        if (settings.hooks.PermissionRequest.length === 0) {
          delete settings.hooks.PermissionRequest;
        }
      }

      if (settings.hooks.Stop) {
        settings.hooks.Stop = this.removeHook(settings.hooks.Stop, 'signalme play');
        if (settings.hooks.Stop.length === 0) {
          delete settings.hooks.Stop;
        }
      }

      // If hooks object is completely empty, remove it
      if (Object.keys(settings.hooks).length === 0) {
        delete settings.hooks;
      }

      await fs.writeFile(this.claudeConfigPath, JSON.stringify(settings, null, 2), 'utf-8');
      console.log(chalk.green('✔ Claude Code hooks removed from ~/.claude/settings.json'));
    } catch (error) {
      throw new Error(`Failed to disable Claude Code hooks: ${(error as Error).message}`);
    }
  }

  private injectHook(hookEventArray: any[], commandToInject: string): void {
    // Check if the command is already registered under any hook block
    const exists = hookEventArray.some((block: any) => 
      block.hooks && block.hooks.some((h: any) => h.command === commandToInject)
    );

    if (!exists) {
      hookEventArray.push({
        hooks: [
          {
            type: 'command',
            command: commandToInject,
          }
        ]
      });
    }
  }

  private removeHook(hookEventArray: any[], commandPrefix: string): any[] {
    return hookEventArray.filter((block: any) => {
      if (!block.hooks) return true;
      // Filter out individual hooks that match our prefix
      block.hooks = block.hooks.filter((h: any) => !h.command.startsWith(commandPrefix));
      // Keep this block only if it still has hooks remaining
      return block.hooks.length > 0;
    });
  }
}
