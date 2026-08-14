export const images = {
  hero: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1800&q=85',
  putting: 'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1200&q=85',
  green: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=85',
  driver: 'https://images.unsplash.com/photo-1584837141424-015fdf021047?auto=format&fit=crop&w=1200&q=85',
  bag: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=1200&q=85',
  course: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=1200&q=85',
};

export const defaultSiteSettings = {
  siteTitle: 'Bogeys2Birdies | Real Golf. Real Progress.',
  siteDescription: 'An honest club golfer’s pursuit of better golf — experiments, data, gear and the road to a lower handicap.',
  footerTagline: 'Real golf. Real progress.', copyright: '© 2026 Bogeys2Birdies',
};

export const defaultExperiments = [
  { number: '01', tag: 'Course management', title: 'Centre green for 10 rounds', homeTitle: 'I stopped attacking pins for 10 rounds', summary: 'No tucked pins. No sucker shots. Just the middle of the green.', homeSummary: 'Ten rounds. Centre-green targets only. No hero shots. Did boring golf actually lower the scores?', result: 'WORKED', coverImage: images.green, slug: 'centre-green-for-10-rounds' },
  { number: '02', tag: 'Putting', title: '15 minutes a day for 30 days', summary: 'A measurable putting routine instead of aimless practice.', homeSummary: 'A month of structured putting practice, tracked from baseline to final round.', result: '+1.6 SHOTS', coverImage: images.putting, slug: '15-minutes-a-day' },
  { number: '03', tag: 'Tee strategy', title: 'Driver vs 3-wood', homeTitle: 'Driver vs 3-wood: the truth', summary: "The safer club isn't always the safer play.", homeSummary: 'Which club actually keeps an 8-handicap out of trouble when the hole tightens up?', result: 'SURPRISE', coverImage: images.driver, slug: 'driver-vs-3-wood' },
];

export const defaultArticles = [
  { category: 'Competition', homeCategory: 'Round journal', title: 'What shooting 78 actually felt like', readingTime: 6, publishedAt: '2026-08-12T09:00:00Z', coverImage: images.course, slug: 'what-shooting-78-felt-like' },
  { category: 'Mental game', title: 'One triple bogey nearly ruined the round', readingTime: 5, publishedAt: '2026-08-05T09:00:00Z', coverImage: images.hero, slug: 'one-triple-bogey' },
  { category: 'Practice', title: 'Why I stopped smashing 70 balls at the range', homeTitle: 'The 45-minute session I can actually stick to', readingTime: 7, publishedAt: '2026-07-28T09:00:00Z', coverImage: images.driver, homeImage: images.putting, slug: 'stopped-smashing-70-balls' },
];

export const defaultGearReviews = [
  { category: 'Balls', title: 'Premium vs value: does £25 matter?', testDetails: '5-round test', coverImage: images.green, slug: 'premium-vs-value' },
  { category: 'Driver', title: 'Five-year-old driver vs current model', testDetails: 'Launch monitor + on-course', coverImage: images.driver, slug: 'old-vs-new-driver' },
  { category: 'Training', title: 'The putting mat I actually kept using', testDetails: '30-day review', coverImage: images.putting, slug: 'putting-mat-review' },
];

export const defaultHomepageArticles = [
  { category: 'Round journal', title: 'What shooting 78 actually felt like', homeMeta: '6 min read · 12 Aug 2026', readingTime: 6, publishedAt: '2026-08-12T09:00:00Z', coverImage: images.course, slug: 'what-shooting-78-felt-like' },
  { category: 'Gear · Tested', title: 'Premium ball vs £25 ball: five rounds later', homeMeta: '9 min read · 8 Aug 2026', readingTime: 9, publishedAt: '2026-08-08T09:00:00Z', coverImage: images.bag, slug: 'premium-ball-vs-value' },
  { category: 'Practice', title: 'The 45-minute session I can actually stick to', homeMeta: '7 min read · 2 Aug 2026', readingTime: 7, publishedAt: '2026-08-02T09:00:00Z', coverImage: images.putting, slug: '45-minute-practice' },
];

