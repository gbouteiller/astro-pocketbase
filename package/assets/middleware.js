import { defineMiddleware } from "astro:middleware";
import PocketBase from "pocketbase";

export const onRequest = defineMiddleware((context, next) => {
  context.locals.pocketbase = new PocketBase(import.meta.env.PUBLIC_ASTRO_POCKETBASE_URL);
  return next();
});
