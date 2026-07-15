# State

**Last Updated:** 2026-07-15T10:52:00-03:00
**Current Work:** Completed Core CLI, Multiplatform Audio Player, and Drivers for Claude, Cursor, and Antigravity.

---

## Recent Decisions (Last 60 days)

### AD-001: Tech Stack & Architecture (2026-07-15)

**Decision:** Use Node.js (ES Modules, TypeScript) and construct a CLI that parses options via basic processing or commander.
**Reason:** The user requested Node.js/TypeScript and multiplatform audio capabilities using child-process spawns.
**Trade-off:** Node.js requires a runtime to be installed, but fits perfectly with the developer tool ecosystem.
**Impact:** Simple installation via npm or npx globally.

### AD-002: Audio Player Adaptation (2026-07-15)

**Decision:** Leverage the user's `AudioPlayer` interface and multi-platform child process spawning patterns (`afplay` for macOS, `ffplay` for Linux, `wmplayer` for Windows).
**Reason:** Proven working model from the user's own codebase (`LuizJarduli/globo-rural`).
**Trade-off:** Relies on system utilities being present (e.g. `ffplay` on Linux).
**Impact:** Zero heavy binary audio libraries required.

---

## Active Blockers

None.

---

## Lessons Learned

None yet.

---

## Quick Tasks Completed

None yet.

---

## Deferred Ideas

- Cross-platform desktop banner notifications alongside sound.
- Interactive terminal dashboard to view agent run statuses.

---

## Todos

- [x] Initialize Node.js package in `side-projects/agent-semaphore`
- [x] Create folder structure (`src/`, `src/app/`, `src/app/audio-player/`)
- [x] Write first specification under `.specs/features/core-cli/spec.md`
