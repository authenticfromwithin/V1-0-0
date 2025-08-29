import type { AvatarRig } from 'types/avatar';
const base = '/assets/avatars/healing';
const getVariant = () => (localStorage.getItem('afw:appearance:healingVariant') || '').toLowerCase(); // 'set-a' | 'set-b' | ''

function sourcesFor(state: string){
  const v = getVariant();
  // Try variant WEBM/MP4 first, then base WEBM/MP4.
  const tryList = v ? [
    { type:'video/webm; codecs=vp9', src:`${base}/${state}/${v}/webm/${state}.webm` },
    { type:'video/mp4; codecs=avc1.42E01E', src:`${base}/${state}/${v}/mp4/${state}.mp4` },
  ] : [];
  return [
    ...tryList,
    { type:'video/webm; codecs=vp9', src:`${base}/${state}/webm/${state}.webm` },
    { type:'video/mp4; codecs=avc1.42E01E', src:`${base}/${state}/mp4/${state}.mp4` },
  ];
}

export const rigHealing: AvatarRig = {
  name: 'healing',
  clips: {
    idle: { label:'idle', poster:`${base}/posters/idle.jpg`, sources: sourcesFor('idle'), loop: true },
    walk: { label:'walk', poster:`${base}/posters/walk.jpg`, sources: sourcesFor('walk'), loop: true },
    stretch: { label:'stretch', poster:`${base}/posters/stretch.jpg`, sources: sourcesFor('stretch'), loop: false },
    drink: { label:'drink', poster:`${base}/posters/drink.jpg`, sources: sourcesFor('drink'), loop: false },
    sit_pray: { label:'sit_pray', poster:`${base}/posters/sit_pray.jpg`, sources: sourcesFor('sit_pray'), loop: true },
    pick_eat_fruit: { label:'pick_eat_fruit', poster:`${base}/posters/pick_eat_fruit.jpg`, sources: sourcesFor('pick_eat_fruit'), loop: false },
  }
};
export default rigHealing;
