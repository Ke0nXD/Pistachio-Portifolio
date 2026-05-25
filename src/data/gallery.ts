export type GalleryCategory = 'icons' | 'half-body' | 'full-body' | 'reference-sheet' | 'sketches';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  src: string;
  featured: boolean;
  active: boolean;
}

// Replace src values with your actual image paths or URLs
export const defaultGallery: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Pistache Full Body',
    category: 'full-body',
    // Replace with your actual image path: /images/gallery/your-image.png
    src: 'https://placehold.co/400x500/B9FF8A/211827?text=Full+Body+1',
    featured: true,
    active: true,
  },
  {
    id: 'g2',
    title: 'Cat Icon Commission',
    category: 'icons',
    src: 'https://placehold.co/400x400/C04BEA/FFFBEF?text=Icon+1',
    featured: true,
    active: true,
  },
  {
    id: 'g3',
    title: 'Reference Sheet Example',
    category: 'reference-sheet',
    src: 'https://placehold.co/800x600/FFF4A8/211827?text=Ref+Sheet',
    featured: true,
    active: true,
  },
  {
    id: 'g4',
    title: 'Half Body Commission',
    category: 'half-body',
    src: 'https://placehold.co/400x500/F8B8DD/211827?text=Half+Body+1',
    featured: false,
    active: true,
  },
  {
    id: 'g5',
    title: 'Sketch Example',
    category: 'sketches',
    src: 'https://placehold.co/400x400/FFFBEF/7A2BA8?text=Sketch+1',
    featured: false,
    active: true,
  },
  {
    id: 'g6',
    title: 'Icon Commission 2',
    category: 'icons',
    src: 'https://placehold.co/400x400/8BE75A/211827?text=Icon+2',
    featured: false,
    active: true,
  },
];
