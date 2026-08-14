# AI content workflow

This project includes a server-only Sanity content CLI for Codex. It manages content without changing React files or opening Studio.

## Security rules

- Use Node.js 22.12 or newer.
- Store credentials only in `.env.local`. This file and all `.env.*` files are ignored by Git except `.env.example`.
- The write token must be named `SANITY_API_WRITE_TOKEN`. Never use a `NEXT_PUBLIC_` prefix for it.
- Never place the token in a command, JSON request, log, screenshot, source file, or chat response.
- Give the token the minimum Sanity role needed to create and edit documents in the `production` dataset.
- Content is created as a draft. Publish only when the user explicitly asks to publish.
- Treat delete as destructive. Confirm the exact type and slug with the user before running it. The command additionally requires `--confirm`.
- Prefer unpublishing when the user wants content removed from the website but may want to restore it later.
- Do not modify `_id`, `_type`, `_rev`, or other Sanity system fields through request JSON.

Required `.env.local` values:

```env
SANITY_PROJECT_ID=kfysb6ye
SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=replace-with-a-server-only-write-token
```

The public frontend variables remain separate. The server-only script imports `@sanity/client` directly and is never bundled into the browser.

## How Codex should operate

1. Translate the user's natural-language request into a small JSON request file. Use a temporary location or the ignored `content-requests/` directory.
2. Review the target document type, slug, fields, and requested publication state.
3. Run the matching command below.
4. Read the JSON result and report the document ID and status.
5. Leave new or updated content as a draft unless the user explicitly requested publication.
6. Remove temporary request files after the task when safe to do so.

Commands must be run from the project directory. On this machine, prepend the bundled modern Node runtime if the system Node is still v20.17:

```powershell
$env:Path = "C:\Users\James Hillman\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;$env:Path"
```

## Create an article draft

Request JSON:

```json
{
  "title": "What I learned from ten wet-weather rounds",
  "slug": "ten-wet-weather-rounds",
  "summary": "A practical review of scoring and club selection in wet conditions.",
  "category": "Round journal",
  "readingTime": 6,
  "publishedAt": "2026-08-14T10:00:00Z",
  "coverImageAssetId": "image-asset-id"
}
```

```powershell
npm run content:create-article -- content-requests/article.json
```

The slug is generated from the title when omitted. The new document ID begins with `drafts.`.

## Update existing content

Updates always target a draft. If only a published version exists, the script creates a draft copy first, leaving the live version unchanged.

```powershell
npm run content:update-article -- existing-slug content-requests/article-update.json
npm run content:update-experiment -- existing-slug content-requests/experiment-update.json
npm run content:update-gear-review -- existing-slug content-requests/gear-update.json
```

Only include fields that should change. Slugs are intentionally immutable in update commands so document IDs and links remain stable.

## Create an experiment draft

```json
{
  "title": "Three-quarter wedges for five rounds",
  "summary": "Testing whether controlled wedge swings improve proximity.",
  "number": "04",
  "tag": "Approach play",
  "result": "IN PROGRESS",
  "claim": "Shorter swings improve strike consistency.",
  "method": "Track every wedge approach over five rounds.",
  "coverImageAssetId": "image-asset-id"
}
```

```powershell
npm run content:create-experiment -- content-requests/experiment.json
```

## Create a gear-review draft

```json
{
  "title": "Rangefinder versus GPS watch",
  "summary": "A five-round comparison of speed, confidence and club selection.",
  "category": "Technology",
  "testDetails": "Five rounds on three courses",
  "verdict": "Draft verdict pending final round.",
  "rating": 8,
  "coverImageAssetId": "image-asset-id"
}
```

```powershell
npm run content:create-gear-review -- content-requests/gear-review.json
```

## Update settings and featured content

This command safely routes handicap and featured fields to `homepageSettings`, and global metadata fields to `siteSettings`.

```json
{
  "currentHandicap": "8.4",
  "targetHandicap": "5.0",
  "progressPercent": 51,
  "featuredArticleSlugs": ["what-shooting-78-felt-like"],
  "featuredExperimentSlugs": ["centre-green-for-10-rounds"]
}
```

```powershell
npm run content:update-settings -- content-requests/settings.json
```

Featured documents must already be published. Each featured list accepts at most three slugs.

## Update an existing page

Editable page keys are `project`, `data`, `journal`, `experiments`, and `gear`. Only include fields that should change:

```json
{
  "title": "Can an ordinary club golfer reach a 5 handicap?",
  "description": "Updated page introduction.",
  "secondaryHeading": "No shortcuts. Just better decisions."
}
```

```powershell
npm run content:update-page -- project content-requests/project-page.json
```

Page settings are singleton documents and update immediately. Codex must confirm the page key and summarize the fields being changed before running the command.

## Publish a draft

Publishing is explicit and fails if required fields or the cover image are missing.

```powershell
npm run content:publish -- article article-slug
npm run content:publish -- experiment experiment-slug
npm run content:publish -- gearReview gear-review-slug
```

## Unpublish content

Unpublishing removes the published document while retaining a draft copy:

```powershell
npm run content:unpublish -- article article-slug
```

## Delete content

Deletion removes both draft and published versions and cannot be undone through this script. Use only after explicit user confirmation:

```powershell
npm run content:delete -- article article-slug --confirm
```

Valid type values for publish, unpublish, and delete are `article`, `experiment`, and `gearReview`.

## Image handling

Creation accepts an existing Sanity image asset document ID in `coverImageAssetId`. A draft may be created without an image, but publishing will fail until a cover image is attached through an update request or Studio. This avoids arbitrary remote downloads and keeps asset uploads intentional.
