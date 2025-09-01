export type Route = "home"|"quotes"|"journal"|"healing"|"journey"|"donations"

export function readRoute(): Route {
  const h = (location.hash || "#/home").toLowerCase()
  if (h.startsWith("#/home")) return "home"
  if (h.startsWith("#/quotes")) return "quotes"
  if (h.startsWith("#/journal")) return "journal"
  if (h.startsWith("#/healing")) return "healing"
  if (h.startsWith("#/journey")) return "journey"
  if (h.startsWith("#/donations")) return "donations"
  return "home"
}

export function navTo(r: Route) {
  const t = `#/${r}`
  if (location.hash !== t) location.hash = t
}

export function onRoute(cb:()=>void){
  const f = () => cb()
  addEventListener("hashchange", f)
  return () => removeEventListener("hashchange", f)
}
