import { addVirtualImports, createResolver, defineIntegration } from "astro-integration-kit";
import dotenv from "dotenv";
import { readFileSync } from "node:fs";
import type { CollectionModel } from "pocketbase";
import { stringifyContent } from "./content.js";
import { optionsSchema } from "./options.js";
import { stringifyTypes } from "./types.js";
import { fetchSortedCollections } from "./utils.js";

dotenv.config();

export const integration = defineIntegration({
  name: "astro-pocketbase",
  optionsSchema,
  setup({ name, options }) {
    const { resolve } = createResolver(import.meta.url);

    let collections: CollectionModel[] = [];

    return {
      hooks: {
        "astro:config:setup": async (params) => {
          const { addMiddleware, logger } = params;

          const { data, error } = await fetchSortedCollections();
          if (error) return logger.error(error instanceof Error ? error.message : "unknown error");

          collections = data;

          const stub = readFileSync(resolve("../assets/stubs/index.js"), "utf-8");
          const { collectionNames, enums, records } = stringifyContent(collections, options);
          const content = stub
            .replace("@@_CACHE_DURATION_@@", options.cacheDuration)
            .replace("@@_COLLECTION_NAMES_@@", collectionNames)
            .replace("@@_ENUMS_@@", enums)
            .replace("@@_RECORDS_@@", records);
          addVirtualImports(params, { name, imports: { "pocketbase:astro": content } });

          addMiddleware({ entrypoint: resolve("../assets/middleware.ts"), order: "pre" });
        },

        "astro:config:done": ({ injectTypes }) => {
          const stub = readFileSync(resolve("../assets/stubs/types.d.ts"), "utf-8");
          const { collectionNames, collectionsUnion, enums, records, services } = stringifyTypes(collections, options);
          const content = stub
            .replaceAll("@@_COLLECTION_NAMES_@@", collectionNames)
            .replace("@@_COLLECTIONS_UNION_@@", collectionsUnion)
            .replace("@@_ENUMS_@@", enums)
            .replace("@@_RECORDS_@@", records)
            .replace("@@_SERVICES_@@", services);
          injectTypes({ filename: "types.d.ts", content: content });

          const envContent = readFileSync(resolve("../assets/env.d.ts"), "utf-8");
          injectTypes({ filename: "env.d.ts", content: envContent });
        },
      },
    };
  },
});
