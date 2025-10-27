import { isLoading } from '$lib';
import FusionCollection from 'fusionable/FusionCollection';

export const prerender = true;

export function entries() {
  const collection = new FusionCollection().loadFromDir('src/content/text');
  const array = collection.getItemsArray();
  const sites = array.filter(site => {
    return site.filename.startsWith("_____") }
  )
  return sites.map((site) => ({
    slug: site.fields.slug
  }));
}

export function load({ params }) {
  // isLoading.set(true);
  const collection = new FusionCollection().loadFromDir('src/content/text');
  const site = collection.getOneBySlug(params.slug);
  if (!site) {
    throw new Error('site not found');
  }
  // isLoading.set(false);
  return { site: site.getItem() };
}