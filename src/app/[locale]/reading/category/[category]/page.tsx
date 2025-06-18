import CategoryPageClientWrapper from '@/components/reading/category/CategoryPageClientWrapper';
import categoriesData from '@/lib/data/categories.json';
import spreadsData from '@/lib/data/spreads.json';
import StepperBarClientWrapper from '@/components/reading/StepperBarClientWrapper';
import React from 'react';

export async function generateMetadata(props: { params: { locale: string, category: string } }) {
  const params = await props.params;
  const category = params.category;
  const locale = params.locale;
  const categoryObj = categoriesData.find((cat: any) => cat.key === category);
  if (!categoryObj) {
    return {
      title: 'Category not found | Astral Tarot',
      description: 'Requested category could not be found.'
    };
  }
  return {
    title: `${categoryObj.label} Tarot | Astral Tarot`,
    description: categoryObj.insight
  };
}

export default async function Page(props: { params: { locale: string, category: string } }) {
  const params = await props.params;
  const category = params.category;
  const locale = params.locale;
  const categoryObj = categoriesData.find((cat: any) => cat.key === category);
  if (!categoryObj) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">Category not found.</div>;
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2a1746] via-[#3a1053] to-[var(--bg-color)] w-full">
      <div className="sticky top-0 z-40 w-full">
        <StepperBarClientWrapper
          categorySelected={true}
          category={categoryObj.key}
          locale={locale}
          spread={''}
        />
      </div>
      <div className="flex-1 w-full flex flex-col justify-center px-0">
        <div className="flex flex-col items-center mt-8">
          <CategoryPageClientWrapper categoryObj={categoryObj} locale={locale} />
        </div>
      </div>
    </div>
  );
} 