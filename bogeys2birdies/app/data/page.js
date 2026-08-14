import { Page } from '../../components/SiteChrome';
import { Eyebrow, Stat } from '../../components/UI';
import { defaultHomepageSettings, defaultPageSettings, defaultSiteSettings } from '../../content/defaults';
import { getHomepageSettings, getPageSettings, getSiteSettings } from '../../sanity/lib/content';
import { metadataFrom } from '../../sanity/lib/metadata';

export async function generateMetadata() { const page = await getPageSettings('data', defaultPageSettings.data); return metadataFrom(page); }

function HandicapTrend({ milestones = [], currentHandicap }) {
  const historical = milestones.map((item) => ({ label: item.label, handicap: Number(item.handicap) })).filter((item) => item.label && Number.isFinite(item.handicap));
  const current = Number(currentHandicap);
  const points = [...historical, ...(Number.isFinite(current) ? [{ label: 'Current', handicap: current, current: true }] : [])];
  if (!points.length) return <p className="chart-empty">Add handicap milestones in Sanity to build this graph.</p>;
  const values = points.map((point) => point.handicap); const high = Math.max(...values); const low = Math.min(...values); const range = Math.max(high - low, 1);
  const plotted = points.map((point, index) => ({ ...point, x: points.length === 1 ? 400 : 55 + (index * 690) / (points.length - 1), y: 45 + ((high - point.handicap) / range) * 135 }));
  return <div className="handicap-chart"><svg viewBox="0 0 800 250" role="img" aria-label="Handicap milestone trend">
    <polyline points={plotted.map(({ x, y }) => `${x},${y}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
    {plotted.map((point) => <g key={`${point.label}-${point.x}`} className={point.current ? 'current-node' : ''}>
      <circle cx={point.x} cy={point.y} r={point.current ? 10 : 8} />
      <text className="node-value" x={point.x} y={point.y - 17} textAnchor="middle">{point.handicap.toFixed(1)}</text>
      <text className="node-label" x={point.x} y="225" textAnchor="middle">{point.label}</text>
    </g>)}
  </svg></div>;
}

export default async function Data() {
  const [site, page, homepage] = await Promise.all([getSiteSettings(defaultSiteSettings), getPageSettings('data', defaultPageSettings.data), getHomepageSettings(defaultHomepageSettings)]);
  const currentHandicap = homepage?.currentHandicap || page.chartValue;
  return <Page siteSettings={site}><main className="inner-page"><section className="page-hero"><Eyebrow>{page.eyebrow}</Eyebrow><h1>{page.title}</h1><p>{page.description}</p></section><section className="section-shell data-page"><div className="stats-grid">{page.stats?.map((stat) => <Stat key={stat._key || stat.label} {...stat} />)}</div><div className="chart-card"><div className="chart-heading"><div><Eyebrow>{page.chartEyebrow}</Eyebrow><h2>{page.chartHeading}</h2></div><strong>{Number.isFinite(Number(currentHandicap)) ? Number(currentHandicap).toFixed(1) : currentHandicap}</strong></div><HandicapTrend milestones={page.handicapMilestones} currentHandicap={currentHandicap} /></div></section></main></Page>;
}
