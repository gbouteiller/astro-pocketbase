---
title: Zod PocketBase
description: Astro PocketBase guves you access to everything from Zod PocketBase
---

Astro PocketBase gives you access to everything from [Zod PocketBase](https://zod-pocketbase.vercel.app)

## Schemas Helpers

Instead of this:

```ts
import {AuthorRecord, ImageRecord, PostRecord} from "src/lib/pocketbase/schemas";

const Post = PostRecord.pick({ content: true, title: true, updated: true })
  .extend({
    expand: z.object({
      author: AuthorRecord.pick({ name: true })
        .extend({
          expand: z.object({
            image: ImageRecord.pick({ alt: true, src: true }),
          }),
        })
        .transform(({ expand, ...rest }) => ({ ...rest, ...expand })),
      image: ImageRecord.pick({ alt: true, src: true }),
    }),
  })
  .transform(({ expand, ...rest }) => ({ ...rest, ...expand }));
```

Write this:

```ts
import { select } from "astro-pocketbase";
import {AuthorRecord, ImageRecord, PostRecord} from "src/lib/pocketbase/schemas";

const Post = select(PostRecord, ["content", "title", "updated"], {
  author: select(AuthorRecord, ["name"], {
    image: select(ImageRecord, ["alt", "src"])
  }),
  image: select(ImageRecord, ["alt", "src"])
});
```

:::tip[What you get]

- `expand` properties from the PocketBase SDK are automatically transformed
- `pick` properties are simplified and easier to read

Discover [expand, pick and select helpers](https://zod-pocketbase.vercel.app/guides/schemas)
:::

## Fetch Helpers

Instead of this:

```ts
import { listOptionsFrom, select } from "astro-pocketbase";
import { AuthorRecord, PostRecord } from "src/lib/pocketbase/schemas";

const Post = select(PostRecord, ["content", "title"], {
  author: select(AuthorRecord, ["name"])
});

const options = listOptionsFrom(Post, { sort: "-updated" });

const unsafeData = await Astro.locals.pocketbase.collection("posts").getList(1, 10, options);
const firstPosts = Post.array().parse(unsafeData);
```

Write this:

```ts
import { helpersFrom, select } from "astro-pocketbase";
import { AuthorRecord, PostRecord } from "src/lib/pocketbase/schemas";


const { getRecords } = helpersFrom({ pocketbase: Astro.locals.pocketbase, cache: "1d" });

const Post = select(PostRecord, ["content", "title"], {
  author: select(AuthorRecord, ["name"])
});

const firstPosts = getRecords("posts", { perPage: 10, schema: Post, sort: "-updated" });
```

:::tip[What you get]

- data is automatically validated
- result can be cached for the specified period of time (here: 1 day)
- options are automatically formatted without the need of other helpers (here: `listOptionsFrom`)

Discover [fetch helpers](https://zod-pocketbase.vercel.app/guides/helpers)
:::
