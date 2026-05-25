'use client';
import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isMobile = useRef(false);

  useEffect(() => {
    // Detect touch/mobile
    isMobile.current = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isMobile.current) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Smooth follow
      curX += (mouseX - curX) * 0.2;
      curY += (mouseY - curY) * 0.2;
      if (cursor) {
        cursor.style.left = curX + 'px';
        cursor.style.top = curY + 'px';
      }
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    animate();

    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      id="custom-cursor"
      aria-hidden="true"
      style={{ position: 'fixed', pointerEvents: 'none', zIndex: 99999, transform: 'translate(-50%, -50%)', fontSize: '24px', lineHeight: 1 }}
    >
      {/* Replace with: <img src="/cursor/paw.png" alt="" width={32} height={32} /> */}
      🐾
    </div>
  );
}
