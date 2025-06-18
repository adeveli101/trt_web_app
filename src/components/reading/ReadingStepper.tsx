"use client";
import React from "react";
import { useRouter, useParams } from 'next/navigation';
import CategorySelect from "@/components/reading/category/CategorySelect";
import SpreadSelect from "./SpreadSelect";
import CardSelect from "./CardSelect";
import StepperBar from "./StepperBar";
import { SpreadType } from "../../lib/tarotTypes";
import { AnimatePresence, motion } from "framer-motion";
import spreadsData from "@/lib/data/spreads.json";
import tarotCardsData from "@/lib/data/tarot_cards_en.json";
import { TarotCard } from "../../lib/tarotTypes";
import SingleCardSpread from './spreads/SingleCardSpread';
import PastPresentFutureSpread from './spreads/PastPresentFutureSpread';
import FiveCardPathSpread from './spreads/FiveCardPathSpread';
import HorseshoeSpread from './spreads/HorseshoeSpread';
import RelationshipSpread from './spreads/RelationshipSpread';
import CelticCrossSpread from './spreads/CelticCrossSpread';
import YearlySpread from './spreads/YearlySpread';
import DefaultSpread from './spreads/DefaultSpread';
import { spreadCategoryMap } from "@/lib/data/spreadCategoryMap";
import UnveilButton from "./UnveilButton";
import IntentionStep from "./IntentionStep";
import CosmicBackground from "@/components/layout/CosmicBackground";

