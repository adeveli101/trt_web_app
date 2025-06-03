// src/app/[locale]/layout.tsx
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import getRequestConfig from '../../i18n/request';
import ClientLayout from '@/components/layout/ClientLayout';
import '../theme.css';

const SUPPORTED_LOCALES = ['en', 'de', 'es', 'fr', 'it', 'tr'];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // Next.js'in hata mesajına göre params'ı beklemeliyiz.
  const { locale } = await params;
  console.log('LAYOUT LOCALE:', locale);

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  // DÜZELTME BURADA: getRequestConfig'e Promise.resolve(locale) olarak geçirmeliyiz.
  // TypeScript hatası, 'requestLocale'in Promise<string | undefined> beklediğini söylüyor.
  const { messages } = await getRequestConfig({ requestLocale: Promise.resolve(locale) });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}