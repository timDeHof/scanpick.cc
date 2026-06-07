// Minimal Worker entry point for Workers + Static Assets.
// Static assets (Vite SPA build output) are served automatically
// via the ASSETS binding. SPA client-side routing is handled
// by the `not_found_handling: "single-page-application"` config.
export default {
  fetch(request, env, ctx) {
    return env.ASSETS.fetch(request);
  },
};
