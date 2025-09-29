
import { redirect } from '@sveltejs/kit';
import { page } from "$app/stores"

  import { intro } from "$lib/constants"

export function load({ url }) {
  redirect(307, `/${intro}`);
}