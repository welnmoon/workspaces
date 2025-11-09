'use client';
import Marquee from 'react-fast-marquee';

const CompaniesMarquee = () => {
  const logos = [
    { id: 1, name: 'Google', url: 'https://cdn.simpleicons.org/google/9ca3af' },
    {
      id: 2,
      name: 'Microsoft',
      url: 'https://cdn.simpleicons.org/youtube/9ca3af',
    },
    {
      id: 3,
      name: 'Amazon',
      url: 'https://cdn.simpleicons.org/obsidian/9ca3af',
    },
    { id: 4, name: 'Stripe', url: 'https://cdn.simpleicons.org/stripe/9ca3af' },
    { id: 5, name: 'GitHub', url: 'https://cdn.simpleicons.org/github/9ca3af' },
    { id: 6, name: 'Slack', url: 'https://cdn.simpleicons.org/slack/9ca3af' },
    { id: 7, name: 'Notion', url: 'https://cdn.simpleicons.org/notion/9ca3af' },
    { id: 8, name: 'Vercel', url: 'https://cdn.simpleicons.org/vercel/9ca3af' },
    { id: 9, name: 'OpenAI', url: 'https://cdn.simpleicons.org/openai/9ca3af' },
    { id: 10, name: 'Figma', url: 'https://cdn.simpleicons.org/figma/9ca3af' },
    {
      id: 11,
      name: 'Google',
      url: 'https://cdn.simpleicons.org/google/9ca3af',
    },
    {
      id: 12,
      name: 'Microsoft',
      url: 'https://cdn.simpleicons.org/youtube/9ca3af',
    },
    {
      id: 13,
      name: 'Amazon',
      url: 'https://cdn.simpleicons.org/obsidian/9ca3af',
    },
    {
      id: 14,
      name: 'Stripe',
      url: 'https://cdn.simpleicons.org/stripe/9ca3af',
    },
    {
      id: 15,
      name: 'GitHub',
      url: 'https://cdn.simpleicons.org/github/9ca3af',
    },
    { id: 16, name: 'Slack', url: 'https://cdn.simpleicons.org/slack/9ca3af' },
    {
      id: 17,
      name: 'Notion',
      url: 'https://cdn.simpleicons.org/notion/9ca3af',
    },
    {
      id: 18,
      name: 'Vercel',
      url: 'https://cdn.simpleicons.org/vercel/9ca3af',
    },
    {
      id: 19,
      name: 'OpenAI',
      url: 'https://cdn.simpleicons.org/openai/9ca3af',
    },
    { id: 20, name: 'Figma', url: 'https://cdn.simpleicons.org/figma/9ca3af' },
    {
      id: 21,
      name: 'Google',
      url: 'https://cdn.simpleicons.org/google/9ca3af',
    },
    {
      id: 22,
      name: 'Microsoft',
      url: 'https://cdn.simpleicons.org/youtube/9ca3af',
    },
    {
      id: 23,
      name: 'Amazon',
      url: 'https://cdn.simpleicons.org/obsidian/9ca3af',
    },
    {
      id: 24,
      name: 'Stripe',
      url: 'https://cdn.simpleicons.org/stripe/9ca3af',
    },
    {
      id: 25,
      name: 'GitHub',
      url: 'https://cdn.simpleicons.org/github/9ca3af',
    },
    { id: 26, name: 'Slack', url: 'https://cdn.simpleicons.org/slack/9ca3af' },
    {
      id: 27,
      name: 'Notion',
      url: 'https://cdn.simpleicons.org/notion/9ca3af',
    },
    {
      id: 28,
      name: 'Vercel',
      url: 'https://cdn.simpleicons.org/vercel/9ca3af',
    },
    {
      id: 29,
      name: 'OpenAI',
      url: 'https://cdn.simpleicons.org/openai/9ca3af',
    },
    { id: 30, name: 'Figma', url: 'https://cdn.simpleicons.org/figma/9ca3af' },
    {
      id: 31,
      name: 'Google',
      url: 'https://cdn.simpleicons.org/google/9ca3af',
    },
    {
      id: 32,
      name: 'Microsoft',
      url: 'https://cdn.simpleicons.org/youtube/9ca3af',
    },
    {
      id: 33,
      name: 'Amazon',
      url: 'https://cdn.simpleicons.org/obsidian/9ca3af',
    },
    {
      id: 34,
      name: 'Stripe',
      url: 'https://cdn.simpleicons.org/stripe/9ca3af',
    },
    {
      id: 35,
      name: 'GitHub',
      url: 'https://cdn.simpleicons.org/github/9ca3af',
    },
    { id: 36, name: 'Slack', url: 'https://cdn.simpleicons.org/slack/9ca3af' },
    {
      id: 37,
      name: 'Notion',
      url: 'https://cdn.simpleicons.org/notion/9ca3af',
    },
    {
      id: 38,
      name: 'Vercel',
      url: 'https://cdn.simpleicons.org/vercel/9ca3af',
    },
    {
      id: 39,
      name: 'OpenAI',
      url: 'https://cdn.simpleicons.org/openai/9ca3af',
    },
    { id: 40, name: 'Figma', url: 'https://cdn.simpleicons.org/figma/9ca3af' },
  ];

  return (
    <Marquee className="mb-30">
      {logos.map((logo) => (
        // eslint-disable-next-line
        <img
          key={logo.id}
          src={logo.url}
          alt={logo.name}
          width={80}
          height={32}
          className="h-12 w-auto opacity-70 mr-12 hover:opacity-100 transition"
        />
      ))}
    </Marquee>
  );
};

export default CompaniesMarquee;
