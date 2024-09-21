import { defineToolbarApp } from "astro/toolbar";

export default defineToolbarApp({
  init(_canvas, app, server) {
    let pending = false;

    // const button = document.querySelector("astro-dev-toolbar")?.shadowRoot.querySelector("button[data-app-id='astro-pocketbase']");

    app.onToggled(({ state }) => {
      if (!state) return;
      app.toggleNotification({ level: "error", state: true });
      if (pending) return;
      pending = true;
      server.send("astro-pocketbase:refresh", undefined);
    });
  },
});
