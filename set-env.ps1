# ArmourCraft AS Path & Cache Isolation Script
# Enforces strict D: drive containment for all operations
$env:NEXT_CACHE_DIR = "D:\ArmourCraftAS\.next\cache"
$env:NPM_CONFIG_CACHE = "D:\ArmourCraftAS\.npm-cache"
$env:GEMINI_CACHE_DIR = "D:\ArmourCraftAS\.antigravity-data\gemini-cache"
$env:TEMP = "D:\ArmourCraftAS\.tmp"
$env:TMP = "D:\ArmourCraftAS\.tmp"
$env:TMPDIR = "D:\ArmourCraftAS\.tmp"
Write-Host "ArmourCraft AS: Isolated environment active on D: drive." -ForegroundColor Cyan
