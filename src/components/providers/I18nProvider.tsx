"use client";
import { useEffect } from "react";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

export default function I18nProvider({ children, locale, resources }: { children: React.ReactNode, locale: string, resources: any }) {
  useEffect(() => {
    if (!i18n.hasResourceBundle(locale, 'common')) {
      i18n.addResourceBundle(locale, 'common', resources, true, true);
    }
    i18n.changeLanguage(locale);
  }, [locale, resources]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 