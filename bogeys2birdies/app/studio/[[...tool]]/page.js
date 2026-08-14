'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';
import { isSanityConfigured } from '../../../sanity/env';

export default function StudioPage() {
  if (!isSanityConfigured) return <main style={{ padding: 40, fontFamily: 'sans-serif' }}>Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to open Sanity Studio.</main>;
  return <NextStudio config={config} />;
}
