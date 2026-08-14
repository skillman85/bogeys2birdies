import Link from 'next/link';
import { Page } from '../components/SiteChrome';
import { ArticleCard, Chevron, ExperimentCard, Eyebrow, Newsletter, Stat } from '../components/UI';
import { defaultHomeContent, formatArticleMeta } from '../content/defaults';
import { getHomeContent } from '../sanity/lib/content';
import { imageUrl } from '../sanity/lib/image';
import { metadataFrom } from '../sanity/lib/metadata';

export async function generateMetadata() {
  const content = await getHomeContent(defaultHomeContent);
  return metadataFrom(content.settings, { title: defaultHomeContent.site.siteTitle, description: defaultHomeContent.site.siteDescription });
}

export default async function Home() {
  const content = await getHomeContent(defaultHomeContent);
  const settings = { ...defaultHomeContent.settings, ...content.settings };
  const experiments = settings.featuredExperiments?.length ? settings.featuredExperiments : (content.experiments?.length ? content.experiments : defaultHomeContent.experiments);
  const articles = settings.featuredArticles?.length ? settings.featuredArticles : (content.articles?.length ? content.articles : defaultHomeContent.articles);
  return <Page siteSettings={content.site || defaultHomeContent.site}>
    <main>
      <section className="hero">
        <div className="hero-bg" style={{backgroundImage:`linear-gradient(90deg,rgba(8,17,11,.88) 0%,rgba(8,17,11,.58) 45%,rgba(8,17,11,.15) 100%),url(${imageUrl(settings.heroImage, defaultHomeContent.settings.heroImage)})`}} />
        <div className="hero-inner"><Eyebrow>{settings.heroEyebrow}</Eyebrow><h1>{settings.heroTitleLineOne}<br/><em>{settings.heroTitleLineTwo}</em></h1><p>{settings.heroDescription}</p>
        <div className="hero-actions"><Link className="btn primary" href={settings.heroPrimaryCtaHref}>{settings.heroPrimaryCtaLabel}</Link><Link className="btn ghost" href={settings.heroSecondaryCtaHref}>{settings.heroSecondaryCtaLabel}</Link></div>
        <div className="hero-note">CURRENT HANDICAP <strong>{settings.currentHandicap}</strong> <span>→</span> TARGET <strong>{settings.targetHandicap}</strong></div></div>
      </section>

      <section className="road section-shell">
        <div className="section-heading split"><div><Eyebrow>{settings.roadEyebrow}</Eyebrow><h2>{settings.roadHeading}</h2></div><p>{settings.roadDescription}</p></div>
        <div className="progress-panel">
          <div className="progress-main"><div className="progress-head"><span>HANDICAP INDEX</span><strong>{settings.currentHandicap} <small>→ {settings.targetHandicap}</small></strong></div><div className="progress-track"><span style={{width:`${settings.progressPercent}%`}} /></div><div className="progress-scale"><span>10.0</span><span>7.5</span><span>{settings.targetHandicap}</span></div></div>
          <div className="stats-grid">{settings.stats.map((stat) => <Stat key={stat.label} {...stat}/>)}</div>
        </div>
        <Link className="big-link" href="/data">See every number behind the project <Chevron /></Link>
      </section>

      <section className="experiments dark-section">
        <div className="section-shell"><div className="section-heading split light"><div><Eyebrow>{settings.experimentsEyebrow}</Eyebrow><h2>{settings.experimentsHeading.split('\n').map((line, index) => <span key={line}>{index > 0 && <br/>}{line}</span>)}</h2></div><p>{settings.experimentsDescription}</p></div>
        <div className="story-grid">
          {experiments.map((item) => <ExperimentCard key={item._id || item.slug} {...item} title={item.homeTitle || item.title} summary={item.homeSummary || item.summary} image={imageUrl(item.coverImage)} href={`/experiments/${item.slug}`}/>)}
        </div>
        <Link className="big-link inverse" href="/experiments">View all experiments <Chevron /></Link></div>
      </section>

      <section className="manifesto section-shell"><div className="manifesto-mark">“</div><blockquote>{settings.manifestoHeading}<br/><em>{settings.manifestoEmphasis}</em></blockquote><p>{settings.manifestoDescription}</p></section>

      <section className="latest section-shell"><div className="section-heading split"><div><Eyebrow>{settings.journalEyebrow}</Eyebrow><h2>{settings.journalHeading}</h2></div><Link href="/journal" className="text-link">View the journal <Chevron /></Link></div>
        <div className="article-grid">{articles.map((item) => <ArticleCard key={item._id || item.slug} category={item.homeCategory || item.category} title={item.homeTitle || item.title} meta={item.homeMeta || formatArticleMeta(item)} image={imageUrl(item.homeImage || item.coverImage)} href={`/journal/${item.slug}`}/>)}</div>
      </section>

      <Newsletter settings={settings}/>
    </main>
  </Page>
}
