import { article } from './article';
import { experiment } from './experiment';
import { gearReview } from './gearReview';
import { homepageSettings } from './homepageSettings';
import { siteSettings } from './siteSettings';
import { pageSettings } from './pageSettings';
import { portableText, seo, stat } from './shared';

export const schemaTypes = [seo, portableText, stat, article, experiment, gearReview, homepageSettings, siteSettings, pageSettings];
