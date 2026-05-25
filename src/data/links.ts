export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  color: string;
  active: boolean;
  primary?: boolean;
}

// Replace URL values with your actual social media links
export const defaultLinks: SocialLink[] = [
  {
    id: 'discord',
    label: 'Discord',
    url: 'https://discord.com/users/YOUR_DISCORD_ID', // Replace with your Discord link
    icon: '💬',
    color: '#5865F2',
    active: true,
    primary: true,
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    url: 'https://twitter.com/YOUR_HANDLE', // Replace with your Twitter/X handle
    icon: '🐦',
    color: '#000000',
    active: true,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://instagram.com/YOUR_HANDLE', // Replace with your Instagram handle
    icon: '📸',
    color: '#E1306C',
    active: true,
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    url: 'https://bsky.app/profile/YOUR_HANDLE', // Replace with your Bluesky handle
    icon: '🦋',
    color: '#0085ff',
    active: true,
  },
  {
    id: 'toyhouse',
    label: 'Toyhouse',
    url: 'https://toyhou.se/YOUR_HANDLE', // Replace with your Toyhouse handle
    icon: '🏠',
    color: '#4CAF50',
    active: true,
  },
  {
    id: 'kofi',
    label: 'Ko-fi',
    url: 'https://ko-fi.com/YOUR_HANDLE', // Replace with your Ko-fi handle
    icon: '☕',
    color: '#FF5E5B',
    active: true,
  },
  {
    id: 'carrd',
    label: 'Carrd / Portfolio',
    url: 'https://YOUR_NAME.carrd.co', // Replace with your Carrd URL
    icon: '🌿',
    color: '#B9FF8A',
    active: true,
  },
];
