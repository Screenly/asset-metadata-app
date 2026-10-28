[![Version](https://img.shields.io/github/v/release/Screenly/asset-metadata-app)](https://github.com/Screenly/asset-metadata-app/releases/latest)

# Asset Metadata

![Asset Metadata Preview](/screenshots/1920x1080.webp)

Displays screen metadata on Screenly digital signage players, including hostname, screen name, hardware type, firmware version, GPS coordinates, and assigned labels.

## Getting Started

```bash
bun install
```

## Development

```bash
bun run dev
```

## Building

```bash
bun run build
```

## Testing

```bash
bun run test
```

## Linting & Formatting

```bash
bun run lint
bun run format
```

## Deployment

Create and deploy the Edge App:

```bash
screenly edge-app create --name asset-metadata --in-place
bun run deploy
screenly edge-app instance create
```

### Releasing

Pushes to `main` start a stage deploy, which waits for approval. To release to production, tag a commit on `main` and push the tag (the workflow refuses tags not on `main`); the production deploy also waits for approval:

```bash
git checkout main && git pull
git tag v26.10.0
git push origin v26.10.0
```

Then publish a GitHub Release whose notes list the pull requests merged since the previous release. Add `--draft` to review the notes before publishing:

```bash
gh release create v26.10.0 --verify-tag --generate-notes --title v26.10.0
```

## Screenshots

Generate screenshots at all supported resolutions:

```bash
bun run screenshots
```

Screenshots are saved to the `screenshots/` directory.

## Configuration

| Setting          | Description                            | Type     | Default |
| ---------------- | -------------------------------------- | -------- | ------- |
| `display_errors` | Display errors on screen for debugging | optional | `false` |
