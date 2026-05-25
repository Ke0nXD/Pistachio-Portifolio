export type CompletedCommissionCategory = 'icon' | 'half-body' | 'full-body' | 'reference-sheet' | 'custom';

export interface CompletedCommission {
  id: string;
  title: string;
  clientName: string;
  category: CompletedCommissionCategory;
  src: string;
  description: string;
  completedAt: string;
  active: boolean;
}

// Replace src values with your finished commission images or local paths like /images/commissions/file.png
export const defaultCompletedCommissions: CompletedCommission[] = [
  {
    id: 'c1',
    title: 'Soft Icon Commission',
    clientName: 'Client Example',
    category: 'icon',
    src: 'https://placehold.co/600x600/B9FF8A/211827?text=Finished+Icon',
    description: 'Finished icon commission with soft expression, clean rendering and pastel colors.',
    completedAt: '2026-05-01',
    active: true,
  },
  {
    id: 'c2',
    title: 'Full Body Character Art',
    clientName: 'Client Example',
    category: 'full-body',
    src: 'https://placehold.co/600x800/C04BEA/FFFBEF?text=Finished+Full+Body',
    description: 'Completed full body commission showing pose, personality and character details.',
    completedAt: '2026-05-08',
    active: true,
  },
  {
    id: 'c3',
    title: 'Reference Sheet Delivery',
    clientName: 'Client Example',
    category: 'reference-sheet',
    src: 'https://placehold.co/900x600/FFF4A8/211827?text=Finished+Ref+Sheet',
    description: 'Final reference sheet with front view, back view, palette and small details.',
    completedAt: '2026-05-15',
    active: true,
  },
];
