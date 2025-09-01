export type Announcement = { id:string; title:string; message:string; severity?: "info"|"warn"|"error"; active:boolean }
export type AnnouncementsFile = { announcements: Announcement[] }

export type QuoteItem = { id:string; text:string; author?:string }
export type QuoteCategory = { id:string; name:string; items: QuoteItem[] }
export type QuotesFile = { version:number; categories: QuoteCategory[] }

export type DevotionalItem = { id:string; title:string; ref?:string; content?:string }
export type DevotionalsFile = { version:number; schedule?:string; items: DevotionalItem[] }

export type DonateLink = { label:string; href:string; platform?:string }
export type DonateLinksFile = { links: DonateLink[] }

function isObject(v:any){ return v && typeof v === "object" && !Array.isArray(v) }

export function parseAnnouncements(x:any): AnnouncementsFile {
  if(!isObject(x) || !Array.isArray((x as any).announcements)) throw new Error("Invalid announcements: missing array")
  for(const a of (x as any).announcements){
    if(!isObject(a) || typeof a.id!=="string" || typeof a.title!=="string" || typeof a.message!=="string" || typeof a.active!=="boolean"){
      throw new Error("Invalid announcement entry")
    }
  }
  return x as AnnouncementsFile
}
export function parseQuotes(x:any): QuotesFile {
  if(!isObject(x) || !Array.isArray((x as any).categories)) throw new Error("Invalid quotes: missing categories")
  for(const c of (x as any).categories){
    if(!isObject(c) || typeof c.id!=="string" || typeof c.name!=="string" || !Array.isArray((c as any).items)) throw new Error("Invalid quotes category")
    for(const it of (c as any).items){
      if(!isObject(it) || typeof it.id!=="string" || typeof it.text!=="string") throw new Error("Invalid quote item")
    }
  }
  return x as QuotesFile
}
export function parseDevotionals(x:any): DevotionalsFile {
  if(!isObject(x) || !Array.isArray((x as any).items)) throw new Error("Invalid devotionals: missing items")
  return x as DevotionalsFile
}
export function parseDonateLinks(x:any): DonateLinksFile {
  if(!isObject(x) || !Array.isArray((x as any).links)) throw new Error("Invalid donate links: missing links")
  for(const l of (x as any).links){ if(!isObject(l) || typeof l.label!=="string" || typeof l.href!=="string") throw new Error("Invalid donate link") }
  return x as DonateLinksFile
}
