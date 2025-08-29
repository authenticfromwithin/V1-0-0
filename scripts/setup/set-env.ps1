param(
    [string]$Url,
    [string]$Anon
)

Write-Host "AFW Env Setup – Website + Admin" -ForegroundColor Cyan

if (-not $Url) {
  $Url = Read-Host -Prompt 'Enter VITE_SUPABASE_URL (example: https://abcd1234.supabase.co)'
}
if (-not $Anon) {
  $Anon = Read-Host -Prompt 'Enter VITE_SUPABASE_ANON_KEY (starts with eyJ...)'
}

# Basic validation (soft)
if ($Url -notmatch '^https?://[a-zA-Z0-9-]+\.supabase\.co/?$') {
  Write-Warning "The URL does not look like a Supabase Project URL. You entered: $Url"
}
if ($Anon.Length -lt 20) {
  Write-Warning "The anon key seems too short. It should be a long string starting with eyJ..."
}

$rootEnv = ".env.local"
$adminDir = "admin"
$adminEnv = Join-Path $adminDir ".env.local"

$lines = @(
  "VITE_SUPABASE_URL=$Url",
  "VITE_SUPABASE_ANON_KEY=$Anon"
)

# Ensure trailing newline
$body = ($lines -join "`r`n") + "`r`n"

Set-Content -LiteralPath $rootEnv -Value $body -Encoding UTF8
Write-Host "Wrote $rootEnv" -ForegroundColor Green

if (Test-Path $adminDir) {
  New-Item -ItemType Directory -Force -Path $adminDir | Out-Null
  Set-Content -LiteralPath $adminEnv -Value $body -Encoding UTF8
  Write-Host "Wrote $adminEnv" -ForegroundColor Green
} else {
  Write-Warning "Admin folder not found at ./admin – skipping admin env."
}

Write-Host "Done. Verify: node scripts\setup\verify-env.mjs" -ForegroundColor Cyan
