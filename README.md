# SignalMe 🚦

A lightweight, zero-dependency, cross-platform CLI semaphore tool for developer agent workflows. It triggers visual alerts, voice messages, and audio chimes to signal when your AI agents (Claude Code, Cursor Composer, Antigravity, or generic shell scripts) complete their tasks or require manual attention/input.

## Features

- **Multiplatform Sound Engine:** Plays alerts headlessly using native tools (`afplay` on macOS, `ffplay` on Linux, PowerShell on Windows).
- **Auto-Config Driver for Claude Code:** Updates `~/.claude/settings.json` automatically to wire hooks for `Stop` and `PermissionRequest` events.
- **Auto-Config Driver for Cursor:** Alters User settings (`settings.json`) to enable integrated terminal bells and alerts.
- **Antigravity CLI Support:** Integrates seamlessly via shell command wrapping functions.

---

## Installation & CLI Setup

To install and use `signalme` globally on your machine:

1. Clone or navigate to the repository directory:
   ```bash
   cd side-projects/agent-semaphore
   ```
2. Build the TypeScript files:
   ```bash
   npm run build
   ```
3. Link the package globally to your system:
   ```bash
   npm link
   ```

Now, the `signalme` CLI is available globally in any terminal session.

---

## CLI Usage

### 1. Initialize Settings
Sets up your configuration file at `~/.signalme/config.json` with platform-specific native sound mappings:
```bash
signalme init
```

### 2. Manual Sound Playback
Play registered system sounds immediately:
```bash
signalme play success       # Success sound (e.g., Glass)
signalme play error         # Error sound (e.g., Basso)
signalme play attention     # Action Required (e.g., Ping/Beep)
```

### 3. Configure Vendor Agent Tools

*   **Claude Code CLI:**
    *   **Enable:** Injects hooks so Claude plays a sound when finished or when requesting tool permissions:
        ```bash
        signalme enable --claude
        ```
    *   **Disable:** Cleanly removes all registered hook overrides:
        ```bash
        signalme disable --claude
        ```

*   **Cursor IDE:**
    *   **Enable:** Sets up the integrated terminal visual/audible bell configs:
        ```bash
        signalme enable --cursor
        ```
    *   **Disable:** Cleans up the Cursor settings file:
        ```bash
        signalme disable --cursor
        ```

*   **Antigravity & General Shell Scripts:**
    *   Register the driver state and print the shell wrapper snippet:
        ```bash
        signalme enable --antigravity
        ```

---

## Technical Stack

- **Runtime:** Node.js (ES Modules, Type: Module)
- **Language:** TypeScript
- **Styling & CLI output:** `chalk` and `figlet`

---

## License

MIT
