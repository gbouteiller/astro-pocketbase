import astro from "eslint-plugin-astro";

export default [...astro.configs["flat/recommended"], ...astro.configs["flat/jsx-a11y-strict"]];
