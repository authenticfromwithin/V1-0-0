import type { AvatarRig } from 'types/avatar';
const base = '/assets/avatars/journey';
export const rigJourney: AvatarRig = {
  name: 'journey',
  clips: {
    idle: { label:'idle', sources:[
      { type:'video/webm; codecs=vp9', src:`${base}/idle/webm/idle.webm` },
      { type:'video/mp4; codecs=avc1.42E01E', src:`${base}/idle/mp4/idle.mp4` }
    ], loop:true },
    walk: { label:'walk', sources:[
      { type:'video/webm; codecs=vp9', src:`${base}/walk/webm/walk.webm` },
      { type:'video/mp4; codecs=avc1.42E01E', src:`${base}/walk/mp4/walk.mp4` }
    ], loop:true },
    pray: { label:'pray', sources:[
      { type:'video/webm; codecs=vp9', src:`${base}/pray/webm/pray.webm` },
      { type:'video/mp4; codecs=avc1.42E01E', src:`${base}/pray/mp4/pray.mp4` }
    ], loop:true },
    reflect: { label:'reflect', sources:[
      { type:'video/webm; codecs=vp9', src:`${base}/reflect/webm/reflect.webm` },
      { type:'video/mp4; codecs=avc1.42E01E', src:`${base}/reflect/mp4/reflect.mp4` }
    ], loop:true },
    read_devotional: { label:'read_devotional', sources:[
      { type:'video/webm; codecs=vp9', src:`${base}/read_devotional/webm/read_devotional.webm` },
      { type:'video/mp4; codecs=avc1.42E01E', src:`${base}/read_devotional/mp4/read_devotional.mp4` }
    ], loop:true },
    kneel: { label:'kneel', sources:[
      { type:'video/webm; codecs=vp9', src:`${base}/kneel/webm/kneel.webm` },
      { type:'video/mp4; codecs=avc1.42E01E', src:`${base}/kneel/mp4/kneel.mp4` }
    ], loop:false },
  }
};
