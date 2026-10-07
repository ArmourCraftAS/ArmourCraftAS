# STRICT CRITICAL DIRECTIVE: COMPLETE ISOLATION TO D:\ DRIVE & AUTO-ACCEPT MODE

## 1. Force All Antigravity Data & Caches to D:\ArmourCraftAS
- **Root Confinement**: All Antigravity IDE application caches, workspace settings, extension storage, Gemini cache (.gemini), .cache, .antigravity-ide, and temporary files are strictly redirected and isolated inside `D:\ArmourCraftAS\.antigravity-data` (or local project subfolders).
- **Environment Variables**:
  - `NEXT_CACHE_DIR=D:\ArmourCraftAS\.next\cache`
  - `NPM_CONFIG_CACHE=D:\ArmourCraftAS\.npm-cache`
  - `GEMINI_CACHE_DIR=D:\ArmourCraftAS\.antigravity-data\gemini-cache`
  - `TEMP=D:\ArmourCraftAS\.tmp`
  - `TMP=D:\ArmourCraftAS\.tmp`
  - `TMPDIR=D:\ArmourCraftAS\.tmp`
  - `VITE_CACHE_DIR=D:\ArmourCraftAS\.vite`
- **Zero C: Drive Writes**: Under no circumstances should any project operations, package installs, build steps, test runs, or CLI tool executions write temporary data, build artifacts, or caches to the `C:` drive (such as `C:\Users\...` or `C:\Users\...\AppData\Local\Temp`). All terminal commands and scripts must enforce and preserve workspace-local temporary and cache paths.

## 2. Safe Asset Management
- Any project-related artifacts, npm cache entries, or logs originating from previous commands must be cleanly stored within `D:\ArmourCraftAS`.
- Under all circumstances, maintain zero disruption to:
  1. Active development server (`http://localhost:5173`).
  2. GitHub repository connection (`origin/main`).
  3. Vercel deployment linking and OIDC authentication.
  4. Supabase live database connection and credentials.

## 3. Permanent Auto-Accept Execution Mode
- Automatically accept, apply, and execute all code edits, component creations, file creations, file deletions, refactoring, dependencies management, and non-destructive terminal commands immediately without pausing to ask the user for manual confirmation each time.
- Proactively run terminal commands, build steps, tests, and edits without hesitation.
- ONLY prompt or ask the user for confirmation if an action explicitly involves:
  1. High-privacy operations or personal data handling.
  2. Security credentials, private secrets, API key rotation, or sensitive tokens.
  3. Critical destructive system-level commands (e.g., modifying files outside `D:\ArmourCraftAS`, disk formatting, dropping production databases, or destructive remote Git force operations).
