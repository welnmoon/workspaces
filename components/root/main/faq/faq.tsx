'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  BarChart3,
  Bell,
  CalendarRange,
  ChevronRight,
  ClipboardList,
  CreditCard,
  KanbanSquare,
  LayoutGrid,
  Plug,
  Search,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { CategoriesId, FAQ_CATEGORIES, faqData } from '@/const/root/faq-root';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const categoryIcons = {
  workspace: LayoutGrid,
  projects: KanbanSquare,
  sprints: CalendarRange,
  analytics: BarChart3,
  audit: ClipboardList,
  notifications: Bell,
  security: ShieldCheck,
  integrations: Plug,
  billing: CreditCard,
  troubleshooting: Wrench,
};

type CategoryId = keyof typeof categoryIcons;
type FaqCategoryMeta = (typeof FAQ_CATEGORIES)[number];

type FAQProps = {
  categories?: ReadonlyArray<FaqCategoryMeta>;
  variant?: 'home' | 'page';
  showSearch?: boolean;
  className?: string;
};

const FAQ = ({
  categories = FAQ_CATEGORIES,
  variant = 'home',
  showSearch,
  className,
}: FAQProps) => {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const enableSearch = showSearch ?? variant === 'page';

  const categoryIds = useMemo(
    () => categories.map((category) => category.id),
    [categories]
  );

  const filteredFaqData = useMemo(() => {
    const allowed = faqData.filter((category) =>
      categoryIds.includes(category.id as CategoriesId)
    );

    if (!normalized) return allowed;

    return allowed
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(normalized) ||
            item.answer.toLowerCase().includes(normalized)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categoryIds, normalized]);

  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id ?? FAQ_CATEGORIES[0].id
  );

  useEffect(() => {
    if (
      !filteredFaqData.find((category) => category.id === activeCategory)
    ) {
      setActiveCategory(filteredFaqData[0]?.id ?? '');
    }
  }, [filteredFaqData, activeCategory]);

  const currentQuestions = useMemo(() => {
    const active = filteredFaqData.find(
      (category) => category.id === activeCategory
    );
    return active?.items ?? [];
  }, [filteredFaqData, activeCategory]);

  const totalMatches = useMemo(
    () =>
      filteredFaqData.reduce((sum, category) => sum + category.items.length, 0),
    [filteredFaqData]
  );

  return (
    <section
      className={cn(
        variant === 'page' ? 'flex flex-col gap-6' : 'w-3/4 mx-auto',
        className
      )}
    >
      {variant === 'page' ? (
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200/60 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-8">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute -left-20 -bottom-24 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="relative flex flex-col gap-6">
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                FAQ
              </span>
              <Heading level={1} className="mt-3 text-3xl md:text-5xl">
                Ответы на вопросы о работе в Worknest
              </Heading>
              <p className="mt-4 text-lg text-zinc-600">
                Быстрый поиск по возможностям продукта: проекты, спринты,
                аналитика, безопасность и биллинг.
              </p>
            </div>
            {enableSearch && (
              <div className="max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск по вопросам или ответам"
                    className="h-11 pl-10 bg-white"
                  />
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  {normalized
                    ? `Найдено: ${totalMatches} совпадений`
                    : `Категории: ${FAQ_CATEGORIES.length}`}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <span className="font-semibold text-zinc-500">FAQ</span>
          <Heading level={1} className="mb-4 mt-4">
            Частые вопросы о Worknest
          </Heading>
          <span className="text-zinc-500 text-xl">
            Ответы про пространства, проекты, роли и уведомления в одном месте.
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        <div
          className={cn(
            'flex flex-col gap-2 py-4 pr-4 rounded-md w-full',
            variant === 'page' ? 'lg:w-[35%]' : 'lg:w-[45%]'
          )}
        >
          {categories.map((category) => {
            const Icon = categoryIcons[category.id as CategoryId];
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'flex items-center justify-between rounded-md border border-zinc-200 px-3 py-3 text-left transition',
                  activeCategory === category.id &&
                    'bg-zinc-200 border-zinc-400'
                )}
              >
                <span className="flex items-center gap-2 text-[18px] px-2">
                  <Icon className="h-4 w-4" />
                  {category.title}
                </span>
                {activeCategory === category.id && (
                  <ChevronRight className="text-zinc-600" size={15} />
                )}
              </button>
            );
          })}
        </div>

        <Accordion
          type="single"
          collapsible
          className={cn(
            'w-full border border-zinc-200 rounded-md my-4 lg:h-fit xl:h-auto'
          )}
          defaultValue={currentQuestions[0]?.id}
        >
          {currentQuestions.map((q) => (
            <AccordionItem
              className="px-4 last:border-b-0"
              key={q.id}
              value={q.id}
            >
              <AccordionTrigger className="text-md text-zinc-900 text-[18px]">
                {q.question}
              </AccordionTrigger>
              <AccordionContent className="transition duration-300 ease-in-out text-zinc-500 text-[16px]">
                {q.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
          {currentQuestions.length === 0 && (
            <div className="py-10 text-center text-sm text-zinc-500">
              Ничего не найдено. Попробуйте другой запрос.
            </div>
          )}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
