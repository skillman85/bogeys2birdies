import Link from 'next/link';
import { Page } from '../components/SiteChrome';
import { ArticleCard, Chevron, ExperimentCard, Eyebrow, Newsletter, Stat } from '../components/UI';

const imgs = {
 hero:'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1800&q=85',
 putting:'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1200&q=85',
 green:'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=85',
 driver:'https://images.unsplash.com/photo-1584837141424-015fdf021047?auto=format&fit=crop&w=1200&q=85',
 bag:'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=1200&q=85',
 course:'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=1200&q=85'
}

export default function Home() {
  return <Page>
    <main>
      <section className="hero">
        <div className="hero-bg" style={{backgroundImage:`linear-gradient(90deg,rgba(8,17,11,.88) 0%,rgba(8,17,11,.58) 45%,rgba(8,17,11,.15) 100%),url(${imgs.hero})`}} />
        <div className="hero-inner"><Eyebrow>THE ORDINARY GOLFER PROJECT</Eyebrow><h1>Less bogey.<br/><em>More birdie.</em></h1><p>One club golfer testing what actually makes us better — with real rounds, honest experiments and the numbers to prove it.</p>
        <div className="hero-actions"><Link className="btn primary" href="/project">Follow the road to 5</Link><Link className="btn ghost" href="/experiments">Explore experiments</Link></div>
        <div className="hero-note">CURRENT HANDICAP <strong>8.8</strong> <span>→</span> TARGET <strong>5.0</strong></div></div>
      </section>

      <section className="road section-shell">
        <div className="section-heading split"><div><Eyebrow>ROAD TO 5</Eyebrow><h2>The game, measured.</h2></div><p>Not vibes. Not range sessions that “felt good”. Every round feeds the same question: <strong>what actually moves the handicap?</strong></p></div>
        <div className="progress-panel">
          <div className="progress-main"><div className="progress-head"><span>HANDICAP INDEX</span><strong>8.8 <small>→ 5.0</small></strong></div><div className="progress-track"><span style={{width:'46%'}} /></div><div className="progress-scale"><span>10.0</span><span>7.5</span><span>5.0</span></div></div>
          <div className="stats-grid"><Stat value="79.8" label="Scoring avg" detail="↓ 1.4 this season"/><Stat value="48%" label="Greens in reg" detail="↑ 6 pts"/><Stat value="31.2" label="Putts / round" detail="↓ 1.1"/><Stat value="24" label="Rounds tracked" detail="Full shot data"/></div>
        </div>
        <Link className="big-link" href="/data">See every number behind the project <Chevron /></Link>
      </section>

      <section className="experiments dark-section">
        <div className="section-shell"><div className="section-heading split light"><div><Eyebrow>B2B EXPERIMENTS</Eyebrow><h2>Golf advice.<br/>Put to the test.</h2></div><p>We take the advice golfers hear every week and test it over enough real rounds to find out whether it actually helps.</p></div>
        <div className="story-grid">
          <ExperimentCard number="01" tag="Course management" title="I stopped attacking pins for 10 rounds" summary="Ten rounds. Centre-green targets only. No hero shots. Did boring golf actually lower the scores?" result="WORKED" image={imgs.green}/>
          <ExperimentCard number="02" tag="Putting" title="15 minutes a day for 30 days" summary="A month of structured putting practice, tracked from baseline to final round." result="+1.6 SHOTS" image={imgs.putting}/>
          <ExperimentCard number="03" tag="Strategy" title="Driver vs 3-wood: the truth" summary="Which club actually keeps an 8-handicap out of trouble when the hole tightens up?" result="SURPRISE" image={imgs.driver}/>
        </div>
        <Link className="big-link inverse" href="/experiments">View all experiments <Chevron /></Link></div>
      </section>

      <section className="manifesto section-shell"><div className="manifesto-mark">“</div><blockquote>There’s enough golf advice on the internet.<br/><em>We want to know what works.</em></blockquote><p>Bogeys2Birdies is an honest record of the pursuit of better golf — the practice, the equipment, the bad decisions, the breakthroughs and the data behind all of it.</p></section>

      <section className="latest section-shell"><div className="section-heading split"><div><Eyebrow>FROM THE JOURNAL</Eyebrow><h2>Latest from B2B.</h2></div><Link href="/journal" className="text-link">View the journal <Chevron /></Link></div>
        <div className="article-grid"><ArticleCard category="Round journal" title="What shooting 78 actually felt like" meta="6 min read · 12 Aug 2026" image={imgs.course}/><ArticleCard category="Gear · Tested" title="Premium ball vs £25 ball: five rounds later" meta="9 min read · 8 Aug 2026" image={imgs.bag}/><ArticleCard category="Practice" title="The 45-minute session I can actually stick to" meta="7 min read · 2 Aug 2026" image={imgs.putting}/></div>
      </section>

      <Newsletter />
    </main>
  </Page>
}
