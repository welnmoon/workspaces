'use client';

import { useEffect, useMemo, useState } from 'react';
import { FAQ_CATEGORIES, faqData } from '@/const/root/faq-root';
import { cn } from '@/lib/utils';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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

const FAQPage = () => {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalized) return faqData;
    return faqData
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(normalized) ||
            item.answer.toLowerCase().includes(normalized)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [normalized]);

  const [activeCategory, setActiveCategory] = useState<string>(
    faqData[0]?.id ?? ''
  );

  useEffect(() => {
    if (
      !filteredCategories.find((category) => category.id === activeCategory)
    ) {
      setActiveCategory(filteredCategories[0]?.id ?? '');
    }
  }, [filteredCategories, activeCategory]);

  const currentQuestions = useMemo(() => {
    const active = filteredCategories.find(
      (category) => category.id === activeCategory
    );
    return active?.items ?? [];
  }, [filteredCategories, activeCategory]);

  const totalMatches = useMemo(
    () =>
      filteredCategories.reduce(
        (sum, category) => sum + category.items.length,
        0
      ),
    [filteredCategories]
  );

  return (
    <main className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/60 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-8">
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
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-zinc-200/70 bg-white p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
            Категории
          </p>
          <div className="flex flex-col gap-2">
            {filteredCategories.map((category) => {
              const Icon = categoryIcons[category.id as CategoryId];
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'flex items-center justify-between rounded-xl border px-3 py-3 text-left transition',
                    activeCategory === category.id
                      ? 'border-zinc-400 bg-zinc-100'
                      : 'border-zinc-200 hover:border-zinc-300'
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-zinc-800">
                    <Icon className="h-4 w-4 text-zinc-600" />
                    {category.title}
                  </span>
                  {activeCategory === category.id && (
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/70 bg-white p-4">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={currentQuestions[0]?.id}
          >
            {currentQuestions.map((q) => (
              <AccordionItem
                key={q.id}
                value={q.id}
                className="px-2 last:border-b-0"
              >
                <AccordionTrigger className="text-base text-zinc-900">
                  {q.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-zinc-500">
                  {q.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {currentQuestions.length === 0 && (
            <div className="py-10 text-center text-sm text-zinc-500">
              Ничего не найдено. Попробуйте другой запрос.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default FAQPage;
