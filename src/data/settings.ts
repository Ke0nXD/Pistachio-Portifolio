export interface SiteSettings {
  commissionsOpen: boolean;
  musicEnabled: boolean;
  musicPath: string; // Path relative to /public/audio/
  cursorPath: string; // Path relative to /public/cursor/
  logoText: string;
  heroBadgeText: string;
  heroTitle: string;
  heroSubtitle: string;
}

export const defaultSettings: SiteSettings = {
  commissionsOpen: true,
  musicEnabled: false,
  musicPath: '/audio/background.mp3', // Replace with your music file
  cursorPath: '/cursor/paw.png',      // Replace with your cursor image
  logoText: 'Pistachio Creations',
  heroBadgeText: '✨ Commissions Open',
  heroTitle: 'Pistachio Creations',
  heroSubtitle: 'Cute furry art commissions with personality, charm and care.',
};
