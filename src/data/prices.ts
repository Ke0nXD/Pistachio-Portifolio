export type PriceCategory = 'fully-render' | 'flat-colors' | 'reference';

export interface PriceItem {
  id: string;
  name: string;
  nameKey: string;
  category: PriceCategory;
  price: number;
  descriptionKey: string;
  tag?: string;
  tagType?: 'popular' | 'avatar' | 'design';
  active: boolean;
  order: number;
}

export const defaultPrices: PriceItem[] = [
  {
    id: 'fr-icon',
    name: 'Icon',
    nameKey: 'icon',
    category: 'fully-render',
    price: 7,
    descriptionKey: 'frIcon',
    tag: 'Best for avatar',
    tagType: 'avatar',
    active: true,
    order: 1,
  },
  {
    id: 'fr-half',
    name: 'Half Body',
    nameKey: 'halfBody',
    category: 'fully-render',
    price: 12,
    descriptionKey: 'frHalf',
    tag: 'Popular',
    tagType: 'popular',
    active: true,
    order: 2,
  },
  {
    id: 'fr-full',
    name: 'Full Body',
    nameKey: 'fullBody',
    category: 'fully-render',
    price: 16,
    descriptionKey: 'frFull',
    active: true,
    order: 3,
  },
  {
    id: 'fc-icon',
    name: 'Icon',
    nameKey: 'icon',
    category: 'flat-colors',
    price: 5,
    descriptionKey: 'fcIcon',
    tag: 'Best for avatar',
    tagType: 'avatar',
    active: true,
    order: 4,
  },
  {
    id: 'fc-half',
    name: 'Half Body',
    nameKey: 'halfBody',
    category: 'flat-colors',
    price: 8,
    descriptionKey: 'fcHalf',
    active: true,
    order: 5,
  },
  {
    id: 'fc-full',
    name: 'Full Body',
    nameKey: 'fullBody',
    category: 'flat-colors',
    price: 10,
    descriptionKey: 'fcFull',
    active: true,
    order: 6,
  },
  {
    id: 'ref-sheet',
    name: 'Reference Sheet',
    nameKey: 'referenceSheet',
    category: 'reference',
    price: 20,
    descriptionKey: 'refSheet',
    tag: 'Character design',
    tagType: 'design',
    active: true,
    order: 7,
  },
];
