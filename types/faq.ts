export type FaqItem = {
  id: string; // 'booking-1'
  question: string; // 'How do I make a booking?'
  answer: string; // Текст ответа
};

// Категория слева (General Questions, Miscellaneous и т.п.)
export type FaqCategory = {
  id: string; // 'general', 'misc', ...
  title: string; // 'General Questions'
  items: FaqItem[]; // список вопросов справа
};

// Весь объект с данными для аккордеона
export type FaqData = FaqCategory[];
