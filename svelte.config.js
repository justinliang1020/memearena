import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {

    // When building for GitHub Pages, if your repo name is not equivalent to your-username.github.io, 
    // make sure to update config.kit.paths.base to match your repo name. 
    // This is because the site will be served from https://your-username.github.io/your-repo-name rather than from the root.
    // https://svelte.dev/docs/kit/adapter-static#GitHub-Pages
    adapter: adapter(),
    paths: {
      base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
    }
  }
};

export default config;
