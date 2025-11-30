import { clientRoutes } from '@/lib/routes/client-routes';
import Link from 'next/link';

export const AuthButtons = ({ className }: { className?: string }) => {
  return (
    <div className={`${className} flex gap-3 flex-shrink-0`}>
      <Link href={clientRoutes.authLoginPage()}>
        <button className="px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition">
          Login
        </button>
      </Link>
      <Link href={clientRoutes.authRegisterPage()}>
        <button className="px-6 min-w-fit py-2 bg-black text-white hover:bg-gray-800 transition">
          Start free
        </button>
      </Link>
    </div>
  );
};
