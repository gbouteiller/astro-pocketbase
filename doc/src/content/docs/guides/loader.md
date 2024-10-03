---
title: Loader
description: Astro PocketBase gives you access to a loader for your collections
---

```ts title="src/content/config.ts"
import { pocketbaseLoader, PostsRecord } from "pocketbase:astro";

const posts = defineCollection({
  loader: pocketbaseLoader({ collection: "posts" }),
  schema: PostsRecord,
});

export const collections = { posts };
```
