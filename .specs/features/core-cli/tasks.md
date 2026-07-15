# Core CLI Tasks

**Design**: `.specs/features/core-cli/design.md`
**Status**: Done

---

## Execution Plan

### Phase 1: Foundation (Sequential)

Tasks that set up the codebase structure and implement configuration and audio services.

```
T1 ──→ T2 ──→ T3
```

### Phase 2: Core Implementation (Parallel OK)

Building the CLI command parser and vendor drivers.

```
      ┌→ T5 [P] (Claude Driver) ──┐
T4 ───┼                           ├──→ T7 (CLI Integration)
      └→ T6 [P] (Cursor/AGY) ─────┘
```

### Phase 3: Integration & Distribution (Sequential)

Wiring everything together and preparing for local execution.

```
T7
```

---

## Task Breakdown

### T1: Initialize Node.js & TypeScript Project Structure
*   **What**: Create `package.json`, `tsconfig.json`, source directory, and install initial development dependencies (`typescript`, `@types/node`, `chalk`, `figlet`).
*   **Where**: `/Users/luiz.leite/Documents/emive/side-projects/agent-semaphore/`
*   **Depends on**: None
*   **Reuses**: Standard TSConfig/Package conventions.
*   **Requirement**: CLI-01
*   **Done when**:
    *   [ ] `package.json` contains correct dependencies and `"type": "module"`.
    *   [ ] `tsconfig.json` compiles modern ES modules (`NodeNext`).
    *   [ ] Directory compiles cleanly via `npx tsc`.
*   **Tests**: none (manual verify)
*   **Gate**: build

---

### T2: Create ConfigManager and Initialize default assets
*   **What**: Write the configuration interface, class `ConfigManager` to set up `~/.signalme/` folder with a default `config.json` and default sound placeholders.
*   **Where**: `/Users/luiz.leite/Documents/emive/side-projects/agent-semaphore/src/app/config/ConfigManager.ts`
*   **Depends on**: T1
*   **Reuses**: Node `fs/promises` patterns.
*   **Requirement**: CLI-01, CLI-02
*   **Done when**:
    *   [ ] Class implements methods `init()`, `readConfig()`, and `updateConfig()`.
    *   [ ] Default config maps placeholder files for success/error/attention sounds.
    *   [ ] Code runs cleanly with no TypeScript compiler errors.
*   **Tests**: none (manual verify)
*   **Gate**: build

---

### T3: Implement Audio Player Factory and OS Player classes
*   **What**: Write the `AudioPlayer` interface, Darwin (using `afplay`), Linux (using `ffplay`), and Windows player implementations, plus the factory selector.
*   **Where**: `/Users/luiz.leite/Documents/emive/side-projects/agent-semaphore/src/app/audio-player/`
*   **Depends on**: T1
*   **Reuses**: User's `globo-rural` child-process spawning patterns.
*   **Requirement**: PLAY-01
*   **Done when**:
    *   [ ] `AudioPlayerDarwinImpl` successfully spawns `afplay` with sound file arguments.
    *   [ ] `AudioPlayerLinuxImpl` successfully spawns `ffplay` with correct arguments.
    *   [ ] `AudioPlayerPlatformFactory` returns correct class based on `os.platform()`.
*   **Tests**: none (manual verify)
*   **Gate**: build

---

### T4: Write Main CLI command runner and Play/Init commands
*   **What**: Create the main CLI index file parsing inputs, checking commands `init` and `play`, and linking them to `ConfigManager` and `AudioPlayerService`.
*   **Where**: `/Users/luiz.leite/Documents/emive/side-projects/agent-semaphore/src/index.ts`
*   **Depends on**: T2, T3
*   **Reuses**: Standard ES module executions.
*   **Requirement**: CLI-01, PLAY-01
*   **Done when**:
    *   [ ] CLI prints greeting banner via `figlet`.
    *   [ ] Command `init` runs `ConfigManager.init()` and sets up local resources.
    *   [ ] Command `play success` rings the system player with correct audio.
*   **Tests**: none (manual verify)
*   **Gate**: build

---

