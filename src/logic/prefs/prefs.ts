export type Prefs = { reduceMotion?: boolean; audioMaster?: number; theme?: 'forest'|'ocean'|'mountain'|'autumn'|'snow' }
const KEY = 'afw_prefs_v1'
export function loadPrefs(): Prefs { try { return JSON.parse(localStorage.getItem(KEY)||'{}') } catch { return {} } }
export function savePrefs(p: Prefs) { localStorage.setItem(KEY, JSON.stringify(p)) }
export function setTheme(theme: Prefs['theme']) { const p = loadPrefs(); p.theme = theme || undefined; savePrefs(p); if (theme) { document.documentElement.dataset.theme = theme } }




