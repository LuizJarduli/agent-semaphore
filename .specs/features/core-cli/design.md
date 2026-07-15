# Core CLI Design

**Spec**: `.specs/features/core-cli/spec.md`
**Status**: Approved

---

## Architecture Overview

SignalMe is structured as a modular TypeScript command-line utility. A central orchestration layer parses command arguments and delegates commands to the config, player, and driver modules.

```mermaid
graph TD
    CLI[signalme CLI Entry] --> ConfigService[Config Service]
    CLI --> AudioPlayerService[Audio Player Service]
    CLI --> DriverService[Driver Service]
    
    AudioPlayerService --> PlayerFactory[Audio Player Factory]
    PlayerFactory --> DarwinPlayer[Darwin Player (afplay)]
    PlayerFactory --> LinuxPlayer[Linux Player (ffplay)]
    PlayerFactory --> WindowsPlayer[Windows Player (wmplayer)]

    DriverService --> ClaudeDriver[Claude Code Driver]
    DriverService --> CursorDriver[Cursor Driver]
    DriverService --> AntigravityDriver[Antigravity Driver]
    
    ClaudeDriver --> ClaudeConfig[~/.claude/settings.json]
```

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component            | Location / Source            | How to Use                |
| -------------------- | ------------------- | ------------------------- |
| `AudioPlayerService` | User's `globo-rural` repo | Reused for handling ASCII/figlet greeting and calling the factory. |
| `AudioPlayer` | User's `globo-rural` repo | Interface contract. |
| `AudioPlayerDarwinImpl` | User's `globo-rural` repo | Uses `afplay` to play sound via `spawn`. |
| `AudioPlayerLinuxImpl` | User's `globo-rural` repo | Uses `ffplay` with correct flags (`-nodisp`, `-autoexit`, `-loglevel`, `quiet`) to play sound via `spawn`. |
| `AudioPlayerWindowsImpl` | User's `globo-rural` repo | Uses `cmd.exe /c start wmplayer` to trigger Windows Media Player. |

### Integration Points

| System         | Integration Method                      |
| -------------- | --------------------------------------- |
| Claude Code | Mutates user settings JSON at `~/.claude/settings.json` adding/removing hook properties under `Stop` and `PermissionRequest` events. |

---

## Components

### `ConfigManager`
- **Purpose**: Manages initialization of `~/.signalme/` configuration directory and registry.
- **Location**: `src/app/config/ConfigManager.ts`
- **Interfaces**:
  - `init(): Promise<void>` - Creates directories, default JSON config, and asset files.
  - `readConfig(): Promise<SignalMeConfig>` - Reads `config.json`.
  - `updateConfig(config: Partial<SignalMeConfig>): Promise<void>` - Updates `config.json`.
- **Dependencies**: Node `fs/promises`, `os`, `path`

### `AudioPlayerPlatformFactory`
- **Purpose**: Instantiates the appropriate `AudioPlayer` implementation based on OS.
- **Location**: `src/app/audio-player/AudioPlayerPlatformFactory.ts`
- **Interfaces**:
  - `create(): AudioPlayer` - Instantiates OS-specific audio player.

### `ClaudeDriver`
- **Purpose**: Automates hooks integration in Claude Code.
- **Location**: `src/app/drivers/ClaudeDriver.ts`
- **Interfaces**:
  - `enable(): Promise<void>` - Modifies `~/.claude/settings.json` to inject hooks.
  - `disable(): Promise<void>` - Modifies `~/.claude/settings.json` to remove hooks.

---

## Data Models

### `SignalMeConfig`

```typescript
interface SignalMeConfig {
  version: string;
  sounds: {
    success: string;    // Path to success audio file
    error: string;      // Path to error audio file
    attention: string;  // Path to action-required audio file
  };
  enabledDrivers: string[]; // e.g. ["claude", "cursor"]
}
```

---

## Error Handling Strategy

| Error Scenario | Handling      | User Impact      |
| -------------- | ------------- | ---------------- |
| Audio binary missing (e.g. `ffplay` on Linux) | Catch spawn error or check binary existence; fall back to terminal beep (`\a`). | Cleaner alert indicating they need to install the audio player package, with a fallback beep sound. |
| Configuration file corrupted | Rename corrupted file to `.bak` and recreate default configuration. | File is reset, warning printed to CLI. |
| Incompatible permission settings | Catch FS read/write errors. | Prints instruction to run with correct permissions or verify path accesses. |
