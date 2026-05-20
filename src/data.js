// Closet — seed dataset (used on first launch, then persisted to localStorage)
// Each item: id, name, category, color (swatch tone), pattern, aspect ratio
// Patterns: 'solid' | 'stripe' | 'stripe-w' | 'check' | 'denim' | 'knit' | 'leather' | 'dot' | 'grain'

export const ITEMS = [
  // outerwear
  { id: 'i01', name: 'Wool Trench',       cat: 'OUTERWEAR', tone: '#A89478', pat: 'grain',    ar: 1.35, worn: 14, last: 'Mar 24', tags: ['camel','classic','workwear'] },
  { id: 'i02', name: 'Leather Bomber',    cat: 'OUTERWEAR', tone: '#2E2A26', pat: 'leather',  ar: 1.20, worn: 22, last: 'Mar 28', tags: ['black','evening'] },
  { id: 'i03', name: 'Denim Jacket',      cat: 'OUTERWEAR', tone: '#5C7796', pat: 'denim',    ar: 1.18, worn: 9,  last: 'Feb 14', tags: ['casual','spring'] },
  { id: 'i04', name: 'Oversized Blazer',  cat: 'OUTERWEAR', tone: '#191A1F', pat: 'check',    ar: 1.30, worn: 6,  last: 'Mar 11', tags: ['plaid','office'] },

  // tops
  { id: 't01', name: 'White Tee',         cat: 'TOPS',      tone: '#F1ECE2', pat: 'solid',    ar: 1.05, worn: 41, last: 'Mar 30', tags: ['basic','daily'] },
  { id: 't02', name: 'Striped Breton',    cat: 'TOPS',      tone: '#E6E0D2', pat: 'stripe',   ar: 1.10, worn: 17, last: 'Mar 29', tags: ['parisian','navy'] },
  { id: 't03', name: 'Silk Blouse',       cat: 'TOPS',      tone: '#C9B69E', pat: 'grain',    ar: 1.12, worn: 8,  last: 'Mar 02', tags: ['evening','cream'] },
  { id: 't04', name: 'Cashmere Knit',     cat: 'TOPS',      tone: '#A7896A', pat: 'knit',     ar: 1.16, worn: 19, last: 'Mar 27', tags: ['warm','autumn'] },
  { id: 't05', name: 'Black Turtleneck',  cat: 'TOPS',      tone: '#15151A', pat: 'solid',    ar: 1.08, worn: 28, last: 'Mar 22', tags: ['minimal','staple'] },
  { id: 't06', name: 'Oxford Shirt',      cat: 'TOPS',      tone: '#D9E3EE', pat: 'solid',    ar: 1.10, worn: 11, last: 'Mar 18', tags: ['blue','prep'] },

  // bottoms
  { id: 'b01', name: 'Vintage 501s',      cat: 'BOTTOMS',   tone: '#3E5878', pat: 'denim',    ar: 1.55, worn: 33, last: 'Mar 31', tags: ['indigo','daily'] },
  { id: 'b02', name: 'Wide Leg Trouser',  cat: 'BOTTOMS',   tone: '#16161B', pat: 'solid',    ar: 1.60, worn: 16, last: 'Mar 25', tags: ['tailored','office'] },
  { id: 'b03', name: 'Pleated Skirt',     cat: 'BOTTOMS',   tone: '#5F2A2A', pat: 'solid',    ar: 1.42, worn: 5,  last: 'Feb 02', tags: ['burgundy'] },
  { id: 'b04', name: 'Linen Shorts',      cat: 'BOTTOMS',   tone: '#D3C5A8', pat: 'grain',    ar: 1.00, worn: 2,  last: 'Aug 19', tags: ['summer','cream'] },
  { id: 'b05', name: 'Cargo Pant',        cat: 'BOTTOMS',   tone: '#6E6857', pat: 'solid',    ar: 1.55, worn: 12, last: 'Mar 20', tags: ['olive','utility'] },

  // dresses
  { id: 'd01', name: 'Slip Dress',        cat: 'DRESSES',   tone: '#1A1A22', pat: 'grain',    ar: 1.75, worn: 4,  last: 'Feb 22', tags: ['evening','black'] },
  { id: 'd02', name: 'Floral Midi',       cat: 'DRESSES',   tone: '#8B5A6B', pat: 'dot',      ar: 1.70, worn: 7,  last: 'Mar 15', tags: ['rose','spring'] },

  // shoes
  { id: 's01', name: 'Loafers',           cat: 'SHOES',     tone: '#241B12', pat: 'leather',  ar: 0.72, worn: 31, last: 'Mar 30', tags: ['brown','daily'] },
  { id: 's02', name: 'White Sneakers',    cat: 'SHOES',     tone: '#F0EBE0', pat: 'solid',    ar: 0.74, worn: 47, last: 'Mar 31', tags: ['everyday'] },
  { id: 's03', name: 'Ankle Boots',       cat: 'SHOES',     tone: '#1A1614', pat: 'leather',  ar: 0.78, worn: 18, last: 'Mar 23', tags: ['black'] },
  { id: 's04', name: 'Heeled Mules',      cat: 'SHOES',     tone: '#7E1F1F', pat: 'solid',    ar: 0.70, worn: 3,  last: 'Dec 31', tags: ['red','party'] },

  // accessories
  { id: 'a01', name: 'Silk Scarf',        cat: 'ACCESS.',   tone: '#9F2B26', pat: 'grain',    ar: 0.95, worn: 6,  last: 'Mar 19', tags: ['red'] },
  { id: 'a02', name: 'Leather Belt',      cat: 'ACCESS.',   tone: '#3A2519', pat: 'leather',  ar: 0.42, worn: 21, last: 'Mar 28', tags: ['brown'] },
  { id: 'a03', name: 'Tote Bag',          cat: 'ACCESS.',   tone: '#C9B89A', pat: 'grain',    ar: 1.05, worn: 24, last: 'Mar 30', tags: ['canvas'] },
  { id: 'a04', name: 'Pearl Earrings',    cat: 'ACCESS.',   tone: '#EFE9DA', pat: 'solid',    ar: 0.55, worn: 3,  last: 'Feb 14', tags: ['white'] },
];

