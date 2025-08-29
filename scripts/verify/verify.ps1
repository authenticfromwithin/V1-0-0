
# scripts/verify/verify.ps1 — Windows runner
Param(
  [switch]$ToFile
)
$ErrorActionPreference = "Stop"
$root = Get-Location
$node = Get-Command node -ErrorAction SilentlyContinue
if ($null -eq $node) { Write-Error "Node.js not found in PATH"; }
$script = "scripts\verify\verify.mjs"
if (-not (Test-Path $script)) { Write-Error "verify.mjs not found at $script"; }
if ($ToFile) {
  $out = "scripts\verify\last-report.txt"
  node $script | Tee-Object -FilePath $out
  Write-Host "Saved to $out"
} else {
  node $script
}
