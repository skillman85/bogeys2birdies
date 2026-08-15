import { Page } from '../../components/SiteChrome'; import { ExperimentCard, PageHero } from '../../components/UI';
import { defaultExperiments, defaultPageSettings, defaultSiteSettings } from '../../content/defaults';
import { getExperiments, getPageSettings, getSiteSettings } from '../../sanity/lib/content'; import { imageUrl } from '../../sanity/lib/image';
import { metadataFrom } from '../../sanity/lib/metadata';
export async function generateMetadata(){const page=await getPageSettings('experiments',defaultPageSettings.experiments);return metadataFrom(page);}
export default async function Experiments(){const [items,site,page]=await Promise.all([getExperiments(defaultExperiments),getSiteSettings(defaultSiteSettings),getPageSettings('experiments',defaultPageSettings.experiments)]);return <Page siteSettings={site}><main className="inner-page"><PageHero page={page}/><section className="section-shell"><div className="story-grid light-cards">{items.map((item)=><ExperimentCard key={item._id||item.slug} {...item} image={imageUrl(item.coverImage)} href={`/experiments/${item.slug}`}/>)}</div></section></main></Page>}
