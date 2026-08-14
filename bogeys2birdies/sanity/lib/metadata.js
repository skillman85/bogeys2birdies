export function metadataFrom(settings, fallback = {}) {
  return {
    title: settings?.seo?.metaTitle || fallback.title,
    description: settings?.seo?.metaDescription || settings?.description || fallback.description,
  };
}
