"use client";
import { useRouter } from 'next/navigation';
import CardSelectionClientWrapper from '@/components/reading/CardSelectionClientWrapper';

export default function CardSelectionClientWrapperClient({
  spreadCardCount,
  label,
  positionDescription,
  cardSize,
  translations,
  spreadKey,
  image,
  desc,
  locale,
  category,
  spread
}: {
  spreadCardCount: number;
  label?: string;
  positionDescription?: string;
  cardSize?: 'sm' | 'lg';
  translations: any;
  spreadKey: string;
  image?: string;
  desc?: string;
  locale: string;
  category: string;
  spread: string;
}) {
  const router = useRouter();
  function handleNextStep() {
    router.push(`/${locale}/reading/category/${category}/spread/${spread}/intention/cards/overview`);
  }
  return (
    <CardSelectionClientWrapper
      spreadCardCount={spreadCardCount}
      label={label}
      positionDescription={positionDescription}
      cardSize={cardSize}
      translations={translations}
      spreadKey={spreadKey}
      image={image}
      desc={desc}
      onNextStep={handleNextStep}
    />
  );
} 