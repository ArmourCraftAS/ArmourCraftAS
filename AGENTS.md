# ArmourCraft AS Workspace Guidelines & Operational Rules

## 1. Data & Cache Redirection (Strict D: Drive Confinement)
- **Strict Project Root Confinement**: All Antigravity application caches, extension storage, Gemini cache (.gemini), Next.js build cache, Vite cache, npm cache, temporary files, and local dependencies must be stored strictly inside `D:\ArmourCraftAS` (and subfolder `D:\ArmourCraftAS\.antigravity-data`).
  - **Antigravity Cache Directory**: `GEMINI_CACHE_DIR=D:\ArmourCraftAS\.antigravity-data\gemini-cache`
  - **Next.js Cache Directory**: `NEXT_CACHE_DIR=D:\ArmourCraftAS\.next\cache`
  - **Vite Cache Directory**: `D:\ArmourCraftAS\.vite` (defined in `vite.config.js`)
  - **NPM Cache**: `cache=D:\ArmourCraftAS\.npm-cache` (defined in `.npmrc`), `NPM_CONFIG_CACHE=D:\ArmourCraftAS\.npm-cache`
  - **Environment Temp**: `TEMP=D:\ArmourCraftAS\.tmp`, `TMP=D:\ArmourCraftAS\.tmp`, `TMPDIR=D:\ArmourCraftAS\.tmp` (defined in `.env.local`)
  - **Canonical Rules Reference**: Rules defined in `D:\ArmourCraftAS\.agentrules\rules.md`
- **Zero C: Drive Writes**: Under no circumstances should any project operations, package installs, build steps, test runs, or CLI tool executions write temporary data, build artifacts, or caches to the `C:` drive (such as `C:\Users\...` or `C:\Users\...\AppData\Local\Temp`). All terminal commands and scripts must enforce and preserve workspace-local temporary and cache paths.

## 2. Auto-Accept Execution Mode
- **Autonomous Execution**: Automatically accept, apply, and execute all code edits, component creations, file creations, file deletions, refactoring, and minor configuration updates immediately without pausing to ask the user for manual confirmation each time.
- **Proactive Tool & Command Invocation**: Run necessary terminal commands, build steps, tests, and edits proactively without hesitation.
- **Confirmation Threshold**: ONLY prompt or ask the user for confirmation if an action explicitly involves:
  1. High-privacy operations or personal data handling.
  2. Security credentials, private secrets, API key rotation, or sensitive tokens.
  3. Critical destructive system-level commands (e.g., modifying files outside `D:\ArmourCraftAS`, disk formatting, dropping production databases, or destructive remote Git force operations).
