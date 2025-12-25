import Link from 'next/link';

import RootContainer from '@/components/root/root-container';
import { WorkspaceLogo } from '@/components/ui/workspace-logo';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { navSections } from '@/const/root-navigation';



const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-16">
      <RootContainer>
        <div className="py-12 flex flex-col gap-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <WorkspaceLogo size={54} className="text-neutral-900" />
              <div>
                <p className="text-xl font-semibold text-neutral-900">
                  Workspaces
                </p>
                <p className="text-sm text-neutral-500">
                  Структура для командного фокуса: проекты, документы, задачи и
                  данные в одном месте.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/register"
                className="rounded-full bg-neutral-900 text-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-neutral-800"
              >
                Попробовать бесплатно
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400 hover:text-neutral-900"
              >
                Тарифы
              </Link>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {navSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-2 text-sm text-neutral-600">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition hover:text-neutral-900 hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-neutral-200 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
              <span className="font-semibold text-neutral-700">
                Русский (RU)
              </span>
              <span className="h-4 w-px bg-neutral-300" aria-hidden="true" />
              <span>Казахстан, Алматы</span>
              <span className="h-4 w-px bg-neutral-300" aria-hidden="true" />
              <span>© {currentYear} Workspaces</span>
              <span className="h-4 w-px bg-neutral-300" aria-hidden="true" />
              <Link href="#" className="hover:text-neutral-900">
                Конфиденциальность
              </Link>
              <span className="h-4 w-px bg-neutral-300" aria-hidden="true" />
              <Link href="#" className="hover:text-neutral-900">
                Условия
              </Link>
            </div>

            <div className="flex items-center gap-4 text-neutral-500">
              <Link
                aria-label="Открыть наше сообщество в X"
                href="https://x.com"
                className="rounded-full border border-neutral-200 p-2 transition hover:border-neutral-300 hover:text-neutral-900"
              >
                <FiTwitter className="h-4 w-4" />
              </Link>
              <Link
                aria-label="Открыть наш профиль в LinkedIn"
                href="https://www.linkedin.com"
                className="rounded-full border border-neutral-200 p-2 transition hover:border-neutral-300 hover:text-neutral-900"
              >
                <FiLinkedin className="h-4 w-4" />
              </Link>
              <Link
                aria-label="Посмотреть код на GitHub"
                href="https://github.com"
                className="rounded-full border border-neutral-200 p-2 transition hover:border-neutral-300 hover:text-neutral-900"
              >
                <FiGithub className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </RootContainer>
    </footer>
  );
};

export default Footer;
