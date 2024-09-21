import PocketBase from "pocketbase";
import { z } from 'astro:content';

/******* ENUMS *******/
export const collectionValues = @@_COLLECTION_NAMES_@@;
export const Collection = z.enum(collectionValues);
export const COLLECTION = Collection.enum;

@@_ENUMS_@@

/******* BASE *******/
export const BaseModel = z.object({
  created: z.string().pipe(z.coerce.date()),
  id: z.string(),
  updated: z.string().pipe(z.coerce.date()),
});

export const AdminModel = z.object({
  ...BaseModel.shape,
  avatar: z.string(),
  email: z.string().email(),
});

export const RecordModel = z.object({
  ...BaseModel.shape,
  collectionId: z.string(),
  collectionName: z.string(),
  expand: z.any().optional(),
});

/******* RECORDS *******/
@@_RECORDS_@@

/******* LOADER *******/
let pocketbase;
let auth;
let isAuthenticating = false;

export function pocketbaseLoader({ collection }) {
	return {
		name: "pocketbase-loader",
		load: async ({ store, logger, meta, parseData }) => {
      const { ASTRO_POCKETBASE_ADMIN_EMAIL, ASTRO_POCKETBASE_ADMIN_PASSWORD, PROD, PUBLIC_ASTRO_POCKETBASE_URL } = import.meta.env;
      if (!ASTRO_POCKETBASE_ADMIN_EMAIL || !ASTRO_POCKETBASE_ADMIN_PASSWORD || !PUBLIC_ASTRO_POCKETBASE_URL)
        return logger.error("Environment variables not set");

      logger.info(`Loading ${collection}`);

      if (!pocketbase) pocketbase = new PocketBase(PUBLIC_ASTRO_POCKETBASE_URL);

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
    schema: records.get(collection),
	};
}