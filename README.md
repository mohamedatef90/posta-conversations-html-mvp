# Posta Conversations HTML MVP

Static no-framework prototype for Posta Mail / Posta Conversations: a dual-mode mailbox (Classic three-pane mail and Chat conversations over the same simulated Exchange data), built to demo the product to stakeholders. Everything is simulated: there is no backend, no real email, and no build step.

## Run

From the repository folder:

```bash
python -m http.server 5173
```

Open:

```text
http://127.0.0.1:5173/
```

## v0.4 — Landing, Onboarding, Presenter Mode

### What's new

- **Landing/cover screen**: Premium dark landing page with product positioning, "Start guided demo" and "Sign in" CTAs
- **Onboarding sequence**: 3-step compact onboarding after sign-in (identity verified, choose workflow, data stays synced), skippable
- **Presenter mode**: Topbar toggle puts app in clean presentation state with pitch/reset controls
- **One-click pitch flow**: From landing or presenter bar, starts demo story at step 1 with correct thread selected
- **Failed send/retry**: Demo step 5 shows failed message banner with Retry button that resolves to success toast
- **Attachment preview modal**: Clicking attachment chips opens polished preview with file type, size, and prototype note

### Demo flow for stakeholders

1. Open app — see landing page with product positioning
2. Click "Start guided demo" — skips auth, enters app with demo panel open
3. Navigate 5-step story with Next/Back or arrow keys
4. Step 5 shows offline + failed send state; click Retry to see recovery
5. Click any attachment chip to see preview modal
6. Use Presenter toggle for cleaner presentation mode
7. Use "Reset demo" in presenter bar to return to landing

### Presenter mode controls

- **Presenter button** in topbar toggles presenter mode
- **Start pitch** button begins demo from step 1
- **Reset demo** clears onboarding and returns to landing page

### Keyboard shortcuts (in demo)

- `←` `→` — navigate steps
- `Esc` — exit demo

## v0.3 — Guided Demo Story

### Features

- **Start demo** button in topbar after onboarding
- 5-step guided story for stakeholder presentations:
  1. Executive overview: same mailbox, two modes
  2. Omar's Classic workflow: priority inbox, reading pane, compose
  3. Mode switching: same thread becomes conversation
  4. Sara's Chat workflow: quick reply, attachments, open in Classic
  5. Resilience states: offline banner, failed sends, retry
- Demo panel with progress pills, Next/Back/End controls
- Keyboard navigation
- Each step updates app state (mode, selected thread, offline, failed send)
- Projector-friendly: compact pitch cards, not blocking modals

## Files

- `index.html`: page markup
- `app.js`: the whole application (one `state` object and a `render()` function)
- `data.js`: the simulated dataset (`window.POSTA_DATA`)
- `styles.css`: all styling
- `storage-*.json`: browser storage-state files (localStorage presets for onboarding, mode, and demo step)
- `assets/`: Posta Gate design-system and icon reference pages
- `vendor/fontawesome/`: bundled Font Awesome

There is no package.json, lint, or test suite; edit a file and reload the browser.

## Scope

- Landing/cover screen with CTAs
- Fake AD/Entra login flow
- MFA state
- Profile confirmation
- Onboarding sequence (3 steps)
- Mode selection
- Premium Classic Mail mode
- Chat Conversation mode
- Compose / quick reply simulation
- Search, settings, notifications, offline state
- Failed send/retry state
- Attachment preview modal
- Presenter mode with pitch/reset controls
- Guided demo story mode
- Fake enterprise mailbox data

No framework, no build step.
