import { notFound } from 'next/navigation';
import { ContentDetail } from '../../../components/ContentDetail';
import { defaultSiteSettings, formatArticleMeta } from '../../../content/defaults';
import { getContentDetail, getSiteSettings } from '../../../sanity/lib/content';
import { metadataFrom } from '../../../sanity/lib/metadata';

export async function generateMetadata({ params }) { const { slug } = await params; const item = await getContentDetail('article', slug); return item ? metadataFrom(item, { title: item.title, description: item.summary }) : {}; }
export default async function Article({ params }) { const { slug } = await params; const [item, site] = await Promise.all([getContentDetail('article', slug), getSiteSettings(defaultSiteSettings)]); if (!item) notFound(); return <ContentDetail item={item} site={site || defaultSiteSettings} eyebrow={item.category || 'Journal'} meta={formatArticleMeta(item)} />; }
