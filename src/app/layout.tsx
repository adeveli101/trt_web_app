// src/app/layout.tsx
// Bu dosya, Next.js uygulamanızın en üst seviye (root) layout'udur.
// Tüm sayfalar ve dil tabanlı layout'lar bu layout'un içinde render edilir.

import { ReactNode } from 'react';

// Global CSS dosyalarınızı buraya import edin.
// Bu CSS dosyaları tüm uygulamayı etkileyecektir.
import './globals.css';
import './theme.css';

// Next.js'in font optimizasyonunu kullanmak için Geist fontlarını içe aktarın.
// Bu fontlar `globals.css` veya `theme.css` içinde tanımlanmamışsa,
// burada tanımlanmaları ve `<body>` etiketine uygulanmaları gerekir.
// Eğer zaten CSS içinde tanımlandıysa, bu importlara burada ihtiyacınız olmayabilir.
// Ancak genellikle fontları burada tanımlayıp CSS değişkenleri olarak kullanmak iyi bir uygulamadır.
import { Geist, Geist_Mono } from "next/font/google";
import metadataJson from '../../metadata.json';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// metadata.json'dan alınan bilgiler
export const metadata = {
    title: metadataJson.name,
    description: metadataJson.description
};

function getLocaleFromPath(pathname: string): string {
  // Varsayılan: /tr/xyz veya /en/xyz gibi bir path
  const supported = ['tr','en','de','fr','es','it'];
  const seg = pathname.split('/')[1];
  return supported.includes(seg) ? seg : 'en';
}

// RootLayout bileşeni. Tüm çocuk bileşenleri (pages, layouts) burada render edilir.
export default function RootLayout({ children }: { children: ReactNode }) {
    return children;
}
