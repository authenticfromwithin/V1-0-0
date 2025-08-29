Param(
  [switch]$Devotionals,
  [switch]$QuotesValidate,
  [switch]$QuotesMerge
)
$root = Get-Location
$script = Join-Path $root "scripts/content/publish.mjs"
$flags = @()
if ($Devotionals){ $flags += "--devotionals" }
if ($QuotesValidate){ $flags += "--quotes-validate" }
if ($QuotesMerge){ $flags += "--quotes-merge" }
node $script @flags
