import { notFound } from 'next/navigation';
import { ContentDetail } from '../../../components/ContentDetail';
import { defaultSiteSettings } from '../../../content/defaults';
import { getContentDetail, getSiteSettings } from '../../../sanity/lib/content';
import { metadataFrom } from '../../../sanity/lib/metadata';

export async function generateMetadata({ params }) { const { slug } = await params; const item = await getContentDetail('experiment', slug); return item ? metadataFrom(item, { title: item.title, description: item.summary }) : {}; }
export default async function Experiment({ params }) { const { slug } = await params; const [item, site] = await Promise.all([getContentDetail('experiment', slug), getSiteSettings(defaultSiteSettings)]); if (!item) notFound(); return <ContentDetail item={item} site={site || defaultSiteSettings} eyebrow={item.tag || 'Experiment'} meta={item.result && `Result: ${item.result}`}>{(item.claim || item.method) && <div className="content-detail-facts">{item.claim && <div><strong>Claim</strong><p>{item.claim}</p></div>}{item.method && <div><strong>Method</strong><p>{item.method}</p></div>}</div>}</ContentDetail>; }
