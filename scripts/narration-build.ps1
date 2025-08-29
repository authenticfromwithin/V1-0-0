Param(
  [string]$IdsFile = "scripts/narration-ids.txt"
)

$ErrorActionPreference = "Stop"

Function Find-JsonForId([string]$id) {
  if ($id -match '^devotional-(\d{4})-(\d{2})-(\d{2})$') {
    $yyyy = $Matches[1]; $mm = $Matches[2]
    $p = "public/content/devotionals/$yyyy-$mm/$id.json"
    if (Test-Path $p) { return $p }
  }
  # fallback search
  $results = Get-ChildItem -Recurse -Path "public/content/devotionals" -Filter "$id.json" -ErrorAction SilentlyContinue
  if ($results.Count -gt 0) { return $results[0].FullName }
  return $null
}

Function Ensure-Dirs() {
  New-Item -ItemType Directory -Force -Path "public/narration/tracks" | Out-Null
  New-Item -ItemType Directory -Force -Path "public/narration/captions" | Out-Null
}

Function Make-Wav([string]$text, [string]$wavPath) {
  $voice = New-Object -ComObject SAPI.SpVoice
  $file = New-Object -ComObject SAPI.SpFileStream
  $format = New-Object -ComObject SAPI.SpAudioFormat
  # 22kHz, 16-bit mono
  $format.Type = 22
  $file.Format = $format
  $file.Open($wavPath, 3) # SSFMCreateForWrite = 3
  $voice.AudioOutputStream = $file
  $voice.Rate = -1
  $voice.Volume = 100
  $voice.Speak($text) | Out-Null
  $file.Close()
}

Function Get-FFmpeg() {
  $ff = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($null -eq $ff) { return $null } else { return $ff.Path }
}

Function Make-VTT([string]$vttPath, [double]$seconds) {
  $dur = [TimeSpan]::FromSeconds([Math]::Round($seconds,2))
  $h = "{0:D2}" -f $dur.Hours
  $m = "{0:D2}" -f $dur.Minutes
  $s = "{0:D2}" -f $dur.Seconds
  $timestamp = "$h:$m:$s.000"
  $content = "WEBVTT`n`n00:00:00.000 --> $timestamp`nNarration`n"
  Set-Content -Path $vttPath -Value $content -Encoding UTF8
}

Ensure-Dirs()

if (!(Test-Path $IdsFile)) {
  Write-Error "IDs file not found: $IdsFile"
}

$ffmpeg = Get-FFmpeg()
if ($null -eq $ffmpeg) {
  Write-Warning "ffmpeg not found in PATH — will output WAV only (no MP3/OGG)."
}

Get-Content $IdsFile | ForEach-Object {
  $id = $_.Trim()
  if ($id -eq "") { return }
  $jsonPath = Find-JsonForId $id
  if ($null -eq $jsonPath) { Write-Warning "JSON not found for $id"; return }

  $json = Get-Content $jsonPath -Raw | ConvertFrom-Json
  $title = $json.title
  $body = $json.body
  if ($null -eq $body -and $null -ne $json.text) { $body = $json.text }
  if ($null -eq $title) { $title = $id }
  if ($null -eq $body) { $body = "" }
  $speak = ($title + "`n" + $body).Substring(0, [Math]::Min(800, ($title + "`n" + $body).Length))

  $wav = "public/narration/tracks/$id.wav"
  Write-Host "Synthesizing $id → WAV…"
  Make-Wav $speak $wav

  $mp3 = "public/narration/tracks/$id.mp3"
  $ogg = "public/narration/tracks/$id.ogg"
  $vtt = "public/narration/captions/$id.vtt"

  $duration = 0.0
  if ($ffmpeg) {
    Write-Host "Transcoding to MP3 & OGG…"
    # get duration and transcode
    $ffout = & ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$wav" 2>$null
    if ($LASTEXITCODE -eq 0) { $duration = [double]$ffout } else { $duration = 0.0 }
    & ffmpeg -y -i "$wav" -codec:a libmp3lame -q:a 4 "$mp3" 2>$null
    & ffmpeg -y -i "$wav" -codec:a libvorbis -q:a 5 "$ogg" 2>$null
  }

  if ($duration -le 0) {
    # rough estimate 160 wpm ≈ 2.67 wps
    $wordCount = ($speak -split '\s+').Count
    $duration = [double]([Math]::Max(10, [Math]::Round($wordCount / 2.67)))
  }

  Make-VTT $vtt $duration
  Write-Host "✓ $id done."
}