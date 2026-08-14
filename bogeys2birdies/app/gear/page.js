import { Page } from '../../components/SiteChrome'; import { ArticleCard, Eyebrow } from '../../components/UI';
import { defaultGearReviews, defaultPageSettings, defaultSiteSettings } from '../../content/defaults';
import { getGearReviews, getPageSettings, getSiteSettings } from '../../sanity/lib/content'; import { imageUrl } from '../../sanity/lib/image';
import { metadataFrom } from '../../sanity/lib/metadata';
export async function generateMetadata(){const page=await getPageSettings('gear',defaultPageSettings.gear);return metadataFrom(page);}
export default async function Gear(){const [items,site,page]=await Promise.all([getGearReviews(defaultGearReviews),getSiteSettings(defaultSiteSettings),getPageSettings('gear',defaultPageSettings.gear)]);return <Page siteSettings={site}><main className="inner-page"><section className="page-hero"><Eyebrow>{page.eyebrow}</Eyebrow><h1>{page.title}</h1><p>{page.description}</p></section><section className="section-shell"><div className="article-grid">{items.map((item)=><ArticleCard key={item._id||item.slug} category={item.category} title={item.title} meta={item.testDetails} image={imageUrl(item.coverImage)}/>)}</div></section></main></Page>}
