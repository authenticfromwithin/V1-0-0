\
  Param(
    [Parameter(Mandatory=$true)][string]$Domain,
    [string]$BundleName
  )
  if (-not $BundleName) {
    $f = Get-ChildItem .\dist\assets\index-*.js | Select-Object -First 1
    if (-not $f) { Write-Host "No local dist bundle found. Provide -BundleName." -ForegroundColor Yellow; exit 1 }
    $BundleName = $f.Name
  }
  $url = "$Domain/assets/$BundleName"
  try {
    $res = Invoke-WebRequest $url -Method Head -ErrorAction Stop
    $ct = $res.Headers["Content-Type"]
    Write-Host "Status: $($res.StatusCode), Content-Type: $ct"
    if ($ct -notmatch 'javascript') { throw "Expected JS content type; got $ct" }
    Write-Host "✅ SPA assets served correctly." -ForegroundColor Green
  } catch {
    Write-Host "❌ $($_.Exception.Message)" -ForegroundColor Red
    exit 1
  }
