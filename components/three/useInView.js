'use client';

import { useEffect, useState } from 'react';

// True while the element is on (or near) screen. Used to pause 3D rendering
// for canvases the visitor cannot see.
export default function useInView(ref, rootMargin = '200px') {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

// Becomes true the first time the element comes near the screen and stays
// true, so a 3D scene is only created when the visitor gets close to it.
export function useSeen(inView) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);
  return seen;
}
