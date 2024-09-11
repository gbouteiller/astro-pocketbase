import { defineCollection } from "astro:content";
import { ConfigModel, ImagesModel, KnowledgesModel } from "pocketbase:astro";
import { pocketbaseLoader } from "../lib";

const config = defineCollection({
  loader: pocketbaseLoader({ collection: "config" }),
  schema: ConfigModel,
});

const images = defineCollection({
  loader: pocketbaseLoader({ collection: "images" }),
  schema: ImagesModel,
});

const knowledges = defineCollection({
  loader: pocketbaseLoader({ collection: "knowledges" }),
  schema: KnowledgesModel,
});

export const collections = { config, images, knowledges };
