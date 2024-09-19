import eFetch from "@11ty/eleventy-fetch";
import type { LoaderContext } from "astro/loaders";

export function pocketbaseLoader({ collection }: { collection: "config" | "images" | "knowledges" }) {
  return {
    name: "pocketbase-loader",
    load: async ({ store, logger, parseData, generateDigest }: LoaderContext) => {
      const { ASTRO_POCKETBASE_ADMIN_EMAIL, ASTRO_POCKETBASE_ADMIN_PASSWORD, PUBLIC_ASTRO_POCKETBASE_URL } = import.meta.env;
      if (!ASTRO_POCKETBASE_ADMIN_EMAIL || !ASTRO_POCKETBASE_ADMIN_PASSWORD || !PUBLIC_ASTRO_POCKETBASE_URL)
        return logger.error("undefined env variables");

      try {
        const { token } = await eFetch(`${PUBLIC_ASTRO_POCKETBASE_URL}/api/admins/auth-with-password`, {
          duration: "0s",
          dryRun: true,
          type: "json",
          fetchOptions: {
            body: JSON.stringify({ identity: ASTRO_POCKETBASE_ADMIN_EMAIL, password: ASTRO_POCKETBASE_ADMIN_PASSWORD }),
            method: "post",
            headers: { "Content-Type": "application/json" },
          },
        });

        const { items } = await eFetch(`${PUBLIC_ASTRO_POCKETBASE_URL}/api/collections/${collection}/records?perPage=200`, {
          duration: "1d",
          dryRun: import.meta.env.PROD,
          directory: ".astro-pocketbase",
          type: "json",
          fetchOptions: {
            headers: { Authorization: token },
          },
        });

        store.clear();

        for (const { id, ...rest } of items) {
          const data = await parseData({ id, data: { id, ...rest } });
          const digest = generateDigest(data);
          store.set({ data, digest, id });
        }
      } catch (error) {
        logger.error(`Error fetching ${collection}: ${error}`);
        return;
      }
    },
  };
}
