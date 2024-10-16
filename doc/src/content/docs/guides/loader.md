---
title: Loader
description: Astro PocketBase gives you access to a loader for your collections
---

```ts title="src/content/config.ts"
import { pocketbaseLoader } from "./src/lib/pocketbase/loader";
import { PostsRecord } from "./src/lib/pocketbase/schemas";

const posts = defineCollection({
  loader: pocketbaseLoader({ collection: "posts" }),
  schema: PostsRecord,
});

export const collections = { posts };
```
