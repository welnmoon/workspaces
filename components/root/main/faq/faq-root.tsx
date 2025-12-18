'use client';

import { useEffect, useMemo, useState } from 'react';
import { FAQ_CATEGORIES, faqData } from '@/const/root/faq-root';
import { CategoriesId } from '@/const/root/faq-root';
import { cn } from '@/lib/utils';
import { Heading } from '@/components/ui/heading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  BarChart3,
  CalendarRange,
  ChevronRight,
  ClipboardList,
  KanbanSquare,
} from 'lucide-react';

const categoryIcons = {
  projects: KanbanSquare,
  sprints: CalendarRange,
  analytics: BarChart3,
  audit: ClipboardList,
};

type CategoryId = keyof typeof categoryIcons;

const FaqRoot = () => {
  const rootCategories = useMemo(
    () =>
      FAQ_CATEGORIES.filter(
        (c) =>
          c.id === 'sprints' ||
          c.id === 'audit' ||
          c.id === 'analytics' ||
          c.id === 'projects'
      ),
    []
  );

  const categoryIds = useMemo(
    () => rootCategories.map((category) => category.id),
    [rootCategories]
  );

  const filteredFaqData = useMemo(
    () =>
      faqData.filter((category) =>
        categoryIds.includes(category.id as CategoriesId)
      ),
    [categoryIds]
  );

  const [activeCategory, setActiveCategory] = useState<string>(
    rootCategories[0]?.id ?? ''
  );
  const [currentQuestions, setCurrentQuestions] = useState(
    filteredFaqData[0]?.items ?? []
  );

  useEffect(() => {
    setCurrentQuestions(
      () =>
        filteredFaqData.find((category) => category.id === activeCategory)
          ?.items || []
    );
  }, [activeCategory, filteredFaqData]);

  return (
    <section className="w-3/4 mx-auto">
      <div className="mb-6">
        <span className="font-semibold text-zinc-500">FAQ</span>
        <Heading level={1} className="mb-4 mt-4">
          Частые вопросы о Worknest
        </Heading>
        <span className="text-zinc-500 text-xl">
          Ответы про пространства, проекты, роли и уведомления в одном месте.
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col gap-2 py-4 pr-4 rounded-md w-full lg:w-[45%]">
          {rootCategories.map((category) => {
            const Icon = categoryIcons[category.id as CategoryId];
            return (
              <div
                key={category.id}
                className={cn(
                  'px-3 py-3 rounded-md border border-zinc-200 cursor-pointer',
                  activeCategory === category.id &&
                    'bg-zinc-200 border-zinc-400'
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="flex items-center justify-between text-[18px] gap-2 px-2">
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {category.title}
                  </span>
                  {activeCategory === category.id && (
                    <ChevronRight className="text-zinc-600" size={15} />
                  )}
                </span>
              </div>
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
        </Accordion>
      </div>
    </section>
  );
};

export default FaqRoot;
