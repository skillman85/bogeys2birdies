import { Page } from '../../components/SiteChrome';
import { Eyebrow, Stat } from '../../components/UI';
import { defaultHomepageSettings, defaultPageSettings, defaultSiteSettings } from '../../content/defaults';
import { getHomepageSettings, getPageSettings, getSeasonData, getSiteSettings } from '../../sanity/lib/content';
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
  const [site, page, homepage, season] = await Promise.all([getSiteSettings(defaultSiteSettings), getPageSettings('data', defaultPageSettings.data), getHomepageSettings(defaultHomepageSettings), getSeasonData()]);
  const currentHandicap = homepage?.currentHandicap || page.chartValue;
  return <Page siteSettings={site}><main className="inner-page"><section className="page-hero"><Eyebrow>{page.eyebrow}</Eyebrow><h1>{page.title}</h1><p>{page.description}</p></section><section className="section-shell data-page"><div className="stats-grid">{page.stats?.map((stat) => <Stat key={stat._key || stat.label} {...stat} />)}</div><div className="chart-card"><div className="chart-heading"><div><Eyebrow>{page.chartEyebrow}</Eyebrow><h2>{page.chartHeading}</h2></div><strong>{Number.isFinite(Number(currentHandicap)) ? Number(currentHandicap).toFixed(1) : currentHandicap}</strong></div><HandicapTrend milestones={page.handicapMilestones} currentHandicap={currentHandicap} /></div>{season && <div className="season-dashboard"><section><div className="section-heading"><Eyebrow>MONTH BY MONTH</Eyebrow><h2>How the season is moving.</h2></div><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Month</th><th>Rounds</th><th>Avg.</th><th>GIR</th><th>Fairways</th><th>Putts</th><th>Scrambling</th><th>Penalties</th></tr></thead><tbody>{season.monthlyCheckpoints?.map((r)=><tr key={r._key}><td>{r.month}</td><td>{r.roundsPlayed}</td><td>{r.averageGross?.toFixed(1)}</td><td>{r.girPercent}%</td><td>{r.fairwaysHitPercent}%</td><td>{r.averagePutts?.toFixed(1)}</td><td>{r.scramblingPercent}%</td><td>{r.penaltiesPerRound?.toFixed(1)}</td></tr>)}</tbody></table></div></section><section><div className="section-heading"><Eyebrow>SCORING PROFILE</Eyebrow><h2>Where the shots go.</h2></div><div className="season-card-grid">{season.parScoring?.map((r)=><article className="season-card" key={r._key}><span>PAR {r.par}</span><strong>{r.averageToPar>=0?'+':''}{r.averageToPar?.toFixed(1)}</strong><p>Average to par across {r.holesPlayed} holes</p></article>)}</div></section><section><div className="section-heading"><Eyebrow>RECENT ROUNDS</Eyebrow><h2>The latest scorecards.</h2></div><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Date</th><th>Course</th><th>Gross</th><th>To par</th><th>Stableford</th></tr></thead><tbody>{season.recentRounds?.map((r)=><tr key={r._key}><td>{new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(r.date))}</td><td>{r.courseName}</td><td>{r.gross}</td><td>{r.toPar>=0?'+':''}{r.toPar}</td><td>{r.stablefordPoints}</td></tr>)}</tbody></table></div></section><p className="season-source">Based on {season.roundCount} rounds · {season.homeClub} · Updated {new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(season.exportedAt))}</p></div>}</section></main></Page>;
}