export const defaultHomepageSettings = {
  heroEyebrow: 'THE ORDINARY GOLFER PROJECT', heroTitleLineOne: 'Less bogey.', heroTitleLineTwo: 'More birdie.',
  heroDescription: 'One club golfer testing what actually makes us better — with real rounds, honest experiments and the numbers to prove it.', heroImage: images.hero,
  currentHandicap: '8.8', targetHandicap: '5.0', progressPercent: 46,
  roadEyebrow: 'ROAD TO 5', roadHeading: 'The game, measured.', roadDescription: 'Not vibes. Not range sessions that “felt good”. Every round feeds the same question: what actually moves the handicap?',
  stats: [{ value: '79.8', label: 'Scoring avg', detail: '↓ 1.4 this season' }, { value: '48%', label: 'Greens in reg', detail: '↑ 6 pts' }, { value: '31.2', label: 'Putts / round', detail: '↓ 1.1' }, { value: '24', label: 'Rounds tracked', detail: 'Full shot data' }],
  experimentsEyebrow: 'B2B EXPERIMENTS', experimentsHeading: 'Golf advice.\nPut to the test.', experimentsDescription: 'We take the advice golfers hear every week and test it over enough real rounds to find out whether it actually helps.',
  journalEyebrow: 'FROM THE JOURNAL', journalHeading: 'Latest from B2B.',
  manifestoHeading: 'There’s enough golf advice on the internet.', manifestoEmphasis: 'We want to know what works.', manifestoDescription: 'Bogeys2Birdies is an honest record of the pursuit of better golf — the practice, the equipment, the bad decisions, the breakthroughs and the data behind all of it.',
  newsletterHeadingLineOne: 'One useful golf lesson.', newsletterHeadingLineTwo: 'Every Friday.', newsletterDescription: 'No tour gossip. No miracle swing tips. Just what we tested, what changed and what might help your game.',
};

export const defaultHomeContent = { settings: defaultHomepageSettings, site: defaultSiteSettings, experiments: defaultExperiments, articles: defaultHomepageArticles };

export const defaultPageSettings = {
  project: { pageKey: 'project', eyebrow: 'THE PROJECT', title: 'Can an ordinary club golfer reach a 5 handicap?', description: 'That is the experiment. Every lesson, practice block, round and equipment change gets measured against the same goal.', stats: [{ value: '8.8', label: 'Starting index' }, { value: '5.0', label: 'Target' }, { value: '24', label: 'Rounds tracked' }, { value: '79.8', label: 'Scoring average' }], secondaryHeading: 'No shortcuts. Just better decisions.', paragraphs: ['The Road to 5 is the spine of Bogeys2Birdies. It is not a promise to become scratch or a feed of perfect range swings. It is a transparent record of what improves an actual club golfer.', 'Each month gets a review: what changed, what failed, which numbers moved and what gets tested next.'] },
  data: { pageKey: 'data', eyebrow: 'THE NUMBERS', title: 'The scorecard tells you what happened. The data tells you why.', description: 'The live dashboard behind the Road to 5.', stats: [{ value: '79.8', label: 'Scoring average', detail: 'Season -1.4' }, { value: '48%', label: 'GIR', detail: 'Season +6 pts' }, { value: '55%', label: 'Fairways', detail: 'Season +3 pts' }, { value: '31.2', label: 'Putts', detail: 'Season -1.1' }], chartEyebrow: 'HANDICAP TREND', chartHeading: 'Heading the right way.', chartValue: '8.8' },
  journal: { pageKey: 'journal', eyebrow: 'ROUND JOURNAL', title: 'The good rounds, the disasters and everything between.', description: 'Notes from club golf without pretending every lesson ends in a breakthrough.' },
  experiments: { pageKey: 'experiments', eyebrow: 'B2B EXPERIMENTS', title: 'We test the advice golfers repeat.', description: 'Every experiment starts with a claim, a method and enough real golf to produce a useful verdict.' },
  gear: { pageKey: 'gear', eyebrow: 'GEAR · TESTED', title: "Equipment through a club golfer's eyes.", description: 'No spec-sheet rewrites. If it appears here, it has to earn its place in a real bag or solve a real problem.' },
};

export function formatArticleMeta(item) {
  const date = item.publishedAt ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(item.publishedAt)) : '';
  return [date, item.readingTime ? `${item.readingTime} min` : ''].filter(Boolean).join(' · ');
}
