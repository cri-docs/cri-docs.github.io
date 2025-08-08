
import { redirect } from '@sveltejs/kit';
import { page } from "$app/stores"

export function load({ url }) {
  redirect(307, '/editorial');
}