import { article } from './article';
import { experiment } from './experiment';
import { gearReview } from './gearReview';
import { homepageSettings } from './homepageSettings';
import { siteSettings } from './siteSettings';
import { pageSettings } from './pageSettings';
import { customPage } from './customPage';
import { comment } from './comment';
import { category } from './category';
import { seasonData } from './seasonData';
import { handicapMilestone, portableText, seo, stat } from './shared';

export const schemaTypes = [seo, portableText, stat, handicapMilestone, category, article, experiment, gearReview, customPage, comment, seasonData, homepageSettings, siteSettings, pageSettings];
