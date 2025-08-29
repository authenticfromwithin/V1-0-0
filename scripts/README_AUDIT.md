# AFW Tree Auditor (offline preflight)

**Run**
- Double-click: `scripts\run-audit.bat`
- Or from terminal:
  ```
  cd <your-project-root>
  node scripts\audit-tree.mjs
  ```

It prints OK/MISS lines and writes `scripts/last-audit.json`.

**Checks**
- Vite core files
- Pages
- Components
- Styles index
- Guards
- Scene plates per theme
- Stems per theme
- Fonts
- Content manifests (JSON validity)
- Narration folders
- Avatars (required loops present as MP4 at minimum)
- Next-wave avatar clips (informational)