export default function ReadingStepper({ initialCategory, steps, translations, showStepperBar = true }: { initialCategory?: string, steps: any[], translations: any, showStepperBar?: boolean }) {
  const router = useRouter();
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale ?? "en";
  const category = Array.isArray(params.category) ? params.category[0] : params.category;
  const spread = Array.isArray(params.spread) ? params.spread[0] : params.spread;

  // Step logic: 0=category, 1=spread, 2=intention, 3=cards, 4=overview
  let step: 0 | 1 | 2 | 3 | 4 = 0;
  if (category && !spread) step = 1;
  if (category && spread && !window?.location?.pathname.includes('/intention')) step = 2;
  if (category && spread && window?.location?.pathname.includes('/intention') && !window?.location?.pathname.includes('/cards')) step = 2;
  if (category && spread && window?.location?.pathname.includes('/intention/cards') && !window?.location?.pathname.includes('/overview')) step = 3;
  if (category && spread && window?.location?.pathname.includes('/intention/cards/overview')) step = 4;

  const spreadInfo = spread ? spreadsData.find(s => s.key === spread) : undefined;
  const cardCount = spreadInfo?.cardCount || 0;
  const [selectedCards, setSelectedCards] = React.useState<TarotCard[]>([]);
  const [revealed, setRevealed] = React.useState(false);
  const [revealing, setRevealing] = React.useState(false);
  const [starAnim, setStarAnim] = React.useState(false);
  const [showUnveilInfo, setShowUnveilInfo] = React.useState(false);
  const [prompt, setPrompt] = React.useState<string | null>(null);
  const [promptStepActive, setPromptStepActive] = React.useState(false);
  const tarotCards: TarotCard[] = tarotCardsData.cards;

  const spreadCategory = spread ? spreadCategoryMap[spread] : category;

  function handleCategorySelect(cat: string) {
    router.push(`/en/reading/category/${cat}`);
  }
  function handleSpreadSelect(spreadObj: any) {
    if (category) {
      // IntentionStep'e geçiş
      router.push(`/${locale}/reading/category/${category}/spread/${spreadObj.name}/intention`);
      setPromptStepActive(true);
    }
  }
  function handlePromptContinue(userPrompt: string) {
    setPrompt(userPrompt);
    setPromptStepActive(false);
    // Kart seçimine geç
    router.push(`/${locale}/reading/category/${category}/spread/${spread}/cards`);
  }
  function handlePromptSkip() {
    setPrompt("");
    setPromptStepActive(false);
    router.push(`/${locale}/reading/category/${category}/spread/${spread}/cards`);
  }

  function handleStepChange(newStep: 0 | 1 | 2 | 3) {
    if (newStep === 0) router.push(`/${locale}/reading`);
    else if (newStep === 1 && spreadCategory) router.push(`/${locale}/reading/category/${spreadCategory}`);
    else if (newStep === 2 && spreadCategory && spread) router.push(`/${locale}/reading/category/${spreadCategory}/spread/${spread}/intention`);
    else if (newStep === 3 && spreadCategory && spread) router.push(`/${locale}/reading/category/${spreadCategory}/spread/${spread}/cards`);
  }

  function handleCardSelect(card: TarotCard) {
    if (selectedCards.some((c) => c.name === card.name)) return;
    if (selectedCards.length < cardCount) {
      setSelectedCards([...selectedCards, card]);
    }
  }

  function handleUnveil() {
    setStarAnim(true);
    setShowUnveilInfo(true);
    setRevealed(false);
    setSelectedCards([]);
    setTimeout(() => {
      const available = [...tarotCards];
      const shuffled = available.sort(() => Math.random() - 0.5);
      setSelectedCards(shuffled.slice(0, cardCount));
      setTimeout(() => setRevealed(true), 400);
    }, 200);
    setTimeout(() => setStarAnim(false), 1200);
    setTimeout(() => setShowUnveilInfo(false), 2000);
  }

  const renderSpreadLayout = () => {
    const cardsForLayout = selectedCards.map((card, i) => ({ ...card, _animIndex: i }));
    switch (spreadInfo?.key) {
      case "singleCard":
        return <SingleCardSpread selectedCards={cardsForLayout} />;
      case "pastPresentFuture":
        return <PastPresentFutureSpread selectedCards={cardsForLayout} meaningTitles={[
          'Past', 'Present', 'Future'
        ]} />;
      case "problemSolution":
        return <PastPresentFutureSpread selectedCards={cardsForLayout} meaningTitles={[
          'Problem', 'Advice', 'Solution'
        ]} />;
      case "mindBodySpirit":
        return <PastPresentFutureSpread selectedCards={cardsForLayout} meaningTitles={[
          'Mind', 'Body', 'Spirit'
        ]} />;
      case "dreamInterpretation":
        return <PastPresentFutureSpread selectedCards={cardsForLayout} meaningTitles={[
          'Past', 'Present', 'Future'
        ]} />;
      case "fiveCardPath":
        return <FiveCardPathSpread selectedCards={cardsForLayout} meaningTitles={[
          'Current Situation', 'Obstacles', 'Best Outcome', 'Foundation', 'Potential'
        ]} />;
      case "horseshoeSpread":
        return <HorseshoeSpread selectedCards={cardsForLayout} meaningTitles={[
          'Past', 'Present', 'Future', 'Goals/Fears', 'External Influences', 'Advice', 'Outcome'
        ]} />;
      case "relationshipSpread":
        return <RelationshipSpread selectedCards={cardsForLayout} meaningTitles={[
          'You', 'Partner', 'Relationship', 'Strengths', 'Weaknesses', 'Actions Needed', 'Outcome'
        ]} />;
      case "celticCross":
        return <CelticCrossSpread selectedCards={cardsForLayout} meaningTitles={[
          'You', 'Crosses', 'Crowns', 'Before', 'Behind', 'Beneath', 'Attitude', 'People', 'Hopes/Fears', 'Outcome'
        ]} />;
      case "yearlySpread":
        return <YearlySpread selectedCards={cardsForLayout} meaningTitles={[
          'Summary', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ]} />;
      default:
        return <DefaultSpread selectedCards={cardsForLayout} />;
    }
  };

  return (
    <div className="relative">
      <CosmicBackground />
      {showStepperBar && (
        <div className="sticky top-0 z-40 bg-[var(--primary-color)]/90 backdrop-blur rounded-b-xl">
          <StepperBar step={step} onStepChange={handleStepChange} steps={steps} categorySelected={!!spreadCategory} category={typeof spreadCategory === 'string' ? spreadCategory : (Array.isArray(spreadCategory) ? spreadCategory[0] : '')} />
        </div>
      )}
      <div className="relative flex flex-col pb-32 min-h-screen">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="category" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.3 }} className="animate-fade-in flex-1 flex flex-col">
              <CategorySelect onSelect={handleCategorySelect} />
              <div className="flex-1" />
            </motion.div>
          )}
          {step === 1 && spreadCategory && (
            <motion.div key="spread" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="animate-fade-in flex-1 flex flex-col">
              <SpreadSelect category={category || ''} onSelect={handleSpreadSelect} onBack={() => router.push(`/${locale}/reading`)} />
              <div className="flex-1" />
            </motion.div>
          )}
          {step === 2 && spreadCategory && spread && (
            <motion.div key="intention" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.3 }} className="animate-fade-in flex-1 flex flex-col items-center">
              <IntentionStep
                locale={locale || 'en'}
                translations={translations}
                category={category || ''}
                spread={spread || ''}
                error={null}
                maxLength={200}
              />
              <div className="flex-1" />
            </motion.div>
          )}
          {step === 3 && spread && spreadInfo && (
            <motion.div key="cards" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.3 }} className="animate-fade-in flex-1 flex flex-col items-center">
              {/* Spread info (image, label, desc) - sadece kartlar seçilmeden önce veya loading sırasında göster */}
              {(!revealed && !revealing) && (
                <div className="flex flex-col items-center mb-6">
                  <img src={spreadInfo.image} alt={spreadInfo.label} className="mb-2 w-full max-w-md rounded-xl shadow-xl border-2 border-yellow-400" />
                  <h2 className="text-xl font-bold mb-1 text-accent-gold drop-shadow-lg">{spreadInfo.label}</h2>
                  <p className="text-base text-gray-100 text-center mb-2">{spreadInfo.desc}</p>
                </div>
              )}
              {/* Kartlar seçilirken loading animasyonu */}
              {revealing && (
                <div className="flex flex-col items-center justify-center min-h-[180px] my-12">
                  <img src="/images/cardsRevealing.gif" alt="Revealing cards..." className="w-80 h-56 object-contain rounded-2xl shadow-lg" />
                  <span className="mt-4 text-yellow-200 text-base text-center">The cards are being unveiled. Please wait...</span>
                </div>
              )}
              {/* Kart seçimi ve spread yerleşimi */}
              {!revealed && !revealing && (
                <CardSelect
                  spread={{ name: spreadInfo.key, cardCount: spreadInfo.cardCount }}
                  selectedCards={selectedCards}
                  setSelectedCards={setSelectedCards}
                  translations={translations}
                  onRevealStart={() => setRevealing(true)}
                  onRevealComplete={() => { setRevealing(false); setRevealed(true); }}
                />
              )}
              {revealed && (
                <>
                  <div className="w-full mt-8">
                    {renderSpreadLayout()}
                  </div>
                  <div className="flex justify-center mt-8">
                    <UnveilButton
                      label={translations.reading_unveil_button}
                      onClick={() => router.push(`/${locale}/reading/category/${category}/spread/${spread}/cards/overview`)}
                      disabled={selectedCards.length < cardCount}
                      backgroundImage="/images/buttons/unveilTheStars_btn.png"
                    />
                  </div>
                </>
              )}
              <div className="flex-1" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 