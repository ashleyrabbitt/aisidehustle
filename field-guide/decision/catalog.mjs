import { readFileSync } from 'node:fs';

const categories = ["content", "tech", "ecommerce", "education", "design", "creative", "services", "marketing", "consulting", "vertical-adapter"];
export const playbooks = categories.flatMap(category => {
  const file = new URL('./catalog/' + category + '.json', import.meta.url);
  return JSON.parse(readFileSync(file, 'utf8'));
});
export const SIDEHUSTLE_CATALOG = playbooks.map(item => ({
  ...item,
  category: item.categoryId,
  audience: item.audience?.role || '',
  channels: item.customerPlan?.primaryChannels || [],
  tactics: item.customerPlan?.firstCustomerTactics || []
}));
