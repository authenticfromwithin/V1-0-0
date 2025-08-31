import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Parallax from '@/components/SceneParallax/Parallax';
import AuthPanel from '@/components/AuthPanel';
import { getCurrentSafe } from '@/logic/auth/current-shim';
import '@/styles/scene-parallax.css';

export default function Home() {
  const nav = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const me = await getCurrentSafe();
      if (mounted && me) {
        // only redirect if we truly have a current user
        nav('/quotes', { replace: true });
      }
    })();
    return () => { mounted = false; };
  }, [nav]);

  const layers = [
    { src: '/assets/scenes/forest/plates/back.webp',  speed: 0.02, className: 'bg' },
    { src: '/assets/scenes/forest/fire/fire.webm',    speed: 0.00, className: 'fire fire-layer', blendMode: 'screen', type: 'video' as const },
    { src: '/assets/scenes/forest/plates/mid.webp',   speed: 0.04, className: 'mid' },
    { src: '/assets/scenes/forest/plates/front.webp', speed: 0.07, className: 'front' },
  ];

  return (
    <Parallax layers={layers} interactive>
      <div className="parallax-foreground">
        <AuthPanel />
      </div>
    </Parallax>
  );
}
