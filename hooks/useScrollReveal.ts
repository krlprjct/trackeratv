import { useEffect, useRef, useCallback } from 'react';

/**
 * Хук для плавного появления элементов при скролле.
 * Использует IntersectionObserver — нативный API, не нагружает.
 *
 * @param options.threshold — какая доля элемента должна быть видна (0–1), по умолчанию 0.15
 * @param options.stagger — задержка между дочерними элементами с классом .reveal-child (мс)
 */
export function useScrollReveal(options?: { threshold?: number; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const threshold = options?.threshold ?? 0.15;
  const stagger = options?.stagger ?? 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Если есть stagger — анимируем дочерние .reveal-child по очереди
            if (stagger > 0) {
              const children = el.querySelectorAll('.reveal-child');
              children.forEach((child, i) => {
                setTimeout(() => {
                  child.classList.add('visible');
                }, i * stagger);
              });
            }
            el.classList.add('visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, stagger]);

  return ref;
}
