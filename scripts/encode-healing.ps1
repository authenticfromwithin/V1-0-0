param([Parameter(Mandatory=$true)][string]$state,[Parameter(Mandatory=$true)][string]$input,[string]$variant="")
$local = Join-Path (Split-Path $PSScriptRoot -Parent) "bin\ffmpeg.exe"
$ffmpeg = (Test-Path $local) ? $local : "ffmpeg"
$outDir = "public/assets/avatars/healing/$state"
if ($variant -ne "") { $outDir = "$outDir/$variant" }
New-Item -ItemType Directory -Force -Path "$outDir/webm" | Out-Null
New-Item -ItemType Directory -Force -Path "$outDir/mp4"  | Out-Null
& $ffmpeg -y -i $input -an -r 30 -pix_fmt yuv420p -c:v libvpx-vp9 -b:v 0 -crf 28 -g 60 -row-mt 1 "$outDir/webm/$state.webm"
& $ffmpeg -y -i $input -an -r 30 -pix_fmt yuv420p -c:v libx264 -crf 18 -preset medium -profile:v high -level 4.1 -g 60 "$outDir/mp4/$state.mp4"
