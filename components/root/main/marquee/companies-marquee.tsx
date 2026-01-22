'use client';

import { useState } from 'react';
import Marquee from 'react-fast-marquee';

export const logos = [
  { id: 1, name: 'Google', url: 'https://cdn.simpleicons.org/google/9ca3af' },

  { id: 4, name: 'Stripe', url: 'https://cdn.simpleicons.org/stripe/9ca3af' },
  { id: 5, name: 'GitHub', url: 'https://cdn.simpleicons.org/github/9ca3af' },
  { id: 6, name: 'Notion', url: 'https://cdn.simpleicons.org/notion/9ca3af' },
  { id: 7, name: 'Vercel', url: 'https://cdn.simpleicons.org/vercel/9ca3af' },
  { id: 9, name: 'Figma', url: 'https://cdn.simpleicons.org/figma/9ca3af' },

  { id: 11, name: 'Google', url: 'https://cdn.simpleicons.org/google/9ca3af' },

  { id: 14, name: 'Stripe', url: 'https://cdn.simpleicons.org/stripe/9ca3af' },
  { id: 15, name: 'GitHub', url: 'https://cdn.simpleicons.org/github/9ca3af' },
  { id: 16, name: 'Notion', url: 'https://cdn.simpleicons.org/notion/9ca3af' },
  { id: 17, name: 'Vercel', url: 'https://cdn.simpleicons.org/vercel/9ca3af' },
  { id: 19, name: 'Figma', url: 'https://cdn.simpleicons.org/figma/9ca3af' },

  { id: 21, name: 'Docker', url: 'https://cdn.simpleicons.org/docker/9ca3af' },
  {
    id: 22,
    name: 'Kubernetes',
    url: 'https://cdn.simpleicons.org/kubernetes/9ca3af',
  },
  {
    id: 24,
    name: 'Cloudflare',
    url: 'https://cdn.simpleicons.org/cloudflare/9ca3af',
  },
  {
    id: 25,
    name: 'Supabase',
    url: 'https://cdn.simpleicons.org/supabase/9ca3af',
  },
  {
    id: 26,
    name: 'Firebase',
    url: 'https://cdn.simpleicons.org/firebase/9ca3af',
  },
  { id: 27, name: 'Linear', url: 'https://cdn.simpleicons.org/linear/9ca3af' },
  {
    id: 28,
    name: 'PostgreSQL',
    url: 'https://cdn.simpleicons.org/postgresql/9ca3af',
  },
];

const CompaniesMarquee = () => {
  const firstRow = logos.slice(0, logos.length / 2);
  const secondRow = logos.slice(logos.length / 2);

  return (
    <div className="flex flex-col gap-4">
      <Marquee autoFill speed={20}>
        {firstRow.map((logo) => (
          <LogoImage key={logo.id} src={logo.url} alt={logo.name} />
        ))}
      </Marquee>

      <Marquee autoFill speed={20}>
        {secondRow.map((logo) => (
          <LogoImage key={logo.id} src={logo.url} alt={logo.name} />
        ))}
      </Marquee>
    </div>
  );
};

export default CompaniesMarquee;

type Props = {
  src: string;
  alt: string;
};

const LogoImage = ({ src, alt }: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={80}
      height={32}
      loading="lazy"
      onError={() => setImgSrc('/logos/fallback.svg')}
      className="h-6 w-auto opacity-70 mr-12 hover:opacity-100 transition"
    />
  );
};
