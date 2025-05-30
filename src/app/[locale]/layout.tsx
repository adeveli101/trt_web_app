import { ReactNode } from "react";
import I18nProvider from "@/components/providers/I18nProvider";
import ClientLayout from "@/components/layout/ClientLayout";

// Statik import map
const TRANSLATIONS: Record<string, any> = {
  en: () => import('@/locales/en/common.json'),
  tr: () => import('@/locales/tr/common.json'),
  de: () => import('@/locales/de/common.json'),
  es: () => import('@/locales/es/common.json'),
  fr: () => import('@/locales/fr/common.json'),
  it: () => import('@/locales/it/common.json'),
};

export default async function LocaleLayout({ children, params }: { children: ReactNode, params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    let translations: any = {};
    try {
        translations = (await (TRANSLATIONS[locale] ? TRANSLATIONS[locale]() : TRANSLATIONS['en']())).default;
    } catch {
        translations = (await TRANSLATIONS['en']()).default;
    }
    return (
        <I18nProvider locale={locale} resources={translations}>
                <ClientLayout>
                    {children}
                </ClientLayout>
        </I18nProvider>
    );
}