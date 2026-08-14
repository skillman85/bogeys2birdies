# PrecisionGolf live season sync

On round completion, PrecisionGolf sends its complete version 1 season export to `POST https://www.bogeys2birdies.co.uk/api/precision-golf/sync` with a short-lived Firebase ID token in the `Authorization: Bearer` header.

Add `FIREBASE_PROJECT_ID=precision-golf-fc3bd` and the permitted Firebase Authentication UID as `PRECISION_GOLF_SYNC_ALLOWED_UID` in Vercel. Multiple UIDs may be comma-separated. The server verifies Google's signature, token claims, and UID before updating Sanity. No permanent sync secret is stored in the app.

HTTP 200 means Sanity was updated and `/` plus `/data` were refreshed. The app retains a failed snapshot and retries it later. The maximum payload is 2 MB.
