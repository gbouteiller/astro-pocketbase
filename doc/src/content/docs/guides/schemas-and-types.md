---
title: Schemas and Types
description: Astro PocketBase generates schemas and types for your collections
---

Astro Pocketbase generates schemas and types for your collections

## Generic type

The [PocketBase SDK](https://github.com/pocketbase/js-sdk) provides a generic type for its collections called `RecordModel`:

```ts
interface BaseModel {
    [key: string]: any;
    id: string;
    created: string;
    updated: string;
}

interface RecordModel extends BaseModel {
    collectionId: string;
    collectionName: string;
    expand?: {
        [key: string]: any;
    };
}
```

## Generated types

Zod schemas and types are generated for you and available for each collection in `pocketbase:astro`:

```ts
import {PostsRecord} from "pocketbase:astro";
```

The default naming is based on the [PocketBase SDK](https://github.com/pocketbase/js-sdk) convention; so for a collection named `posts`
you will be given access to a `PostsRecord` schema and a `PostsRecord` type.

:::tip
You can customize the way your collection schemas and types are named by using the dedicated [integration options](/reference/configuration): `nameRecordSchema` and `nameRecordType`
:::
