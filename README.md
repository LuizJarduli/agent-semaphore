# SignalMe 🚦

SignalMe is a lightweight, zero-dependency, cross-platform developer semaphore tool for AI agent workflows. It triggers visual alerts and audio chimes to notify you when your agentic tools (Claude Code, Cursor Composer, Antigravity, or generic shell scripts) complete their tasks or pause to ask for input/permissions.

---

## Architecture & How It Works

SignalMe works as a centralized registry and sound player utility:

1.  **State Registry:** Configurations are stored locally in your home directory at `~/.signalme/config.json`. This registry holds paths to your success, error, and attention sounds.
2.  **Platform Audio Players:** Spawns native child-processes to play audio without installing heavy native C++ bindings or node libraries:
    *   **macOS:** Spawns native `afplay`.
    *   **Linux:** Spawns `ffplay` with headless configuration flags.
    *   **Windows:** Spawns PowerShell `System.Media.SoundPlayer` (completely headless) with a fallback to Windows Media Player CLI.
3.  **Hooks Integration:** Dynamically injects script executions into agent settings (like Claude Code's lifecycle hooks and Cursor's terminal configs) to automate alerts.

---

## Installation

Install `signalme` globally using npm:

```bash
npm install -g @lugalokinho/signalme
```

### Getting Started

1. Initialize the configuration directory and register native OS sound alerts:
   ```bash
   signalme init
   ```
2. Verify the installation by playing a success chime:
   ```bash
   signalme play success
   ```

---

## Local Development Setup

If you want to contribute or build/test changes locally on your system, follow this guide:

### Step 1: Clone and Navigate to Directory
Ensure you are in the project root folder:
```bash
cd side-projects/agent-semaphore
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Compile TypeScript Code
```bash
npm run build
```

### Step 4: Create Global Link (`npm link`)
Register the local build executable globally:
```bash
npm link
```
Now, typing `signalme` in any directory will run your local development build.

---

## Local Development Workflow

If you want to edit the code and test changes in real-time, rebuilding constantly can be tedious. Use these techniques:

### Live Rebuilding (Watch Mode)
Open a terminal in the background and run the watch compiler:
```bash
npx tsc --watch
```
As you modify `.ts` files in `src/`, they will automatically compile to `dist/`, immediately updating the behavior of your global `signalme` command!

### Testing via TSX (Without Building)
If you want to run the TypeScript files directly without compiling them first, use `npx tsx`:
```bash
npx tsx src/index.ts play success
```

---

## CLI Command Reference

### `signalme init`
Initializes the `~/.signalme` configuration folder, creates `config.json` with default OS sounds, and maps placeholders:
```bash
signalme init
```

### `signalme play <type>`
Triggers immediate playback of one of your registered sound classes:
```bash
signalme play success       # Task success sound
signalme play error         # Task error/failure sound
signalme play attention     # Action Required / Stopped prompt sound
```

### `signalme enable <vendor>` / `signalme disable <vendor>`
Wires automated hooks for specific agent environments:

*   **Claude Code:**
    ```bash
    signalme enable --claude
    ```
    *   *What it does:* Reads your global `~/.claude/settings.json` file, parses the JSON structure, and cleanly inserts hook triggers for `Stop` (success) and `PermissionRequest` (attention) events without disturbing other hooks.
    *   *To undo:* `signalme disable --claude`

*   **Cursor IDE:**
    ```bash
    signalme enable --cursor
    ```
    *   *What it does:* Injects `"terminal.integrated.bellToAlert": true` and `"terminal.integrated.enableBell": true` into your global Cursor user `settings.json` file so terminal bells automatically bubble up system notifications.
    *   *Note:* Ensure "Play sound on agent completion" is turned on under *Cursor Settings (Cmd+Shift+J) -> Features -> Composer*.
    *   *To undo:* `signalme disable --cursor`

*   **Antigravity / Custom Shell Runs:**
    ```bash
    signalme enable --antigravity
    ```
    *   *What it does:* Registers `antigravity` in the local config file and prints a reusable shell wrapper function `sem()` that you can add to your `~/.zshrc` or `~/.bashrc`:
        ```bash
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
        ```
    *   *Usage:* Prefix any long-running agent command with `sem`, e.g., `sem agy "fix typescript compiler errors in src/"`.

---

## Customizing Sound Effects

To change the sounds played by the CLI, edit your local settings registry at `~/.signalme/config.json`.

Example configuration using custom local files:
```json
{
  "version": "1.0.0",
  "sounds": {
    "success": "/Users/yourname/Music/chime.mp3",
    "error": "/Users/yourname/Music/alarm.mp3",
    "attention": "/Users/yourname/Downloads/misc/buzina-palhaco.mp3"
  },
  "enabledDrivers": ["claude"]
}
```

---

## Publishing to npm

This project uses `standard-version` for semantic versioning, release tag management, and changelog auto-generation.

To publish a new release:
1. Ensure your terminal session is authenticated to npm:
   ```bash
   npm login
   ```
2. Run the publication script:
   ```bash
   npm run publish:package
   ```
   *What this script does:*
   * Runs `npm run build` to compile TypeScript to `dist/`.
   * Runs `npx standard-version` to bump the version, generate/update `CHANGELOG.md`, and commit/tag the version bump.
   * Pushes the version tags to GitHub (`origin main`).
   * Publishes the package to the npm registry.

---

## Troubleshooting

### 1. `command not found: signalme`
Ensure your npm global bin folder is in your shell's `$PATH`. You can check where npm installs global binaries by running:
```bash
npm prefix -g
```
Ensure that path's `bin/` subfolder is added to your environment path.

### 2. File Permissions
If you encounter permission errors running `npm link`, you may need to run it with admin privileges depending on your Node configuration:
```bash
sudo npm link
```
Alternatively, configure npm to install global packages under your home directory to avoid `sudo` requirements.

### 3. Sound Not Playing
*   **macOS:** Ensure you can run `afplay` manually in terminal.
*   **Linux:** Ensure `ffplay` is installed on your system (usually comes with the `ffmpeg` package). Run `sudo apt-get install ffmpeg` if missing.
*   **Windows:** Verify PowerShell execution policies permit scripts if PowerShell execution fails.
