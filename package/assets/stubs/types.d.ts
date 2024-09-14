declare module "pocketbase:astro" {
  import type Pocketbase from "pocketbase";
  import type { RecordService } from 'pocketbase';
  import type {z} from "astro/zod";

  /******* LOADER *******/
  export type PocketbaseLoaderOptions = { 
    collection: Collection;
  };

  export const pocketbaseLoader: (options: PocketbaseLoaderOptions) => <T>() => Promise<T[]>;

  /******* ENUMS *******/
  export const collectionValues: readonly @@_COLLECTION_NAMES_@@;
  export const Collection: z.ZodEnum<typeof collectionValues>;
  export const COLLECTION: z.Values<typeof collectionValues>;
  export type Collection = z.infer<typeof Collection>;
  
  @@_ENUMS_@@

  /******* BASE *******/
  export type BaseModel = {
    created: Date;
		id: string;
    updated: Date;
	};

  export type AdminModel = BaseModel & {
		avatar: string;
    email: string;
	};

  export type RecordModel<E extends Record<string, any> | never = never> = BaseModel & {
    collectionId: string;
    collectionName: string;
    expand?: E;
  };

  export type RecordRef<C extends Collection = Collection> = {collection: C; id: string};

  /******* RECORDS *******/
  @@_RECORDS_@@

  /******* CLIENT *******/
  export type AstroPocketbase = Pocketbase & {
@@_SERVICES_@@
  };
}
