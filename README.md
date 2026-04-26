# meridian-os

A multi-role medical-care-delivery operating system. Workspace-based front-end
with a cell/bubble UI metaphor (Apple Glass / Tony Stark "windows of windows").

This is **not** `meridian-onboarding` — that is a separate, frozen demo of the
onboarding loop. meridian-os seeds from meridian-onboarding's content but
rebuilds the architecture around bubbles, cells, workspaces, and a home screen.

## Stack

- Vite + Preact + TypeScript + `@preact/signals`
- Static SPA on Cloudflare Pages
- Vanilla JS for mechanics (FLIP transitions, resize controller)

## Develop

```bash
npm install
npm run dev          # vite dev server
npm run build        # tsc -b && vite build
```

## Deploy

```bash
./deploy.sh          # build + wrangler pages deploy dist
```

## Layout

```
src/
  shell/      HomeScreen, WorkspaceShell, TransitionStage
  cell/       Cell (chat nucleus + organelles), BrainBubble, ChatBubble
  bubbles/    24 typed primitives (Phase 0: all stubbed)
  mechanics/  flip, resize, snap, attach, drag, search
  orchestration/ DemoScript, HydrationBus, MockServices
  data/       home.json, workspaces/*, seed/*, demo-script.json
  styles/     tokens, glass, reset
  types.ts
```

See `~/.claude/plans/hello-thank-you-for-federated-petal.md` for the full v1 plan.
