import { writable } from 'svelte/store';

export const currentFootnote = writable(13);
export const currentFootnoteIsSetFixed = writable(false);
export const headerIsOpen = writable(true);
export const menuIsOpen = writable(true);
export const activeHeader = writable(null);


