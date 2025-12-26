import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

const NavImg = ({
  img,
  title,
  desc,
}: {
  img: string;
  title: string;
  desc: string;
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <aside className="flex-1 aspect-square w-[200px] relative">
      <Image
        fill
        src={img}
        alt={title}
        className={cn(
          'h-full w-full object-cover rounded-md',
          imgLoaded ? 'opacity-100' : 'bg-zinc-200 animate-pulse'
        )}
        onLoadingComplete={() => setImgLoaded(true)}
      />
      {imgLoaded && (
        <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/70 to-transparent" />
      )}
      <h3
        className={cn(
          'text-lg font-semibold  absolute bottom-4 left-4',
          imgLoaded ? 'text-white' : 'text-black'
        )}
      >
        {title}
      </h3>
    </aside>
  );
};

export default NavImg;
