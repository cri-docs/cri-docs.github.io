import { isLoading } from '$lib';
import FusionCollection from 'fusionable/FusionCollection';

export const prerender = true;

export function entries() {
  const collection = new FusionCollection().loadFromDir('src/content/text');
  const posts = collection.getItemsArray();
  return posts.map((post) => ({
    slug: post.fields.slug
  }));
}

export function load({ params }) {
  // isLoading.set(true);
  const collection = new FusionCollection().loadFromDir('src/content/text');
  const post = collection.getOneBySlug(params.slug);
  if (!post) {
    throw new Error('Post not found');
  }
  // isLoading.set(false);
  return { post: post.getItem() };
}