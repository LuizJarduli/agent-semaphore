#!/usr/bin/env node
import { ConfigManager } from './app/config/ConfigManager.js';
import { AudioPlayerPlatformFactory } from './app/audio-player/AudioPlayerPlatformFactory.js';
import { AudioPlayerService } from './app/audio-player/AudioPlayerService.js';
import { ClaudeDriver } from './app/drivers/ClaudeDriver.js';
import { CursorDriver } from './app/drivers/CursorDriver.js';
import { AntigravityDriver } from './app/drivers/AntigravityDriver.js';
import chalk from 'chalk';

const configManager = new ConfigManager();
const player = AudioPlayerPlatformFactory.create();
const playerService = new AudioPlayerService(player);

async function run() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    playerService.greet();
    console.log(`
Usage: signalme <command> [options]

Commands:
  init                       Initialize configuration and default sounds
  play <type>                Play a registered sound type (success, error, attention)
  enable <vendor>            Enable semaphore for an agent (e.g., --claude, --cursor, --antigravity)
  disable <vendor>           Disable semaphore for an agent (e.g., --claude, --cursor, --antigravity)
    `);
    process.exit(0);
  }

  try {
    if (command === 'init') {
      await configManager.init();
      console.log(chalk.green('✔ SignalMe successfully initialized! Settings folder created at ~/.signalme/'));
    } else if (command === 'play') {
      const soundType = args[1];
      if (!soundType || !['success', 'error', 'attention'].includes(soundType)) {
        console.error(chalk.red('Error: Please specify sound type: success, error, or attention.'));
        process.exit(1);
      }
      
      const config = await configManager.readConfig();
      const soundPath = config.sounds[soundType as 'success' | 'error' | 'attention'];
      
      if (!soundPath) {
        console.error(chalk.red(`Error: Sound path for "${soundType}" not configured.`));
        process.exit(1);
      }
      
      await playerService.play(soundPath);
    } else if (command === 'enable' || command === 'disable') {
      const vendorOption = args[1];
      if (!vendorOption) {
        console.error(chalk.red(`Error: Please specify vendor, e.g. signalme ${command} --claude`));
        process.exit(1);
      }
      
      const normalizedVendor = vendorOption.replace(/^--/, '').toLowerCase();
      
      if (normalizedVendor === 'claude') {
        const driver = new ClaudeDriver();
        if (command === 'enable') await driver.enable();
        else await driver.disable();
      } else if (normalizedVendor === 'cursor') {
        const driver = new CursorDriver();
        if (command === 'enable') await driver.enable();
        else await driver.disable();
      } else if (normalizedVendor === 'antigravity' || normalizedVendor === 'agy') {
        const driver = new AntigravityDriver();
        if (command === 'enable') await driver.enable();
        else await driver.disable();
      } else {
        console.error(chalk.red(`Error: Unknown vendor "${vendorOption}". Supported: --claude, --cursor, --antigravity`));
        process.exit(1);
      }
    } else {
      console.error(chalk.red(`Unknown command: ${command}. Type "signalme --help" for help.`));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${(error as Error).message}`));
    process.exit(1);
  }
}

run();
