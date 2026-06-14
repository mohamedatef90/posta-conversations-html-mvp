# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-framework, no-build prototype of "Posta Mail" — a dual-mode enterprise mailbox (Classic 3-pane mail + Chat conversations over the same fake Exchange data). It exists to pitch the product to stakeholders, so it includes a fake AD/Entra login flow, onboarding, a guided demo story, and a presenter mode. Everything is simulated; no backend, no real email.

## Run

```bash
python -m http.server 5173
# open http://127.0.0.1:5173/
```

There is no package.json, build step, lint, or test suite. Edit a file and reload the browser.

## Architecture

Three source files do all the work:

- **`data.js`** — assigns the entire fake dataset to the `window.POSTA_DATA` global (profile, contacts, folders, threads with nested messages/attachments, notifications). `app.js` reads it as `const D = window.POSTA_DATA`. There are no IDs generated at runtime; threads/contacts are referenced by string id (e.g. `t.contact === 'sara'`).
- **`app.js`** — the whole application: one mutable `state` object + a `render()` function.
- **`styles.css`** — all styling.

### The render model (important)

It is a hand-rolled single-page app with **no virtual DOM and no component framework**:

- A single global `state` object holds everything (current screen, mode, selected thread, overlay, demo step, etc.).
- `render()` looks at `state.screen` and replaces `#app`'s `innerHTML` wholesale with a template string produced by the matching `renderX()` function (`renderLanding`, `renderLogin`, `renderMfa`, `renderProfile`, `renderOnboarding`, `renderModeSelect`, `renderApp`).
- `set(patch)` is the canonical update path: `Object.assign(state, patch); render()`. Prefer it over mutating `state` directly when you want a re-render.
- Because the DOM is rebuilt every render, **event handlers must be reattached after every render**. Two patterns are used, and new code should match whichever is local:
  1. `bindShell()` / `bindDemoControls()` etc. query elements and assign `.onclick` after render.
  2. List items rebind themselves via `setTimeout(() => document.querySelectorAll(...).forEach(...), 0)` from inside the function that emits their markup (see `mailCard`/`readingPane`, `conv`).
  3. Inline `onclick="..."` attributes that call global functions or mutate `state` directly then call `render()` (e.g. toolbar buttons, modals). These rely on the functions/`state` being globals.

### Screen flow

`landing → login → mfa → profile → onboarding → mode → app`. The first screen is `app` if `localStorage['posta:onboarded']` is set, otherwise `landing`. The `app` screen renders either `classic()` (3-pane: folders / mail list / reading pane) or `chat()` based on `state.mode`, both wrapped by `shell()` (topbar, offline banner, failed-send banner, compose, overlays, demo panel).

### Persisted state (localStorage keys)

`posta:onboarded`, `posta:mode` (`classic`|`chat`), `posta:demo` (`open`), `posta:demoStep`, `posta:demoMode`, `posta:presenter`. `syncDemoStorage()` keeps the demo keys in step with `state`. `resetDemo()` clears onboarding/demo keys and returns to landing.

### Demo & presenter mode

The stakeholder pitch is a 5-step story defined in the `DEMO_STEPS` array; each step has an `action()` that mutates `state` (mode, selected thread, offline, failed-send) to stage the UI. The demo panel (`demoPanel()`) drives it with Next/Back/pills and arrow-key/Esc shortcuts (`bindDemoControls`). Presenter mode adds a top bar with pitch/reset controls.

## Working in this codebase

- To add or change demo content, edit the data in `data.js` and the narrative in `DEMO_STEPS`; do not hardcode copy into the renderers where it belongs in data.
- When adding interactive elements, remember the re-render erases listeners — wire them up in the appropriate `bind*` step or via inline `onclick`, matching the surrounding style.
- `storage-*.json` are Playwright `storageState` files used to launch the browser straight into a specific state (classic, chat, demo, demo step 5, presenter) without clicking through onboarding. Note their `origin` is `http://127.0.0.1:5199`, not the `5173` used in the run command — match the port to the storage file if you use them.
</content>
</invoke>
