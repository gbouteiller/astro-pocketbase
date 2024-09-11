---
title: Loader
description: Astro PocketBase gives you access to a loader for your collections
---

```ts title="src/content/config.ts"
import { pocketbaseLoader, PostsModel } from "pocketbase:astro";

const posts = defineCollection({
  loader: pocketbaseLoader({ collection: "posts" }),
  schema: PostsModel,
});

export const collections = { posts };
```