### T5: Implement Claude Code Driver [P]
*   **What**: Write `ClaudeDriver` class to handle auto-injection of hooks inside `~/.claude/settings.json` for events `Stop` and `PermissionRequest`.
*   **Where**: `/Users/luiz.leite/Documents/emive/side-projects/agent-semaphore/src/app/drivers/ClaudeDriver.ts`
*   **Depends on**: T4
*   **Reuses**: Configuration reading and writing patterns.
*   **Requirement**: DRV-01
*   **Done when**:
    *   [ ] Injects correct hook commands to run `signalme play success` and `signalme play attention`.
    *   [ ] Gracefully creates directory/file if `~/.claude/settings.json` doesn't exist.
    *   [ ] Can remove these hooks cleanly upon calling `disable()`.
*   **Tests**: none (manual verify)
*   **Gate**: build

---

### T6: Implement Cursor & Antigravity Drivers [P]
*   **What**: Write driver wrappers for Cursor and Antigravity.
*   **Where**: `/Users/luiz.leite/Documents/emive/side-projects/agent-semaphore/src/app/drivers/`
*   **Depends on**: T4
*   **Reuses**: Configuration reading/writing.
*   **Requirement**: DRV-02
*   **Done when**:
    *   [ ] Injects settings or prints manual setup instructions for terminal bell visual indicators in Cursor.
    *   [ ] Updates registry state in `config.json`.
*   **Tests**: none (manual verify)
*   **Gate**: build

---

### T7: CLI Integration Wiring
*   **What**: Complete command argument mappings in `src/index.ts` to wire `enable <vendor>` and `disable <vendor>` commands and prepare for global npx distribution.
*   **Where**: `/Users/luiz.leite/Documents/emive/side-projects/agent-semaphore/src/index.ts`
*   **Depends on**: T5, T6
*   **Reuses**: Argument parsing.
*   **Requirement**: CLI-01, DRV-01, DRV-02
*   **Done when**:
    *   [ ] `signalme enable --claude` executes successfully.
    *   [ ] `signalme disable --claude` executes successfully.
    *   [ ] Package compiles and runs end-to-end locally.
*   **Tests**: none (manual verify)
*   **Gate**: build

---

## Parallel Execution Map

```
Phase 1 (Sequential Setup):
  T1 ──→ T2 ──→ T3 ──→ T4

Phase 2 (Parallel Drivers):
  T4 complete, then:
    ├── T5 [P] (Claude Driver)
    └── T6 [P] (Cursor/AGY Driver)

Phase 3 (Sequential Integration):
  T5 and T6 complete, then:
    T7
```

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: Initialize Structure | Package setup and dependencies | ✅ Granular |
| T2: Create ConfigManager | Config folder creation & JSON mapper | ✅ Granular |
| T3: Implement Players | OS player spawner classes | ✅ Granular |
| T4: Main CLI Entry | CLI argument mapping for play/init | ✅ Granular |
| T5: Claude Driver | Hook injection inside Claude config | ✅ Granular |
| T6: Cursor/AGY Driver | Settings/flags configuration | ✅ Granular |
| T7: Integration | Wiring commands together | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | None | ✅ Match |
| T2 | T1 | T1 ──→ T2 | ✅ Match |
| T3 | T1 | T1 ──→ T3 (T2 ──→ T3) | ✅ Match |
| T4 | T2, T3 | T3 ──→ T4 | ✅ Match |
| T5 | T4 | T4 ──→ T5 | ✅ Match |
| T6 | T4 | T4 ──→ T6 | ✅ Match |
| T7 | T5, T6 | T5/T6 ──→ T7 | ✅ Match |

---

## Test Co-location Validation

Since the repository `AGENTS.md` explicitly specifies there is no automated testing suite, all verification checks are executed via compilation checks (`npm run build`) and manual command line verification:

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | Configuration | None | none | ✅ OK |
| T2 | ConfigManager | None | none | ✅ OK |
| T3 | Audio Players | None | none | ✅ OK |
| T4 | CLI Entry | None | none | ✅ OK |
| T5 | Claude Driver | None | none | ✅ OK |
| T6 | Cursor Driver | None | none | ✅ OK |
| T7 | CLI Entry | None | none | ✅ OK |
