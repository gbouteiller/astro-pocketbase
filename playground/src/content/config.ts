import { defineCollection } from "astro:content";
import { pocketbaseLoader } from "../lib/pocketbase/loader";
import { ConfigRecord, ImagesRecord, KnowledgesRecord, PostsRecord } from "../lib/pocketbase/schemas";

const config = defineCollection({
  loader: pocketbaseLoader({ collection: "config" }),
  schema: ConfigRecord,
});

const images = defineCollection({
  loader: pocketbaseLoader({ collection: "images" }),
  schema: ImagesRecord,
});

const knowledges = defineCollection({
  loader: pocketbaseLoader({ collection: "knowledges" }),
  schema: KnowledgesRecord,
});

const posts = defineCollection({
  loader: pocketbaseLoader({ collection: "posts" }),
  schema: PostsRecord,
});

export const collections = { config, images, knowledges, posts };
