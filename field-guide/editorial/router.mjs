import { homePage, articles, reviews, articlePage, reviewPage, guidesPage, reviewsPage } from './magazine.mjs';
import { decisionPaths, decisionPage } from '../decision/playbook.mjs';
export { magazineMeta } from './meta.mjs';
const pages=new Map([['/',homePage],['/guides',guidesPage],['/program-reviews',reviewsPage],...articles.map(s=>['/guides/'+s.slug,()=>articlePage(s)]),...reviews.map(r=>['/program-reviews/'+r.slug,()=>reviewPage(r)])]);
const decisions=new Set(decisionPaths);
export function editorialPage(path,params) {
  return pages.get(path)?.() ?? (decisions.has(path)?decisionPage(path,params):null);
}
