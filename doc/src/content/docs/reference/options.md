---
title: Options
description: Astro PocketBase gives you options
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

## ignore

- **Type:** `string[]`
- **Default:** `[]`

The `ignore` option allows you to ignore specific collections from being processed.

## nameEnum

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => snakeCase(enumFieldName).toUpperCase()`

## nameEnumField

- **Type:** `(collectionName: string, fieldName: string) => string`
- **Default:** `(collectionName, fieldName) => collectionName + pascalName(fieldName)`

## nameEnumSchema

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => pascalName(enumFieldName)`

## nameEnumType

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => pascalName(enumFieldName)`
  
## nameEnumValues

- **Type:** `(enumFieldName: string) => string`
- **Default:** `(enumFieldName) => enumFieldName + "Values"`

## nameRecordSchema

- **Type:** `(collectionName: string) => string`
- **Default:** `(collectionName) => pascalName(collectionName) + "Record"`

## nameRecordType

- **Type:** `(collectionName: string) => string`
- **Default:** `(collectionName) => pascalName(collectionName) + "Record"`
