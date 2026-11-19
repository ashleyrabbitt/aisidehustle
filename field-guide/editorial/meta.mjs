import { articles, reviews } from './stories.mjs';
export const magazineMeta = [
  ['/field-guide/pocket-product-workshop','Build a pocket product from one repeated task','Try a bakery preorder calculator and download a working product and offline worksheet.'],
  ['/guides','Side hustle guides','Practical guides to earning with AI.'],
  ['/program-reviews','Side hustle program reviews','Read the evidence behind creator programs.'],
  ...articles.map(s=>['/guides/'+s.slug,s.title,s.description]),
  ...reviews.map(r=>['/program-reviews/'+r.slug,r.name+' review',r.description]),
  ['/field-guide','Digital product field guide','Build and test a small product.'],
  ['/shortlist','Build your shortlist','Compare ideas by customer access, time and budget.'],
  ['/work-style','What kind of work suits you?','Explore your work preferences.']
];
