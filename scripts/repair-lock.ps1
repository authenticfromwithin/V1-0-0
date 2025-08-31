param([switch]$Deep)

Write-Host "== AFW: Repairing npm lock and modules ==" -ForegroundColor Cyan

if ($Deep) {
  Write-Host "Deep mode: removing node_modules..." -ForegroundColor Yellow
  if (Test-Path .\node_modules) { Remove-Item -Recurse -Force .\node_modules }
}

if (Test-Path .\package-lock.json) {
  Write-Host "Removing existing package-lock.json" -ForegroundColor Yellow
  Remove-Item .\package-lock.json -Force
}

Write-Host "Running npm install to re-generate lock..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed." }

Write-Host "Running npm dedupe..." -ForegroundColor Cyan
npm dedupe

Write-Host "✅ Lock repaired. Next: npm run build" -ForegroundColor Green
