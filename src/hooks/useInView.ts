import { useEffect, useRef, useState } from "react";

export function useInView(
  threshold = 0.15,
  rootMargin = "0px 0px -40px 0px"
) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    const start = () => observer.observe(el);

    if (document.body.classList.contains("intro-playing")) {
      const check = setInterval(() => {
        if (!document.body.classList.contains("intro-playing")) {
          clearInterval(check);
          start();
        }
      }, 100);
      return () => {
        clearInterval(check);
        observer.disconnect();
      };
    }

    start();
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
