"use client";
import { useRouter } from "next/navigation";
import CategoryPage from "./CategoryPage";
import categoriesData from "@/lib/data/categories.json";

export default function CategoryPageClientWrapper({ categoryObj, locale }: { categoryObj: any, locale: string }) {
  const router = useRouter();
  return (
    <CategoryPage
      category={categoryObj.key}
      locale={locale}
      categoriesData={categoriesData}
      onSelect={(spreadKey) => {
        router.push(`/${locale}/reading/category/${categoryObj.key}/spread/${spreadKey}`);
      }}
    />
  );
} 