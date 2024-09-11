import eFetch from "@11ty/eleventy-fetch";
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
export function pocketbaseLoader({ collection }) {
	return {
		name: "pocketbase-loader",
		load: async ({ store, logger, parseData, generateDigest }) => {
      const { ASTRO_POCKETBASE_ADMIN_EMAIL, ASTRO_POCKETBASE_ADMIN_PASSWORD, PROD, PUBLIC_ASTRO_POCKETBASE_URL } = import.meta.env;
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
          duration: "@@_CACHE_DURATION_@@",
					dryRun: PROD,
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
    schema: records.get(collection),
	};
}