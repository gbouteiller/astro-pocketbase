import { z } from 'astro:content';
import Pocketbase from "pocketbase";

/******* ENUMS *******/
export const collectionValues = @@_COLLECTION_NAMES_@@;
export const Collection = z.enum(collectionValues);
export const COLLECTION = Collection.enum;

@@_ENUMS_@@

/******* BASE *******/
export const BaseModel = z.object({
  created: z.string().datetime().transform((value) => new Date(value)),
  id: z.string(),
  updated: z.string().datetime().transform((value) => new Date(value)),
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
      const { ASTRO_POCKETBASE_ADMIN_EMAIL, ASTRO_POCKETBASE_ADMIN_PASSWORD, PUBLIC_ASTRO_POCKETBASE_URL } = import.meta.env;
		  if (!ASTRO_POCKETBASE_ADMIN_EMAIL || !ASTRO_POCKETBASE_ADMIN_PASSWORD || !PUBLIC_ASTRO_POCKETBASE_URL) 
        return logger.error("undefined env variables");
			try {
        const pocketbase = new Pocketbase(PUBLIC_ASTRO_POCKETBASE_URL);
        await pocketbase.admins.authWithPassword(ASTRO_POCKETBASE_ADMIN_EMAIL, ASTRO_POCKETBASE_ADMIN_PASSWORD);
				const records = await pocketbase.collection(collection).getFullList();
				store.clear();
				for (const { id, ...rest } of records) {
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