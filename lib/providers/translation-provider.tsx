'use client';

import { Resource, createInstance } from 'i18next';

import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import initTranslations, { i18nKeys } from '../i18n/i18n';

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: {
  children: ReactNode;
  locale: string;
  namespaces: i18nKeys;
  resources?: Resource;
}) {
  const i18n = createInstance();

  initTranslations({
    locale, 
    namespaces, 
    i18nInstance: i18n, 
    resources
  });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}