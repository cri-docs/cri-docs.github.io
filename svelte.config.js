import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { cssModules } from 'svelte-preprocess-cssmodules';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
		cssModules(),
	],
	kit: {
		prerender: {
			// handleMissingId: 'warn',
			handleMissingId: 'ignore',
			// handleHttpError: ({ path, referrer, message }) => {
			// 	// ignore deliberate link to shiny 404 page
			// 	if (path === '/not-found' && referrer === '/blog/how-we-built-our-404-page') {
			// 		return;
			// 	}

			// 	// otherwise fail the build
			// 	throw new Error(message);
			// }
		},
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH 
		}
	}
};

export default config;