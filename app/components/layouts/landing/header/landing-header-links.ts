export type HeaderLink = {
  key: string;
  anchor: string;
};

export const INDEX_HEADER_LINKS: HeaderLink[] = [
  { key: 'header.forWhom', anchor: '#forWhom' },
  { key: 'header.mainFeatures', anchor: '#mainFeatures' },
  { key: 'header.tools', anchor: '#tools' },
  { key: 'header.tariff', anchor: '#tariff' },
  { key: 'header.reviews', anchor: '#reviews' },
  { key: 'header.news', anchor: '/news' },
  { key: 'header.faq', anchor: '#faq' },
];

export const DEFAULT_HEADER_LINKS: HeaderLink[] = [
  { key: 'header.news', anchor: '/news' },
];
