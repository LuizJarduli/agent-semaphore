# Core CLI and Audio Semaphore Specification

## Problem Statement

Developers using multiple agentic tools (like Claude Code, Cursor Composer, and Antigravity) are often blocked waiting for tasks to finish or requesting confirmation. They need a unified CLI utility (`signalme`) that runs cross-platform, manages configurations for these vendors, and plays instant audio alerts when tasks finish or require input.

## Goals

- [ ] Provide a multiplatform Node.js CLI executable (`signalme`) that can initialize system configs.
- [ ] Implement a cross-platform sound player using system-native child process spawning.
- [ ] Auto-configure Claude Code, Cursor, and Antigravity with sound-playing hooks/hooks injection.

## Out of Scope

| Feature     | Reason         |
| ----------- | -------------- |
| Sound selection GUI | Complex configuration is out of scope for CLI v1. |
| Remote notification servers | Out of scope for a local developer semaphore. |

---

## User Stories

### P1: CLI Core, Initialization, and Audio Engine ⭐ MVP

**User Story**: As a developer, I want to initialize a configuration directory and play default system sounds cross-platform so that my terminal scripts and agent hooks have reliable audio triggers.

**Why P1**: Necessary foundation for the CLI and playing the actual sounds.

**Acceptance Criteria**:
1. WHEN running `signalme init` THEN system SHALL create a configuration directory at `~/.signalme` and write a default `config.json`.
2. WHEN running `signalme init` THEN system SHALL download or place default mp3/wav audio assets under `~/.signalme/assets/`.
3. WHEN running `signalme play <success|error|attention>` THEN system SHALL spawn the platform-specific audio player (`afplay` on macOS, `ffplay` on Linux, and `wmplayer` on Windows) to play the matching sound immediately.

**Independent Test**:
- Run `signalme init` and check if `~/.signalme/config.json` exists.
- Run `signalme play success` and confirm the success sound plays.

---

### P1: Claude Code Driver Activation ⭐ MVP

**User Story**: As a developer using Claude Code CLI, I want to automatically enable or disable sound alerts for my session events so that I don't have to write JSON configs manually.

**Why P1**: Claude Code is one of the primary targets and has native hook integration.

**Acceptance Criteria**:
1. WHEN running `signalme enable --claude` THEN system SHALL parse `~/.claude/settings.json` and inject `Stop` (success) and `PermissionRequest` (attention) hooks calling `signalme play`.
2. WHEN running `signalme disable --claude` THEN system SHALL parse `~/.claude/settings.json` and remove `signalme` hook references.

**Independent Test**:
- Enable Claude hooks: `signalme enable --claude`. Inspect `~/.claude/settings.json` for correct hooks.
- Disable Claude hooks: `signalme disable --claude`. Verify the hooks are removed.

---

### P2: Cursor and Antigravity Integration

**User Story**: As a developer using Cursor or Antigravity, I want to enable or disable sound alerts for agent completion events.

**Why P2**: Adds full agent ecosystem support.

**Acceptance Criteria**:
1. WHEN running `signalme enable --cursor` THEN system SHALL configure Cursor terminal bells or instruct the user on how to activate completion sounds.
2. WHEN running `signalme enable --antigravity` THEN system SHALL enable notification flags for Antigravity runs.

**Independent Test**:
- Run `signalme enable --cursor` and verify configuration setup.

---

## Edge Cases

- WHEN system player is missing (e.g. `ffplay` is not installed on Linux) THEN system SHALL output a clean error to stdout/stderr instead of crashing.
- WHEN `~/.claude/settings.json` is missing or contains invalid JSON THEN system SHALL gracefully back up the file or write a new one instead of failing.
- WHEN an unknown play type is requested THEN system SHALL fallback to `attention` or print usage information.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----------- | ------ | ------- |
| CLI-01 | P1: CLI Core, Initialization | Specify | Verified |
| CLI-02 | P1: CLI Core, Initialization | Specify | Verified |
| PLAY-01 | P1: CLI Core, Initialization | Specify | Verified |
| DRV-01 | P1: Claude Code Driver Activation | Specify | Verified |
| DRV-02 | P2: Cursor and Antigravity Integration | Specify | Verified |

**Coverage:** 5 total, 5 mapped to tasks, 0 unmapped.

---

## Success Criteria

- Developer can initialize and play sounds in less than 3 commands.
- The audio engine responds to `play` calls within 150ms.
- Auto-configuration updates vendor configuration files cleanly without corrupting existing user settings.
