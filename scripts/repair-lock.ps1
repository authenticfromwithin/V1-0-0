\
  Param([switch]$Force)

  Write-Host "🔧 Repairing lock & node_modules..." -ForegroundColor Cyan
  if (Test-Path .\node_modules) { Remove-Item -Recurse -Force .\node_modules }
  if (Test-Path .\package-lock.json) { Remove-Item -Force .\package-lock.json }

  # Ensure clean install with pinned versions
  npm install
  if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

  Write-Host "✅ Done. You can now run: npm run build" -ForegroundColor Green
