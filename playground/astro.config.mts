import tailwind from "@astrojs/tailwind";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import { defineConfig, envField } from "astro/config";

const { default: pocketbase } = await import("astro-pocketbase");

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    pocketbase(),
    hmrIntegration({
      directory: createResolver(import.meta.url).resolve("../package/dist"),
    }),
  ],
  env: {
    schema: {
      ASTRO_POCKETBASE_ADMIN_EMAIL: envField.string({ context: "server", access: "secret" }),
      ASTRO_POCKETBASE_ADMIN_PASSWORD: envField.string({ context: "server", access: "secret" }),
      PUBLIC_ASTRO_POCKETBASE_URL: envField.string({ context: "server", access: "public" }),
    },
  },
});
