# SignalMe

**Vision:** A multiplatform developer semaphore tool that plays audio alerts and automatically configures lifecycle hooks for AI agents (like Claude Code, Cursor, and Antigravity) to notify developers when tasks are completed or need manual confirmation.
**For:** Software developers utilizing agentic CLI and IDE tools in their daily workflow.
**Solves:** The need to constantly check/poll terminals or IDEs to see if an AI agent has finished its task or is waiting for permission/input.

## Goals

- Provide instant, high-quality audio notifications for agent events (Task Finished, Action Required/Error).
- Enable zero-friction CLI commands to auto-configure (inject/remove hooks) for supported agent environments (Claude, Cursor, Antigravity).
- Run completely locally and cross-platform (macOS, Linux, Windows) with zero third-party audio driver dependencies.

## Tech Stack

**Core:**
- Framework: Node.js (ES Modules, Type: Module)
- Language: TypeScript (v5+)
- CLI Tooling: Custom parser or lightweight helper (e.g. `commander`)

**Key dependencies:**
- `chalk`: Terminal string styling.
- `figlet`: ASCII banner generation.
- Audio play mechanism: Child process spawning utilizing native system players (`afplay` on macOS, `ffplay` on Linux, and media commands on Windows).

## Scope

**v1 includes:**
- **Daemon-like state registry:** Config file at `~/.signalme/config.json` tracking active drivers.
- **CLI Commands:**
  - `signalme init` - Initializes the config, assets (default audio files), and CLI setup.
  - `signalme play <type>` - Plays specific audio alerts (types: `success`, `error`, `attention`).
  - `signalme enable <vendor>` / `signalme disable <vendor>` - Auto-injects/removes hooks for `--claude`, `--cursor`, `--antigravity`.
- **Drivers:**
  - **Claude Code Driver:** Automates changes to `~/.claude/settings.json` lifecycle hooks (`Stop`, `PermissionRequest`, `Notification`).
  - **Cursor Driver:** Guides user or injects configuration settings.
  - **Antigravity Driver:** Standard integration.
- **Cross-platform Audio Service:** Based on custom native child process spawning for macOS (`afplay`), Linux (`ffplay`), and Windows.

**Explicitly out of scope:**
- Graphical User Interface (GUI) desktop application.
- Cloud/Push notifications (SMS, Slack, or mobile notifications).
- In-process listener via Unix sockets (V1 will rely on direct CLI hook execution).

## Constraints
- Must be packaged as an executable CLI tool (NPX/global binary runnable).
- Low latency audio start (<100ms) to ensure alerts feel instantaneous.
- No heavy system-level audio library installations (must use built-in child processes).
