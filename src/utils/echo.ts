export type EchoState = {
  mood: "calm"|"hopeful"|"bright"|"deep";
  fruit: "fig"|"olive"|"pomegranate"|"grape";
  doves: number;         // last released flock size
  growth: number;        // 0..100
}

const KEY = "afw:echo"
const defaultState: EchoState = { mood: "calm", fruit: "fig", doves: 0, growth: 20 }

export function loadEcho(): EchoState {
  try { return { ...defaultState, ...(JSON.parse(localStorage.getItem(KEY)||"{}")) } }
  catch { return defaultState }
}

export function saveEcho(s: EchoState){
  localStorage.setItem(KEY, JSON.stringify(s))
  window.dispatchEvent(new CustomEvent("afw:echo", { detail: s }))
}
