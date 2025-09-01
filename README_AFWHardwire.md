# AFW Hardwire Kit v5

This kit locks down build wiring (local + Vercel) without changing your visuals.

## Steps (root of repo)
1. Unzip over the project
   ```powershell
   Expand-Archive -LiteralPath "$env:USERPROFILE\Downloads\afw_hardwire_kit_v5.zip" -DestinationPath . -Force
   ```
2. Repair lock & reinstall
   ```powershell
   .\scripts\repair-lock.ps1
   ```
3. Optional sanity
   ```powershell
   .\scripts\ensure-public-assets.ps1
   .\scripts\fix-index-html.ps1
   .\scripts\verify-imports.ps1
   ```
4. Local build & preview
   ```powershell
   npm run build
   npm run preview
   ```
5. Vercel
   ```powershell
   vercel pull
   vercel build
   vercel deploy --prod
   ```
