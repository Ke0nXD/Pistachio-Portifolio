'use client';
import { useEffect, useRef } from 'react';

const STICKERS = ['🐾', '💜', '⭐', '✨', '💚', '🌟', '💕', '🌿'];
const isMobileDevice = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

export function ClickStickers() {
  const countRef = useRef(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only trigger on decorative areas, not buttons/inputs
      if (target.closest('button') || target.closest('input') || target.closest('a') || target.closest('select')) return;

      const maxStickers = isMobileDevice() ? 2 : 4;
      const num = Math.floor(Math.random() * 2) + 1;

      for (let i = 0; i < Math.min(num, maxStickers - countRef.current); i++) {
        spawnSticker(e.clientX, e.clientY);
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const spawnSticker = (x: number, y: number) => {
    const el = document.createElement('div');
    el.className = 'sticker-pop';
    el.textContent = STICKERS[Math.floor(Math.random() * STICKERS.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.position = 'fixed';
    el.style.zIndex = '9999';
    el.style.pointerEvents = 'none';
    el.style.userSelect = 'none';
    el.style.fontSize = `${Math.random() * 12 + 16}px`;
    el.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(el);
    countRef.current++;

    setTimeout(() => {
      el.remove();
      countRef.current--;
    }, 900);
  };

  return null;
}
