# PrecisionGolf live season sync

On round completion, send the complete version 1 season export to `POST https://www.bogeys2birdies.co.uk/api/precision-golf/sync` with `Authorization: Bearer <PRECISION_GOLF_SYNC_SECRET>` and `Content-Type: application/json`.

Add a random secret of at least 32 bytes to Vercel as `PRECISION_GOLF_SYNC_SECRET` for Production and Preview. Store the matching value only in the mobile app's Keychain or operating-system secure storage. Never include `SANITY_WRITE_TOKEN` in the app.

HTTP 200 means Sanity was updated and `/` plus `/data` were refreshed. Retain failed syncs and retry later with capped exponential backoff. The maximum payload is 2 MB.
