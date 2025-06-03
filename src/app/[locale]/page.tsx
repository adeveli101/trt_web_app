// src/app/[locale]/page.tsx
// categoriesData importu burada kalabilir, eğer Home içinde kullanılacaksa veya başka bir amaç için.
import categoriesData from '@/lib/data/categories.json';
import Home from './Home';


export default async function Page({ params }: { params: { locale: string } }) {

  return <Home />;
}