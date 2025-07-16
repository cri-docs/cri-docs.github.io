// src/routes/+page.server.js

import FusionCollection from 'fusionable/FusionCollection';

export const prerender = true;
export function load() {
  const collection = new FusionCollection()
    .loadFromDir('src/content/text')
    .orderBy('date', 'desc');

  const sites = collection.getItemsArray();
  console.log('sites loaded:', sites);
  return { sites };
}