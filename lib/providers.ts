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

export const PROVIDER_IDS = PROVIDERS.map((p) => p.id);

export type Provider = (typeof PROVIDERS)[number];

export type ProviderId = (typeof PROVIDERS)[number]['id'];
