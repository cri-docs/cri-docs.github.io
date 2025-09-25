import { readable } from 'svelte/store';

import BREAKPOINTS from './breakpoints.json';

function createMediaStore(query) {
  return readable(false, (set) => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    const update = () => set(mediaQueryList.matches);

    set(mediaQueryList.matches);
    mediaQueryList.addEventListener('change', update);

    return () => mediaQueryList.removeEventListener('change', update);
  });
}

const mediaStores = {};

for (const [key, value] of Object.entries(BREAKPOINTS)) {
  const [min, max] = value.width;
  let query = '';

  if (min !== undefined && max !== undefined) {
    query = `(min-width: ${min}px) and (max-width: ${max}px)`;
  } else if (min !== undefined) {
    query = `(min-width: ${min}px)`;
  } else if (max !== undefined) {
    query = `(max-width: ${max}px)`;
  }

  mediaStores[`is${key.charAt(0).toUpperCase() + key.slice(1)}`] = createMediaStore(query);
}

export const useResize = { ...mediaStores };