declare module "pocketbase:astro" {
  import type { CollectionEntry } from "astro:content";
  import type { LoaderContext } from "astro/loaders";
  import type {z} from "astro/zod";
  import type Pocketbase from "pocketbase";
  import type { RecordService } from 'pocketbase';
  
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

  /******* RECORDS *******/
  @@_RECORDS_@@

  /******* CLIENT *******/
  export type AstroPocketbase = Pocketbase & {
@@_SERVICES_@@
  };

  /******* LOADER *******/
  export type PocketbaseLoaderOptions = { 
    collection: Collection;
  };
  
  export const pocketbaseLoader: (options: PocketbaseLoaderOptions) => {
    name: "pocketbase-loader";
    load: (context: LoaderContext) => Promise<void>;
    schema: z.AnyZodObject;
  };

  /******* HELPERS *******/
  export async function getRecords<C extends Collection, R = Record<C>>(
    collectionOrRefs: C | RecordIdRef<C>[],
    options: { filter?: (record: Record<C>) => boolean; map?: (record: Record<C>) => R } = {},
  ): Promise<R extends Promise<any> ? Awaited<R>[] : R[]>;
  
  export async function getRecord<C extends Collection, R = Record<C> | undefined>(
    ref: RecordRef<C>,
    transform: (record: Record<C> | undefined) => R = (record) => record as R,
  ): Promise<R extends Promise<any> ? Awaited<R> : R>;
  
  export async function getRecordOrThrow<C extends Collection, R = Record<C>>(
    ref: RecordRef<C>,
    transform: (record: Record<C>) => R = (record) => record as R,
  ): Promise<R extends Promise<any> ? Awaited<R> : R>;
  
  export type Record<C extends Collection> = CollectionEntry<C>["data"];
  export type RecordIdRef<C extends Collection = Collection> = {collection: C; id: string};
  export type RecordSlugRef<C extends Collection = Collection> = {collection: C; slug: string};
  export type RecordRef<C extends Collection = Collection> = RecordIdRef<C> | RecordSlugRef<C>;
}
