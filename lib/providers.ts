export const PROVIDERS = [
  {
    id: 'google',
    name: 'Google',
    icon: '/icons/google.svg',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '/icons/github.svg',
  },
];

export type Provider = (typeof PROVIDERS)[number];

export type ProviderId = Provider['id'];
