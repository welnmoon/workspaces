'use client';

import { Heading } from '@/components/ui/heading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQ_CATEGORIES, faqData } from '@/const/root/faq';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { FaqCategory } from '@/types/faq';
import {
  Bell,
  ChevronRight,
  CreditCard,
  KanbanSquare,
  LayoutGrid,
} from 'lucide-react';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<FaqCategory['id']>(
    FAQ_CATEGORIES[0].id
  );
  const [currentQuestions, setCurrentQuestions] = useState(faqData[0].items);

  useEffect(() => {
    setCurrentQuestions(
      () =>
        faqData.find((category) => category.id === activeCategory)?.items || []
    );
  }, [activeCategory]);

  const categoryIcons = useMemo(
    () => ({
      workspace: LayoutGrid,
      projects: KanbanSquare,
      notifications: Bell,
      billing: CreditCard,
    }),
    []
  );
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
        {/*Right Side - categories*/}
        <div className="flex flex-col gap-2 py-4 pr-4 rounded-md w-full lg:w-[45%]">
          {FAQ_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className={cn(
                'px-3 py-3 rounded-md border border-zinc-200 cursor-pointer',
                activeCategory === category.id && 'bg-zinc-200 border-zinc-400'
              )}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="flex items-center justify-between text-[18px] gap-2 px-2">
                <span className="flex items-center gap-2">
                  {(() => {
                    const Icon = categoryIcons[category.id];
                    return <Icon className="h-4 w-4 " />;
                  })()}
                  {category.title}
                </span>
                {activeCategory === category.id && (
                  <ChevronRight className="text-zinc-600" size={15} />
                )}
              </span>
            </div>
          ))}
        </div>
        {/*Left Side - questions*/}
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
              className="px-4 last:border-b-0 "
              key={q.id}
              value={q.id}
            >
              <AccordionTrigger className="text-md  text-zinc-900 text-[18px]">
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

export default FAQ;
