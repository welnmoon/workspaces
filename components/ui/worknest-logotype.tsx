'use client';

import Link from 'next/link';

const WorknestLogotype = () => {
  return (
    <Link className="text-3xl" href={'/'}>
      <span className="logo-work text-primary-600 font-bold">WORK</span>
      <span className="logo-nest text-primary-500">NEST</span>
    </Link>
  );
};

export default WorknestLogotype;
