import { defineCollection } from "astro:content";
import { pocketbaseLoader } from "pocketbase:astro";

const config = defineCollection({
	loader: pocketbaseLoader({ collection: "config" }),
});

export const collections = { config };
