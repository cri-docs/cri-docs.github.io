// import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vite';
// import path from 'path';

// export default defineConfig({
// 	plugins: [sveltekit()],
// 	resolve: {
// 		alias: {
// 			'|': path.resolve(__dirname, 'src')
// 		}
// 	}
// });


import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig, loadEnv } from 'vite'
import { injectStylusBreakpoints } from "@azt/responsive/vite"

import path from 'path'

import BREAKPOINTS from "./src/lib/breakpoints.json"

export default ({ mode })=> {
  return defineConfig({
    plugins: [
      sveltekit(),
      // devtoolsJson(),
      injectStylusBreakpoints({
        breakpoints: BREAKPOINTS,
      }),
    ],
  	resolve: {
		  alias: {
			  '|': path.resolve(__dirname, 'src')
		  }
	  }
  })
}

