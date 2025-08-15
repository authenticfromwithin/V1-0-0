export type QuoteItem = {
  id: string;
  text: string;
  context?: string;
  reflectionPrompt?: string;
  category: string;
};

export type QuotesManifest = {
  version: string;
  categories: string[];
  files: Record<string, string[]>; // category -> file paths (under /content)
};

export type Devotional = {
  id: string;
  title: string;
  body: string;
  references?: string[];
  language: 'en'|'af'|'ms'|'id'|string;
  dateISO: string; // YYYY-MM-DD
};

export type DevotionalsManifest = {
  version: string;
  plan: 'daily';
  files: Record<string, string[]>; // month -> file paths
};