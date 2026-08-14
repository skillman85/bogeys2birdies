const contentList = (S, type, title) =>
  S.documentTypeList(type)
    .title(title)
    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]);

const singleton = (S, type, id, title) =>
  S.listItem()
    .title(title)
    .id(id)
    .child(S.document().schemaType(type).documentId(id).title(title));

export const structure = (S) =>
  S.list()
    .title('Bogeys2Birdies')
    .items([
      S.listItem().id('article').title('Articles').schemaType('article').child(contentList(S, 'article', 'Articles')),
      S.listItem().id('experiment').title('Experiments').schemaType('experiment').child(contentList(S, 'experiment', 'Experiments')),
      S.listItem().id('gearReview').title('Gear reviews').schemaType('gearReview').child(contentList(S, 'gearReview', 'Gear reviews')),
      S.listItem().id('category').title('Categories').schemaType('category').child(S.documentTypeList('category').title('Categories').defaultOrdering([{ field: 'title', direction: 'asc' }])),
      S.listItem().id('comment').title('Comments').schemaType('comment').child(S.documentTypeList('comment').title('Comments').defaultOrdering([{ field: 'createdAt', direction: 'desc' }])),
      S.listItem().title('Newsletter').child(S.list().title('Newsletter').items([
        singleton(S, 'newsletterSettings', 'newsletterSettings', 'Newsletter settings'),
        S.listItem().id('newsletterCampaign').title('Campaigns').schemaType('newsletterCampaign').child(S.documentTypeList('newsletterCampaign').title('Newsletter campaigns').defaultOrdering([{ field: 'scheduledAt', direction: 'desc' }])),
        S.listItem().id('newsletterSubscriber').title('Subscribers').schemaType('newsletterSubscriber').child(S.documentTypeList('newsletterSubscriber').title('Newsletter subscribers').defaultOrdering([{ field: 'createdAt', direction: 'desc' }])),
      ])),
      S.divider(),
      S.listItem().title('Pages').child(S.list().title('Pages').items([
        S.listItem().id('customPage').title('Custom pages').schemaType('customPage').child(S.documentTypeList('customPage').title('Custom pages')),
        S.divider(),
        singleton(S, 'pageSettings', 'pageSettings-project', 'Project page'),
        singleton(S, 'pageSettings', 'pageSettings-data', 'Data page'),
        singleton(S, 'pageSettings', 'pageSettings-journal', 'Journal page'),
        singleton(S, 'pageSettings', 'pageSettings-experiments', 'Experiments page'),
        singleton(S, 'pageSettings', 'pageSettings-gear', 'Gear page'),
      ])),
      S.divider(),
      S.listItem().id('precision-golf-import').title('Import golf data').child(
        S.component().id('precision-golf-import-panel').title('Import Precision Golf data').component(SeasonImportTool),
      ),
      S.divider(),
      singleton(S, 'homepageSettings', 'homepageSettings', 'Homepage settings'),
      singleton(S, 'seasonData', 'seasonData', 'Season data'),
      singleton(S, 'siteSettings', 'siteSettings', 'Site settings'),
    ]);
import { SeasonImportTool } from './components/SeasonImportTool.jsx';
