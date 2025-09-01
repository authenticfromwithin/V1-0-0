\
  Write-Host "🔎 Verifying import stability..." -ForegroundColor Cyan
  $bad = @()

  # Detect accidental /dist/ references in index.html
  if (Test-Path .\index.html) {
    $hits = Select-String -Path .\index.html -Pattern 'src="/dist/' -SimpleMatch -ErrorAction SilentlyContinue
    if ($hits) { $bad += "index.html references /dist/. Should be /assets/." }
  }

  # Look for missing files referenced by code (basic heuristic)
  $imports = Select-String -Path .\src\**\*.{ts,tsx} -Pattern 'from\s+["''][^"'']+["'']' -AllMatches -ErrorAction SilentlyContinue
  foreach ($i in $imports) {
    foreach ($m in $i.Matches) {
      $p = $m.Value -replace 'from\s+["'']','' -replace '["'']',''
      if ($p -like './*' -or $p -like '../*') {
        $resolved = Join-Path (Split-Path $i.Path) $p
        if (-not (Test-Path $resolved) -and -not (Test-Path ($resolved + ".ts")) -and -not (Test-Path ($resolved + ".tsx"))) {
          $bad += "Missing import target: $p in $($i.Path)"
        }
      }
    }
  }

  if ($bad.Count -gt 0) {
    Write-Host "⚠️  Issues found:" -ForegroundColor Yellow
    $bad | ForEach-Object { Write-Host " - $_" }
    exit 2
  } else {
    Write-Host "✅ Imports look stable." -ForegroundColor Green
  }
