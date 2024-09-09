import { defineMiddleware } from "astro:middleware";
import PocketBase from "pocketbase";
import type { AstroPocketbase } from "pocketbase:astro";

export const onRequest = defineMiddleware((context, next) => {
	context.locals.pocketbase = new PocketBase(import.meta.env.PUBLIC_ASTRO_POCKETBASE_URL) as AstroPocketbase;
	return next();
});
