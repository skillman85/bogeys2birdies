import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from './client';

const builder = client ? createImageUrlBuilder(client) : null;

export function imageUrl(source, fallback = '') {
  if (typeof source === 'string') return source;
  if (!source || !builder) return fallback;
  return builder.image(source).width(1800).auto('format').quality(85).url();
}
