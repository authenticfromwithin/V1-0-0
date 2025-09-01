\
  if (-not (Test-Path .\index.html)) { Write-Host "index.html not found"; exit 1 }
  $src = Get-Content .\index.html -Raw
  $out = $src -replace 'src="/dist/','src="/'
  if ($out -ne $src) {
    Set-Content .\index.html -Value $out -Encoding UTF8
    Write-Host "🛠️  Rewrote /dist/ references -> /assets/ in index.html" -ForegroundColor Cyan
  } else {
    Write-Host "✅ index.html references are clean." -ForegroundColor Green
  }
