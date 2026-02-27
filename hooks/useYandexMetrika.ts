import { useEffect } from 'react';

const METRIKA_ID = 106811417;

export const useYandexMetrika = () => {
  useEffect(() => {
    try {
      const accepted = localStorage.getItem('cookie_accepted');
      
      if (accepted === 'true' && !(window as any)._ymLoaded) {
        (window as any)._ymLoaded = true;

        const script = document.createElement('script');
        script.src = 'https://mc.yandex.ru/metrika/tag.js';
        script.async = true;
        script.onload = () => {
          (window as any).ym = (window as any).ym || function() {
            ((window as any).ym.a = (window as any).ym.a || []).push(arguments);
          };
          (window as any).ym(METRIKA_ID, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
          });
        };
        document.head.appendChild(script);
      }
    } catch (e) {
      console.error('Metrika error:', e);
    }
  }, []);

  const reachGoal = (goal: string) => {
    try {
      const accepted = localStorage.getItem('cookie_accepted');
      if (accepted === 'true' && (window as any).ym) {
        (window as any).ym(METRIKA_ID, 'reachGoal', goal);
      }
    } catch (e) {
      console.error('Goal error:', e);
    }
  };

  return { reachGoal };
};