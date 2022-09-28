import {writable, derived} from 'svelte/store';

export const sortBy = writable("rating");
export const searchFilters = writable(["tags", "foods"]);
export const searchQuery = writable("");