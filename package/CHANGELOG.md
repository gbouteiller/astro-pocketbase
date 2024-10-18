# astro-pocketbase

## 0.10.0

### Minor Changes

- add zod-pocketbase to exports

## 0.9.0

### Minor Changes

- remove magic "pocketbase:astro" and generate schemas and loader directly in "src/lib/pocketbase"
- refactor with zod-pocketbase

## 0.8.0

### Minor Changes

- 0c3e99c: add type and function helpers

### Patch Changes

- 0c3e99c: change default naming from Model to Record as pocketbase calls it

## 0.7.0

### Minor Changes

- 23c9e7f: remove eleventy fetch in favoi of pocketbase sdk and refine the way content is updated

### Patch Changes

- 23c9e7f: secure toolbar app use in astro v4

## 0.6.1

### Patch Changes

- a981658: fix toolbar app that was called during routing with ClientRouter

## 0.6.0

### Minor Changes

- c1027d0: add cacheDir option for fetching

## 0.5.6

### Patch Changes

- 5e7a9ef: Fix empty relation case

## 0.5.5

### Patch Changes

- 98693e2: fix enum type

## 0.5.4

### Patch Changes

- f72ee99: refine select field schema with enum
- f72ee99: pass collection name to stringigyFieldSchema

## 0.5.3

### Patch Changes

- 88e1af6: fix enum property name

## 0.5.2

### Patch Changes

- fc843fe: fix options schema

## 0.5.1

### Patch Changes

- 8dbbc6c: fix enum naming function used

## 0.5.0

### Minor Changes

- fba429f: add naming enum options

## 0.4.0

### Minor Changes

- cee8216: add ignore option

## 0.3.1

### Patch Changes

- 756b35e: fix loader id for refreshContent

## 0.3.0

### Minor Changes

- 257edb1: add a dev toolbar app to clear cache and refresh collections

## 0.2.3

### Patch Changes

- 120e5f5: remove useless code
- 9b462a1: add RecordRef type

## 0.2.2

### Patch Changes

- 295f9ee: add Collection type

## 0.2.1

### Patch Changes

- aeeb739: add eleventy-fetch as peer dependency

## 0.2.0

### Minor Changes

- bfe58e2: replace pocketbase sdk in the loader by eleventy fetch to ease caching
- c993dff: add cache duration option and disable cache in production

### Patch Changes

- b05e991: change astro reference to zod transform
- b05e991: correct schema type for dates
- f91a9ae: use input instead of output schema types for pocketbase sdk type
- f7c285f: replace biome by eslint and prettier
- f91a9ae: replace zod date coercion by transform to respect pocketbase sdk types
- f1e177a: correct date schema

## 0.1.0

### Minor Changes

- df2b603: project initialisation
