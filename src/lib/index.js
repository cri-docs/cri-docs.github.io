import { navigating } from "$app/stores";
import { derived } from "svelte/store";

export const isLoading = derived(navigating, ($navigating) => {
  return $navigating !== null
});
