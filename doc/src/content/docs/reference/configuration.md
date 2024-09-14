---
title: Configuration Reference
description: Astro Pocketbase gives you options
---

The following reference covers all supported configuration options for Astro PocketBase.

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import pocketbase from "astro-pocketbase";

export default defineConfig({
  // ...
  integrations: [
    pocketbase({
      // Your configuration options here...
    })
  ],
});
```

## cacheDuration

- **Type:** `string`
- **Default:** `1d`

After this amount of time has passed, we’ll make a new network request to the URL to fetch fresh data.

The `cacheDuration` option supports the following shorthand values:

- `s` is seconds (e.g. `cacheDuration: "43s"`)
- `m` is minutes (e.g. `cacheDuration: "2m"`)
- `h` is hours (e.g. `cacheDuration: "99h"`)
- `d` is days (the default is `cacheDuration: "1d"`)
- `w` is weeks, or shorthand for 7 days (e.g. `cacheDuration: "2w"` is 14 days)
- `y` is years, or shorthand for 365 days (not exactly one year) (e.g. `cacheDuration: "2y"` is 730 days)

Here are a few more values you can use:

- `cacheDuration: "*"` will *never* fetch new data (after the first success).
- `cacheDuration: "0s"` will *always* fetch new data.

## ignore

- **Type:** `string[]`
- **Default:** `[]`

The `ignore` option allows you to ignore specific collections from being processed.

## nameRecordSchema

- **Type:** `(collectionName: string) => string`
- **Default:** `(collectionName) => pascalName(collectionName) + "Model"`

## nameRecordType

- **Type:** `(collectionName: string) => string`
- **Default:** `(collectionName) => pascalName(collectionName) + "Model"`
