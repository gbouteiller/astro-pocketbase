---
title: Middleware
description: Astro PocketBase gives you access to the sdk via a middleware 
---

```astro title="src/page/index.astro"
---
const posts = Astro.locals.pocketbase.collection("posts").getFullList()
---

{posts.map((post) => <PostItem {post} />)}
```
