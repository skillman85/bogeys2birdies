import { notFound } from 'next/navigation';
import { ContentDetail } from '../../../components/ContentDetail';
import { defaultSiteSettings } from '../../../content/defaults';
import { getContentDetail, getSiteSettings } from '../../../sanity/lib/content';
import { metadataFrom } from '../../../sanity/lib/metadata';

export async function generateMetadata({ params }) { const { slug } = await params; const item = await getContentDetail('gearReview', slug); return item ? metadataFrom(item, { title: item.title, description: item.summary }) : {}; }
export default async function GearReview({ params }) { const { slug } = await params; const [item, site] = await Promise.all([getContentDetail('gearReview', slug), getSiteSettings(defaultSiteSettings)]); if (!item) notFound(); const meta = [item.testDetails, item.rating != null && `${item.rating}/10`].filter(Boolean).join(' · '); return <ContentDetail item={item} site={site || defaultSiteSettings} eyebrow={item.category || 'Gear review'} meta={meta}>{item.verdict && <div className="content-detail-verdict"><strong>Verdict</strong><p>{item.verdict}</p></div>}</ContentDetail>; }
