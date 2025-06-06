import { Resource, createInstance, i18n } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";

import { initReactI18next } from "react-i18next/initReactI18next";
import { i18nConfig } from "./i18n-config";
import { i18nkeys } from "./i18n-keys";

export type i18nKeys = typeof i18nkeys;
export const i18nNamespaces: i18nKeys = i18nkeys;

interface initTranslationsProps {
  locale: string,
  namespaces: i18nKeys,
  i18nInstance?: i18n,
  resources?: Resource;
}

export default async function initTranslations({
  locale,
  namespaces,
  i18nInstance,
  resources
}: initTranslationsProps) {
  const ns = namespaces?.length > 0 ? namespaces : i18nNamespaces;
  const defaultNS = ns[0] ?? "common";
  i18nInstance = i18nInstance || createInstance();
  i18nInstance.use(initReactI18next);
  i18nInstance.setDefaultNamespace(defaultNS);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/locales/${language}/${namespace}.json`)
      )
    );
  }

  await i18nInstance.init({
    ns,
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS,
    fallbackNS: defaultNS,
    preload: resources ? [] : i18nConfig.locales,
    interpolation: {
      escapeValue: false,
    },
  });

  return {
    t: i18nInstance.t,
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
  };
}