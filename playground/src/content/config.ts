import { defineCollection } from "astro:content";
import { ConfigModel, ImagesModel, KnowledgesModel, PostsModel } from "pocketbase:astro";
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

const posts = defineCollection({
  loader: pocketbaseLoader({ collection: "posts" }),
  schema: PostsModel,
});

export const collections = { config, images, knowledges, posts };
