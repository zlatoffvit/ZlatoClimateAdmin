import { Config } from 'next-i18n-router/dist/types';

export const i18nConfig: Config = {
  locales: ['ru', 'en', 'uk'],
  defaultLocale: 'ru',
  localeDetector: false,
};