param([string]$Root=".")
$ErrorActionPreference = "Stop"
$stems = @{
  "water" = "https://archive.org/download/ocean-sea-sounds/Gentle%20Ocean.mp3";
  "wind"  = "https://archive.org/download/Red_Library_Nature_Wind/R22-11-Blustery%20Wind%20Loop.mp3";
  "birds" = "https://archive.org/download/various-bird-sounds/birds-in-the-morning-24147.mp3";
  "leaves"= "https://archive.org/download/various-bird-sounds/birds-singing-in-and-leaves-rustling-with-the-wind-14557.mp3";
  "pad"   = "https://archive.org/download/hour-of-pink-noise/01-pink_noise.mp3";
}
$themes = @("forest","ocean","mountain","autumn","snow")

function Ensure-Folder([string]$p) {
  if (-not (Test-Path -LiteralPath $p)) { New-Item -ItemType Directory -Force -Path $p | Out-Null }
}

foreach ($theme in $themes) {
  $base = Join-Path $Root ("public/assets/audio/{0}/stems" -f $theme)
  Ensure-Folder $base
  foreach ($name in $stems.Keys) {
    $url = $stems[$name]
    $dest = Join-Path $base ("{0}.mp3" -f $name)
    Write-Host ("Downloading {0}/{1} -> {2}" -f $theme, $name, $dest)
    Invoke-WebRequest -Uri $url -OutFile $dest
  }
}
Write-Host "Done."
