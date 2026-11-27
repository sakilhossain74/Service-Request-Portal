import { useCallback, useEffect, useRef } from 'react';

/**
 * Staggered reveal for a container's direct children using a callback ref.
 * - Children already in/above the viewport animate immediately via CSS keyframes
 *   (guaranteed to end at opacity: 1).
 * - Below-the-fold containers reveal smoothly on scroll with threshold: 0.
 */
const useStaggerReveal = ({
  threshold = 0,
  rootMargin = '0px 0px 40px 0px',
  baseDelay = 60,
  stagger = 80,
  direction = 'up',
} = {}) => {
  const observerRef = useRef(null);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const ref = useCallback(
    (container) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!container || container.dataset.revealed === 'true') return;
      if (typeof IntersectionObserver === 'undefined') {
        container.dataset.revealed = 'true';
        return;
      }

      const children = Array.from(container.children);
      if (children.length === 0) return;

      const rect = container.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight * 0.98;

      if (isInViewport) {
        container.dataset.revealed = 'true';
        children.forEach((child, i) => {
          child.style.animationDelay = `${baseDelay + i * stagger}ms`;
          child.classList.remove('reveal-pending');
          child.classList.add(`reveal-enter-${direction}`);
        });
        return;
      }

      children.forEach((child, i) => {
        if (child.dataset.revealed === 'true') return;
        child.classList.add(`reveal-${direction}`, 'reveal-pending');
        child.style.transitionDelay = `${baseDelay + i * stagger}ms`;
      });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            container.dataset.revealed = 'true';
            children.forEach((child) => {
              child.dataset.revealed = 'true';
              child.classList.add('reveal-visible');
              child.classList.remove('reveal-pending');
            });
            observer.unobserve(container);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(container);
      observerRef.current = observer;
    },
    [threshold, rootMargin, baseDelay, stagger, direction]
  );

  return ref;
};

export default useStaggerReveal;
