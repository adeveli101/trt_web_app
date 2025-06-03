// src/i18n/request.ts
import { notFound } from 'next/navigation';

const locales = ['en', 'de', 'es', 'fr', 'it', 'tr'];
const defaultLocale = 'tr';

async function loadMessages(locale: string): Promise<any> {
    try {
        const messages = (await import(`../locales/${locale}/common.json`)).default;
        return messages;
    } catch (error) {
        console.error(`Error loading messages for locale ${locale} from src/locales:`, error);
        return null;
    }
}

export default async function getRequestConfig({ requestLocale }: { requestLocale: Promise<string> }) {
    const locale = await requestLocale;
    console.log('request.ts - getRequestConfig - Incoming requestLocale:', locale);

    if (!locales.includes(locale)) {
        console.error(`request.ts - getRequestConfig - notFound() triggered for invalid locale: ${locale}`);
        notFound();
    }

    let loadedMessages = await loadMessages(locale);

    if (!loadedMessages) {
        console.warn(`Messages for ${locale} not found, returning empty object for 'common' namespace.`);
        loadedMessages = {};
    }

    return {
        locale,
        messages: {
            common: loadedMessages,
        }
    };
}