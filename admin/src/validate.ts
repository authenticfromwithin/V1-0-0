export type Kind = "announcements" | "quotes" | "devotionals" | "donate"
const isObj = (v:any)=> v && typeof v==="object" && !Array.isArray(v)

export function validate(kind:Kind, x:any): string | null {
  try {
    switch(kind){
      case "announcements":
        if(!isObj(x) || !Array.isArray((x as any).announcements)) throw "missing announcements[]"
        for(const a of (x as any).announcements){
          if(!isObj(a) || typeof a.id!=="string" || typeof a.title!=="string" || typeof a.message!=="string" || typeof a.active!=="boolean") throw "bad announcement entry"
        }
        return null
      case "quotes":
        if(!isObj(x) || !Array.isArray((x as any).categories)) throw "missing categories[]"
        for(const c of (x as any).categories){
          if(!isObj(c) || typeof c.id!=="string" || typeof c.name!=="string" || !Array.isArray((c as any).items)) throw "bad category"
          for(const it of (c as any).items){ if(!isObj(it) || typeof it.id!=="string" || typeof it.text!=="string") throw "bad quote item" }
        }
        return null
      case "devotionals":
        if(!isObj(x) || !Array.isArray((x as any).items)) throw "missing items[]"
        return null
      case "donate":
        if(!isObj(x) || !Array.isArray((x as any).links)) throw "missing links[]"
        for(const l of (x as any).links){ if(!isObj(l) || typeof l.label!=="string" || typeof l.href!=="string") throw "bad link" }
        return null
    }
  } catch(e:any) {
    return String(e)
  }
  return "unknown kind"
}
