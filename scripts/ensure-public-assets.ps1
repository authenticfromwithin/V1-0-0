\
  New-Item -ItemType Directory -Force -Path .\public | Out-Null
  New-Item -ItemType Directory -Force -Path .\public\assets\brand | Out-Null
  # Write tiny placeholder icons if missing (you will replace with your real artwork)
  $png1x1 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wwAAn8B9czh6YQAAAAASUVORK5CYII='
  $bytes = [Convert]::FromBase64String($png1x1)
  $targets = @(
    '.\public\favicon.ico',
    '.\public\favicon.png',
    '.\public\assets\brand\afw-favicon-32.png',
    '.\public\assets\brand\afw-logo-192.png',
    '.\public\assets\brand\afw-logo-512.png'
  )
  foreach ($t in $targets) {
    if (-not (Test-Path $t)) { [IO.File]::WriteAllBytes($t, $bytes) }
  }
  Write-Host "✅ Public assets ensured (placeholders where missing)." -ForegroundColor Green
