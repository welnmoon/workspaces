import ruButtons from './locales/ru/buttons.json';
import enButtons from './locales/en/buttons.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: { buttons: ruButtons },
  en: { buttons: enButtons },
};

i18n.use(initReactI18next).init({
  resources,
  ns: ['buttons'],
  defaultNS: 'buttons',
  fallbackLng: 'ru',
});

export default i18n;
