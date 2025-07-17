import FusionCollection from 'fusionable/FusionCollection';

export const prerender = true;
export const ssr = true;

export function load() {
  const collection = new FusionCollection()
    .loadFromDir('src/content/text')
    .orderBy('order', 'asc');

  const sites = collection.getItemsArray();
  return { sites };
}