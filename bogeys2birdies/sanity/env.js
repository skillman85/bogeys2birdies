export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-14';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
// The project ID is public by design. Keeping the production ID as a fallback
// prevents deployed pages from silently rendering hard-coded content when a
// hosting environment is missing the optional public variable.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kfysb6ye';
export const isSanityConfigured = Boolean(projectId && dataset);