// Curated outfits — each refers to item ids
export const OUTFITS = [
  { id: 'o01', name: 'Quiet Luxury',     mood: 'WORK',   items: ['t04','b02','s01','a03'],            occasion: ['Office','Lunch'] },
  { id: 'o02', name: 'Parisian Sunday',  mood: 'CASUAL', items: ['t02','b01','s02','a02'],            occasion: ['Weekend','Cafe'] },
  { id: 'o03', name: 'Black Tie Light',  mood: 'EVENING',items: ['d01','s04','a04'],                   occasion: ['Date','Gala'] },
  { id: 'o04', name: 'Oversized Office', mood: 'WORK',   items: ['t01','i04','b02','s03'],             occasion: ['Office'] },
  { id: 'o05', name: 'Spring Layer',     mood: 'CASUAL', items: ['t06','i03','b01','s02','a01'],       occasion: ['Travel','Weekend'] },
  { id: 'o06', name: 'Editorial Red',    mood: 'EVENING',items: ['t05','b03','s04','a01'],             occasion: ['Date'] },
  { id: 'o07', name: 'Soft Power',       mood: 'WORK',   items: ['t03','b02','s01','a02'],             occasion: ['Office','Dinner'] },
  { id: 'o08', name: 'Utility Walk',     mood: 'CASUAL', items: ['t01','b05','s02','a03'],             occasion: ['Errands'] },
  { id: 'o09', name: 'Trench Story',     mood: 'CASUAL', items: ['t05','i01','b01','s03'],             occasion: ['Travel'] },
  { id: 'o10', name: 'Slip & Boots',     mood: 'EVENING',items: ['d01','i02','s03'],                   occasion: ['Party'] },
  { id: 'o11', name: 'Knit & Denim',     mood: 'CASUAL', items: ['t04','b01','s01','a02'],             occasion: ['Weekend'] },
  { id: 'o12', name: 'Floral Afternoon', mood: 'CASUAL', items: ['d02','i03','s02','a04'],             occasion: ['Brunch'] },
];

export const CATEGORIES = ['OUTERWEAR','TOPS','BOTTOMS','DRESSES','SHOES','ACCESS.'];

// March 2026 wear-log → calendar dots
export const WEAR_LOG = {
  '2026-03-01': 'o01', '2026-03-02': 'o08', '2026-03-03': 'o04',
  '2026-03-04': 'o02', '2026-03-05': 'o07', '2026-03-06': 'o09',
  '2026-03-07': 'o05', '2026-03-08': 'o11',
  '2026-03-10': 'o01', '2026-03-11': 'o04', '2026-03-12': 'o07',
  '2026-03-13': 'o10', '2026-03-14': 'o03',
  '2026-03-15': 'o12', '2026-03-17': 'o08',
  '2026-03-18': 'o02', '2026-03-19': 'o06', '2026-03-20': 'o01',
  '2026-03-21': 'o05', '2026-03-22': 'o09', '2026-03-23': 'o11',
  '2026-03-24': 'o01', '2026-03-25': 'o07',
  '2026-03-27': 'o04', '2026-03-28': 'o02', '2026-03-29': 'o02',
  '2026-03-30': 'o08', '2026-03-31': 'o09',
};

export const TODAY_ISO = '2026-04-02';

// Default aspect ratio per category, used for newly added items
export const AR_BY_CAT = {
  OUTERWEAR: 1.28, TOPS: 1.1, BOTTOMS: 1.55,
  DRESSES: 1.7, SHOES: 0.74, 'ACCESS.': 0.95,
};

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// '2026-04-02' → 'Apr 02'
export function formatLast(iso) {
  const [, m, d] = iso.split('-');
  return `${MONTHS[Number(m) - 1]} ${d}`;
}
