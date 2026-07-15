# Roadmap

**Current Milestone:** Milestone 1: CLI Core & Audio Engine
**Status:** Planning

---

## Milestone 1: CLI Core & Audio Engine

**Goal:** Create a working multiplatform CLI that can initialize a config directory and play success/error/attention sounds using native system spawners.
**Target:** Functional local CLI execution.

### Features

**`signalme init`** - PLANNED
- Creates `~/.signalme/` configuration directory.
- Creates initial `config.json` registry.
- Copies default sound effects (success, failure, action-required) to local assets.

**Multiplatform Audio Player** - PLANNED
- Implements `AudioPlayer` interface and factory.
- Spawns `afplay` on macOS, `ffplay` on Linux, and `wmplayer` on Windows.
- Exposes `signalme play [success|error|attention]` command.

---

## Milestone 2: Agent Drivers Integration

**Goal:** Implement auto-configuration drivers for Claude Code, Cursor, and Antigravity.

### Features

**Claude Code Integration** - PLANNED
- Command: `signalme enable --claude` / `signalme disable --claude`.
- Automatically parses and updates `~/.claude/settings.json` hooks (specifically `Stop` and `PermissionRequest` events) to call `signalme play`.

**Cursor & Antigravity Integration** - PLANNED
- Command: `signalme enable --cursor` / `--antigravity`.
- Injects relevant hook or config settings.

---

## Future Considerations

- **Custom Audio Files:** Support custom sound paths in `config.json`.
- **Speech Alerts:** Support `say` synthesis on supported platforms alongside play.
