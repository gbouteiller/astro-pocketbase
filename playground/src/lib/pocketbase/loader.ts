import type { Collection, TypedPocketbase } from "./schemas";
import type { LoaderContext } from "astro/loaders";
import Pocketbase, { type AdminAuthResponse } from "pocketbase";

let pocketbase: TypedPocketbase;
let auth: Promise<AdminAuthResponse>;
let isAuthenticating = false;

export function pocketbaseLoader({ collection }: PocketbaseLoaderOptions) {
  return {
    name: "pocketbase-loader",
    load: async ({ store, logger, meta, parseData }: LoaderContext) => {
      const { ASTRO_POCKETBASE_ADMIN_EMAIL, ASTRO_POCKETBASE_ADMIN_PASSWORD, PUBLIC_ASTRO_POCKETBASE_URL } = import.meta.env;
      if (!ASTRO_POCKETBASE_ADMIN_EMAIL || !ASTRO_POCKETBASE_ADMIN_PASSWORD || !PUBLIC_ASTRO_POCKETBASE_URL)
        return logger.error("Environment variables not set");

      logger.info(`Loading ${collection}`);

      if (!pocketbase) pocketbase = new Pocketbase(PUBLIC_ASTRO_POCKETBASE_URL);

      try {
        if (!isAuthenticating && !pocketbase.authStore.isValid) {
          isAuthenticating = true;
          auth = pocketbase.admins.authWithPassword(ASTRO_POCKETBASE_ADMIN_EMAIL, ASTRO_POCKETBASE_ADMIN_PASSWORD);
        }
        await auth;

        const lastUpdatedItems = await pocketbase
          .collection(collection)
          .getList(1, 1, { fields: "updated", skipTotal: true, sort: "updated", order: "desc" });
        const lastUpdated = lastUpdatedItems.items[0]?.updated;

        if (lastUpdated !== meta.get("last-updated")) {
          logger.info(`Refreshing ${collection}`);

          meta.set("last-updated", lastUpdated);
          const items = await pocketbase.collection(collection).getFullList();
          for (const { id, updated, ...rest } of items) {
            const data = await parseData({ id, data: { id, updated, ...rest } });
            store.set({ data, digest: updated, id });
          }
        }

        logger.info(`Loaded ${collection}`);
      } catch (error) {
        logger.error(`Error fetching ${collection}: ${error}`);
        return;
      }
    },
  };
}

export type PocketbaseLoaderOptions = {
  collection: Collection;
};
