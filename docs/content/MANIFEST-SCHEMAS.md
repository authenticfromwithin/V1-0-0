
# Content Schemas

## Devotionals Manifest — `public/content/devotionals.manifest.json`
```json
[
  { "id": "2025-08-17", "title": "Let Light Rise", "date": "2025-08-17", "passage": "Psalm 43:3" }
]
```
- `id`: matches narration file basenames when present.
- `date`: ISO date string.
- `passage`: optional short reference.

### Narration (optional)
- `public/narration/tracks/<id>.mp3`
- `public/narration/tracks/<id>.ogg`
- `public/narration/captions/<id>.vtt`

## Quotes Manifest — `public/content/quotes.manifest.json`
```json
[
  { "id": "q-001", "text": "Be still, and know that I am God.", "author": "Psalm 46:10" }
]
```
