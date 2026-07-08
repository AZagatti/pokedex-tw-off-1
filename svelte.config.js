import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: "404.html",
      prerender: {
        entries: ["*"],
      },
    }),
    paths: {
      base: process.env.NODE_ENV === "production" ? "/pokedex-tw-off-1" : "",
    },
  },
};

export default config;
