import { writable } from 'svelte/store';

export const currentFootnote = writable(null);
export const headerIsOpen = writable(true);
export const menuIsOpen = writable(true);

