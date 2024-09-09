# `astro-pocketbase`

This is an [Astro integration](https://docs.astro.build/en/guides/integrations-guide/) that ease the use of Pocketbase in your Astro projects

## Usage

### Prerequisites

None

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-pocketbase
```

```bash
npx astro add astro-pocketbase
```

```bash
yarn astro add astro-pocketbase
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-pocketbase
```

```bash
npm install astro-pocketbase
```

```bash
yarn add astro-pocketbase
```

2. Add the integration to your astro config

```diff
+import pocketbase from "astro-pocketbase";

export default defineConfig({
  integrations: [
+    pocketbase(),
  ],
});
```

### Configuration

None

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/gbouteiller/astro-pocketbase/blob/main/LICENSE). Made with ❤️ by [Gregory Bouteiller](https://github.com/gbouteiller).

## Acknowledgements

- [`astro-integration-kit`](https://github.com/florian-lefebvre/astro-integration-kit) by Florian Lefebvre
- [`pocketbase`](https://github.com/pocketbase/js-sdk) by Gani Georgiev