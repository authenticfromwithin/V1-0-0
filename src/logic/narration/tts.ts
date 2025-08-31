export type TTSOptions = { voice?: string; rate?: number; pitch?: number };
const KEY = 'afw:tts:opts';

export function getVoices(): SpeechSynthesisVoice[]{
  return window.speechSynthesis.getVoices();
}

export function getOpts(): TTSOptions{
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
export function setOpts(o: TTSOptions){
  localStorage.setItem(KEY, JSON.stringify(o));
}

export function speak(text: string, opts: TTSOptions, onEnd?: ()=>void){
  stop();
  const utter = new SpeechSynthesisUtterance(text);
  const voices = getVoices();
  if (opts.voice){
    const v = voices.find(v=>v.name===opts.voice || v.lang===opts.voice);
    if (v) utter.voice = v;
  }
  utter.rate = Math.min(1.4, Math.max(0.7, opts.rate ?? 1));
  utter.pitch = Math.min(2, Math.max(0.5, opts.pitch ?? 1));
  utter.onend = ()=> onEnd && onEnd();
  window.speechSynthesis.speak(utter);
}

export function stop(){ window.speechSynthesis.cancel(); }
export function pause(){ window.speechSynthesis.pause(); }
export function resume(){ window.speechSynthesis.resume(); }


