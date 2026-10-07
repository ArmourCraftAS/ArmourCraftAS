# Workspace Guidelines: Data Redirection and Auto-Accept Mode

## Data & Cache Redirection
- Ensure all Next.js build cache, temporary files, npm cache, and local dependencies are saved strictly inside `D:\ArmourCraftAS`.
- Enforce:
  - `NEXT_CACHE_DIR=D:\ArmourCraftAS\.next\cache`
  - `TEMP=D:\ArmourCraftAS\.tmp`
  - `TMP=D:\ArmourCraftAS\.tmp`
  - `TMPDIR=D:\ArmourCraftAS\.tmp`
  - NPM cache: `cache=D:\ArmourCraftAS\.npm-cache` (via `.npmrc`)
  - Vite cache: `D:\ArmourCraftAS\.vite` (via `vite.config.js`)
- Prevent any project operations, builds, or scripts from writing temporary data to the `C:` drive.

## Auto-Accept Execution Mode
- Automatically accept and execute all code edits, component creations, file creation/deletion, refactoring, and minor configuration updates without asking for manual confirmation each time.
- Only prompt or ask the user for confirmation if an action involves high-privacy operations, security credentials, or critical destructive system commands.
