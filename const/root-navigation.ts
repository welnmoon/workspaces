export const navSections: {
  title: string;
  info: {
    title: string;
    description: string;
    img: string;
  };
  links: { label: string; href: string }[];
}[] = [
  {
    title: 'Продукт',
    info: {
      title: 'Инструменты для команд',
      description:
        'Управляйте задачами, проектами и целями в едином гибком рабочем пространстве.',
      img: '/images/navigation/product.png',
    },
    links: [
      { label: 'Дашборды', href: '#' },
      { label: 'Управление задачами', href: '#' },
      { label: 'Автоматизации', href: '#' },
      { label: 'Интеграции', href: '#' },
    ],
  },
  {
    title: 'Ресурсы',
    info: {
      title: 'База знаний и материалы',
      description:
        'Подборка гайдов, поддержка и шаблоны, чтобы быстрее освоить Worknest.',
      img: '/images/navigation/resources.png',
    },
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Центр поддержки', href: '#' },
      { label: 'API и вебхуки', href: '#' },
      { label: 'Шаблоны команд', href: '#' },
      { label: 'Блог о продуктивности', href: '#' },
    ],
  },
  {
    title: 'Компания',
    info: {
      title: 'Команда Worknest',
      description:
        'Узнайте больше о нашей миссии, безопасности сервиса и карьерных возможностях.',
      img: '/images/navigation/company.png',
    },
    links: [
      { label: 'О нас', href: '#' },
      { label: 'Безопасность', href: '#' },
      { label: 'Контакты', href: '#' },
      { label: 'Вакансии', href: '#' },
    ],
  },
  {
    title: 'Юридическое',
    info: {
      title: 'Политики и документы',
      description:
        'Все юридические материалы: условия использования, обработка данных и cookies.',
      img: '/images/navigation/legal.png',
    },
    links: [
      { label: 'Конфиденциальность', href: '#' },
      { label: 'Условия использования', href: '#' },
      { label: 'Обработка данных', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
];
