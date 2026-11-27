import { useCallback, useEffect, useRef } from 'react';

/**
 * Scroll-reveal hook using IntersectionObserver + callback ref.
 * - Elements already in/above the viewport animate immediately via CSS keyframes
 *   (guaranteed to end at opacity: 1, never stuck hidden).
 * - Elements below the fold reveal smoothly when scrolling into view
 *   (threshold: 0 so tall sections never fail to trigger).
 * - If IntersectionObserver is unavailable, elements remain visible.
 */
const useReveal = ({
  threshold = 0,
  rootMargin = '0px 0px 40px 0px',
  delay = 0,
  direction = 'up',
} = {}) => {
  const observerRef = useRef(null);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const ref = useCallback(
    (el) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!el || el.dataset.revealed === 'true') return;
      if (typeof IntersectionObserver === 'undefined') {
        el.dataset.revealed = 'true';
        return;
      }

      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight * 0.98;

      if (delay) {
        el.style.animationDelay = `${delay}ms`;
        el.style.transitionDelay = `${delay}ms`;
      }

      if (isInViewport) {
        el.dataset.revealed = 'true';
        el.classList.remove('reveal-pending');
        el.classList.add(`reveal-enter-${direction}`);
        return;
      }

      el.classList.add(`reveal-${direction}`, 'reveal-pending');

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            el.dataset.revealed = 'true';
            el.classList.add('reveal-visible');
            el.classList.remove('reveal-pending');
            observer.unobserve(el);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(el);
      observerRef.current = observer;
    },
    [threshold, rootMargin, delay, direction]
  );

  return ref;
};

export default useReveal;
