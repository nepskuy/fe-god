import { writable, type Writable } from 'svelte/store';

/**
 * Mengontrol status terbuka/tertutup dari menu overlay.
 */
export const isMenuOpen: Writable<boolean> = writable(false);