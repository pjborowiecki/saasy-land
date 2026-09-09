# Landing page videos

This directory is a separate Remotion project. The app serves the rendered videos and posters from `public/motion/`; it does not import Remotion. The app's TypeScript and Vite checks exclude this directory.

Keep this source, its configuration and `package-lock.json` in Git. Keep the published `.webm` and `.webp` files in `../public/motion/` tracked too: deployments serve them without running a renderer. Local `node_modules/`, `build/`, `dist/`, `out/` and `.cache/` directories are ignored. The root ignore rules also cover secrets and editor files here.

The separate package keeps the renderer, browser types and Remotion-specific lint rules outside the Cloudflare application. It uses npm's lockfile independently of the app's Bun lockfile. CI checks and bundles this source when it or the shared locale configuration changes.

Composition IDs match their source filenames and the names passed to `ConceptLoop`.

| Composition     | Video dimensions | Duration | Poster frame |
| --------------- | ---------------- | -------- | ------------ |
| `app-tour`      | 1600 × 1000      | 10 s     | 0            |
| `cost-curve`    | 1200 × 440       | 8 s      | 200          |
| `merge-gate`    | 1200 × 440       | 8 s      | 212          |
| `locale-format` | 1200 × 440       | 8 s      | 200          |
| `scaffold-cli`  | 1200 × 440       | 8 s      | 400          |
| `coverage-run`  | 1200 × 520       | 11 s     | 570          |
| `page-designer` | 1600 × 1000      | 10 s     | 0            |
| `record-audit`  | 1200 × 440       | 8 s      | 60           |

## Editing

```sh
cd remotion
npm ci
npm run check
npm run dev
```

Studio uses port 3001 so it can run beside the app on port 3000. `npm run format` formats this project. `npm run bundle` checks the composition bundle and writes it to the ignored `build/` directory; it does not render the published videos.

Keep the colors in `src/theme.ts` aligned with the app's dark palette in `../src/presentation/styles/globals.css`. Each video's ground must match its surrounding surface. Font loading is limited to the Latin weights used here.

`locale-format` and `record-audit` read the website's supported locales from its i18n configuration. Keep displayed paths and commands accurate. Test status illustrations omit changing suite counts; check actual results with `bun run test:coverage` at the repository root.

Use frame-based animation. `app-tour` and `page-designer` start and finish on the same frame and use frame 0 as their poster. Other compositions fade to their background at both ends through `Plate`. The app keeps the poster visible for reduced motion and unsupported video formats.

## Rendering

From this directory:

```sh
npx remotion render locale-format out/locale-format.webm --codec=vp9 --crf=36
npx remotion still locale-format out/locale-format.png --frame=200
cwebp -q 90 out/locale-format.png -o out/locale-format.webp
```

Install the [WebP command-line tools](https://developers.google.com/speed/webp/docs/precompiled) for `cwebp`. Inspect the temporary video and poster, then copy both into `../public/motion/` with the same basename. Use CRF 38 for the two 1600 × 1000 compositions and CRF 36 for the remaining videos. All compositions use 60 fps.

Regenerate both the video and poster after changing any visible content. Verify product loops at frame 0 and their final frame before replacing existing assets.
