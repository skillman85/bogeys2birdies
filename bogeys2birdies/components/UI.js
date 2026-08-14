import Link from 'next/link';
import { slugifyCategory } from '../content/defaults';

export const Chevron = () => <span aria-hidden="true">↗</span>;

export function Eyebrow({ children }) { return <div className="eyebrow">{children}</div>; }

export function CategoryEyebrow({ category, categorySlug, href }) {
  const slug = categorySlug || slugifyCategory(category);
  if (!category || !slug) return null;
  if (href === false) return <Eyebrow>{category}</Eyebrow>;
  return <Link href={href || `/journal/category/${slug}`} className="eyebrow category-link">{category}</Link>;
}

export function Stat({ value, label, detail }) {
  return <div className="stat"><div className="stat-value">{value}</div><div className="stat-label">{label}</div>{detail && <div className="stat-detail">{detail}</div>}</div>;
}

export function ExperimentCard({ number, tag, title, summary, result, image, href='#' }) {
  return <article className="story-card">
    <Link href={href} aria-label={`Read ${title}`} className="card-image-link"><div className="story-image" style={{backgroundImage:`linear-gradient(180deg, rgba(11,19,14,.02), rgba(11,19,14,.5)), url(${image})`}}>
      <span className="number-pill">{number}</span><span className="result-pill">{result}</span>
    </div></Link>
    <div className="story-copy"><Eyebrow>{tag}</Eyebrow><h3>{title}</h3><p>{summary}</p><Link href={href} className="text-link">Read experiment <Chevron /></Link></div>
  </article>
}

export function ArticleCard({ category, categorySlug, categoryHref, title, meta, image, href, linkLabel = 'Read article' }) {
  return <article className="article-card">
    {href ? <Link href={href} aria-label={`${linkLabel}: ${title}`} className="card-image-link"><div className="article-image" style={{backgroundImage:`url(${image})`}} /></Link> : <div className="article-image" style={{backgroundImage:`url(${image})`}} />}
    <CategoryEyebrow category={category} categorySlug={categorySlug} href={categoryHref} /><h3>{title}</h3><p>{meta}</p>
    {href && <Link href={href} className="text-link">{linkLabel} <Chevron /></Link>}
  </article>
}

export function Newsletter({ settings = {} }) {
  return <section className="newsletter">
    <div><Eyebrow>B2B Dispatch</Eyebrow><h2>{settings.newsletterHeadingLineOne || 'One useful golf lesson.'}<br/>{settings.newsletterHeadingLineTwo || 'Every Friday.'}</h2></div>
    <div><p>{settings.newsletterDescription || 'No tour gossip. No miracle swing tips. Just what we tested, what changed and what might help your game.'}</p>
    <form><input type="email" placeholder="Your email address" aria-label="Email address"/><button type="button">Join the project</button></form><small>Free. Unsubscribe whenever you like.</small></div>
  </section>
}
