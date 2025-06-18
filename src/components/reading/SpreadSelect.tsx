"use client";
import React, { useState } from "react";
import { SpreadType } from "../../lib/tarotTypes";
import { FiInfo } from 'react-icons/fi';
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import StepperBarClientWrapper from "./StepperBarClientWrapper";
import { useParams } from "next/navigation";
import { spreadCategoryMap } from "@/lib/data/spreadCategoryMap";
import SectionHeading from "@/components/ui/SectionHeading";
import CosmicBackground from "@/components/layout/CosmicBackground";

const allSpreads: SpreadType[] = [
  { name: "singleCard", cardCount: 1 },
  { name: "pastPresentFuture", cardCount: 3 },
  { name: "problemSolution", cardCount: 3 },
  { name: "fiveCardPath", cardCount: 5 },
  { name: "relationshipSpread", cardCount: 7 },
  { name: "celticCross", cardCount: 10 },
  { name: "yearlySpread", cardCount: 13 },
  { name: "mindBodySpirit", cardCount: 3 },
  { name: "astroLogicalCross", cardCount: 5 },
  { name: "brokenHeart", cardCount: 5 },
  { name: "dreamInterpretation", cardCount: 3 },
  { name: "horseshoeSpread", cardCount: 7 },
  { name: "careerPathSpread", cardCount: 5 },
  { name: "fullMoonSpread", cardCount: 6 },
  { name: "categoryReading", cardCount: 3 },
];

const spreadDetails: Record<string, { title: string; desc: string; longDesc: string; positions: string[] }> = {
  singleCard: {
    title: "Single Card",
    desc: "Tek bir kartla hızlı ve öz bir rehberlik alın.",
    longDesc: "Bu açılımda yalnızca bir kart seçilir ve sorunuz ya da genel enerjiniz için kısa, net bir mesaj sunar. Hızlı kararlar, günlük rehberlik veya genel bir tema için idealdir.",
    positions: ["Card"],
  },
  pastPresentFuture: {
    title: "Past - Present - Future",
    desc: "Geçmiş, şimdi ve geleceğe dair klasik üç kart açılımı.",
    longDesc: "Bu klasik açılım, bir konunun geçmiş kökenlerini, mevcut durumunu ve olası geleceğini analiz eder. Zaman akışı ve gelişim görmek isteyenler için uygundur.",
    positions: ["Past", "Present", "Future"],
  },
  problemSolution: {
    title: "Problem - Solution",
    desc: "Bir sorunun kökeni ve çözümü için üç kart.",
    longDesc: "Bir problemi, nedenini ve çözüm yolunu net şekilde görmek için kullanılır. Özellikle belirli bir sorun veya engel için rehberlik arayanlara önerilir.",
    positions: ["Problem", "Reason", "Solution"],
  },
  fiveCardPath: {
    title: "Five Card Path",
    desc: "Hayat yolculuğunuzun beş önemli aşaması.",
    longDesc: "Bu açılım, mevcut durumdan başlayarak engelleri, temelleri, potansiyeli ve en iyi sonucu analiz eder. Hayat yolculuğunda yön arayanlar için uygundur.",
    positions: ["Current Situation", "Obstacles", "Best Outcome", "Foundation", "Potential"],
  },
  relationshipSpread: {
    title: "Relationship Spread",
    desc: "İlişki dinamiklerini ve potansiyelini analiz edin.",
    longDesc: "İlişkilerdeki iki tarafın bakış açısı, ilişkinin temeli, güçlü ve zayıf yönleri ile olası sonuçları detaylıca inceler. Aşk ve ortaklıklar için idealdir.",
    positions: ["You", "Partner", "Relationship", "Strengths", "Weaknesses", "Actions Needed", "Outcome"],
  },
  celticCross: {
    title: "Celtic Cross",
    desc: "Kapsamlı ve derinlemesine klasik açılım.",
    longDesc: "Tarotun en kapsamlı açılımlarından biri olan Celtic Cross, bir durumu çok boyutlu olarak analiz eder. Geçmiş, bilinçaltı, dış etkenler ve olası sonuçlar gibi birçok pozisyon içerir.",
    positions: ["Current Situation", "Challenge", "Subconscious", "Past", "Possible Future", "Near Future", "Personal Stance", "External Influences", "Hopes/Fears", "Final Outcome"],
  },
  yearlySpread: {
    title: "Yearly Spread",
    desc: "Yılın her ayı için bir kart ve genel özet.",
    longDesc: "Her ay için bir kart çekilerek yılın temaları, fırsatları ve zorlukları öngörülür. Yıllık planlama ve genel bakış için uygundur.",
    positions: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Yearly Summary"],
  },
  mindBodySpirit: {
    title: "Mind - Body - Spirit",
    desc: "Zihin, beden ve ruhun bütünsel dengesi.",
    longDesc: "Zihinsel, fiziksel ve ruhsal durumunuzu ayrı ayrı analiz eder. Kişisel denge ve bütünlük arayanlar için önerilir.",
    positions: ["Mind", "Body", "Spirit"],
  },
  astroLogicalCross: {
    title: "Astrological Cross",
    desc: "Astrolojik temalarla derin analiz.",
    longDesc: "Kimlik, duygular, dış etkenler, zorluklar ve kader gibi astrolojik temaları tarot ile birleştirir. Derin içgörü ve kişisel analiz için uygundur.",
    positions: ["Identity", "Emotional State", "External Influences", "Challenges", "Destiny"],
  },
  brokenHeart: {
    title: "Broken Heart",
    desc: "Duygusal iyileşme ve yeni başlangıçlar için.",
    longDesc: "Ayrılık, kayıp veya kalp kırıklığı sonrası iyileşme sürecini analiz eder. Acının kaynağı, duygusal yaralar ve iyileşme yolları üzerine odaklanır.",
    positions: ["Source of Pain", "Emotional Wounds", "Inner Conflict", "Healing Process", "New Beginning"],
  },
  dreamInterpretation: {
    title: "Dream Interpretation",
    desc: "Rüyaların sembolik anlamlarını keşfedin.",
    longDesc: "Rüyanızdaki sembolleri, duygusal tepkileri ve mesajları analiz eder. Bilinçaltı mesajlar ve içsel rehberlik için kullanılır.",
    positions: ["Dream Symbol", "Emotional Response", "Message"],
  },
  horseshoeSpread: {
    title: "Horseshoe Spread",
    desc: "Durumun genel görünümünü sunan yay açılımı.",
    longDesc: "Geçmiş, şimdi, gelecek, hedefler, dış etkenler, tavsiye ve sonuç gibi pozisyonlarla bir durumu çok yönlü analiz eder.",
    positions: ["Past", "Present", "Future", "Goals/Fears", "External Influences", "Advice", "Outcome"],
  },
  careerPathSpread: {
    title: "Career Path Spread",
    desc: "Kariyer yolculuğunuz için rehberlik.",
    longDesc: "Kariyerinizdeki mevcut durum, engeller, fırsatlar, güçlü yönler ve olası sonuçlar üzerine odaklanır. Mesleki gelişim için idealdir.",
    positions: ["Current Situation", "Obstacles", "Opportunities", "Strengths", "Outcome"],
  },
  fullMoonSpread: {
    title: "Full Moon Spread",
    desc: "Dolunay enerjisiyle aydınlanma ve tamamlanma.",
    longDesc: "Dolunay döngüsünde tamamlanma, bırakma ve yeni başlangıçlar için kullanılır. Geçmiş döngü, mevcut enerji ve önerilen eylemler analiz edilir.",
    positions: ["Past Cycle", "Current Energy", "Subconscious Message", "Obstacles", "Recommended Action", "Resulting Energy"],
  },
  categoryReading: {
    title: "Category Reading",
    desc: "Kendi seçtiğiniz kartlarla özgür açılım.",
    longDesc: "Klasik pozisyonlara bağlı kalmadan, istediğiniz kadar kart seçerek tamamen özgür bir açılım yapabilirsiniz. Her kart bağımsız olarak yorumlanır.",
    positions: [],
  },
};

export default function SpreadSelect({ category, onSelect, onBack }: { category: string; onSelect: (spread: SpreadType) => void; onBack?: () => void; }) {
  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const t = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;
  const spreads = allSpreads.filter(s => spreadCategoryMap[category]?.includes(s.name));

  function handleSpreadClick(spread: SpreadType) {
    // Go to prompt step, not cards
    window.location.href = `/${locale}/reading/category/${category}/spread/${spread.name}`;
  }

  return (
    <section className="relative flex flex-col items-center w-full min-h-screen bg-[var(--bg-color)] py-12 md:py-20 px-2 md:px-8">
      <CosmicBackground />
      <div className="sticky top-0 z-40 w-full">
        <StepperBarClientWrapper categorySelected={!!category} category={category} locale={locale} spread={""} />
      </div>
      <div className="flex-1 w-full flex flex-col justify-center px-0 relative z-10">
        <div className="flex flex-col items-center mt-8 w-full">
          <SectionHeading className="mb-8 text-accent-gold drop-shadow-lg" font="cinzel">
            {t('reading_choose_spread')}
          </SectionHeading>
          <div className="mb-4 w-full px-0 md:px-8 mx-auto">
            <div className="bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] text-white text-sm md:text-base rounded-lg px-4 py-3 shadow-md text-center animate-fade-in font-cabin">
              {t('reading_spread_info')}
            </div>
          </div>
          {/* Mobilde yatay scroll, md+ grid */}
          <div className="w-full">
            {/* Mobilde yatay scroll */}
            <div className="w-full overflow-x-auto pb-2 md:hidden">
              <div className="flex w-max gap-6 snap-x snap-mandatory px-2 sm:px-6">
                {spreads.length === 0 ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="min-h-[220px] h-full min-w-[200px] w-[80vw] max-w-[260px] rounded-2xl bg-gradient-to-br from-[#180026] via-[#3B006A] to-[#7A2062]" />
                  ))
                ) : (
                  spreads.map((spread, i) => (
                    <button
                      key={spread.name}
                      onClick={() => handleSpreadClick(spread)}
                      aria-label={t(`spread_${spread.name}_title`)}
                      className="flex flex-col items-center rounded-2xl overflow-hidden shadow-lg border border-[var(--accent-color)] group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold p-0 bg-gradient-to-br from-[#180026] via-[#3B006A] to-[#7A2062] min-h-[220px] h-full min-w-[200px] w-[80vw] max-w-[260px] snap-center relative transition-all duration-300 hover:border-accent-gold hover:shadow-2xl font-cabin"
                      style={{ fontFamily: 'Cabin, Cinzel Decorative, sans-serif' }}
                    >
                      <div className="w-full aspect-[16/7] min-h-[180px] relative bg-[#1a0026]">
                        <img
                          src={`/images/spreads/${spread.name}.png`}
                          alt={t(`spread_${spread.name}_title`)}
                          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent-gold group-hover:shadow-gold transition-all duration-300 z-10" />
                      </div>
                      <div className="w-full flex flex-col items-start px-4 py-3">
                        <h2 className="text-xl xl:text-2xl font-bold text-accent-gold mb-1" style={{ fontFamily: 'Cinzel Decorative, serif' }}>{t(`spread_${spread.name}_title`)}</h2>
                        <span className="text-sm xl:text-base text-gray-300 text-left leading-snug" style={{ fontFamily: 'Cabin, sans-serif' }}>{t(`spread_${spread.name}_desc`)}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
            {/* md+ grid görünümü */}
            <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-8 w-full">
              {spreads.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="min-h-[220px] h-full w-full rounded-2xl bg-gradient-to-br from-[#180026] via-[#3B006A] to-[#7A2062]" />
                ))
              ) : (
                spreads.map((spread, i) => (
                  <button
                    key={spread.name}
                    onClick={() => handleSpreadClick(spread)}
                    aria-label={t(`spread_${spread.name}_title`)}
                    className="flex flex-col items-center rounded-2xl overflow-hidden shadow-lg border border-[var(--accent-color)] group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold p-0 bg-gradient-to-br from-[#180026] via-[#3B006A] to-[#7A2062] min-h-[220px] h-full w-full snap-center relative transition-all duration-300 hover:border-accent-gold hover:shadow-2xl font-cabin"
                    style={{ fontFamily: 'Cabin, Cinzel Decorative, sans-serif' }}
                  >
                    <div className="w-full aspect-[16/7] min-h-[180px] relative bg-[#1a0026]">
                      <img
                        src={`/images/spreads/${spread.name}.png`}
                        alt={t(`spread_${spread.name}_title`)}
                        className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent-gold group-hover:shadow-gold transition-all duration-300 z-10" />
                    </div>
                    <div className="w-full flex flex-col items-start px-4 py-3">
                      <h2 className="text-xl xl:text-2xl font-bold text-accent-gold mb-1" style={{ fontFamily: 'Cinzel Decorative, serif' }}>{t(`spread_${spread.name}_title`)}</h2>
                      <span className="text-sm xl:text-base text-gray-300 text-left leading-snug" style={{ fontFamily: 'Cabin, sans-serif' }}>{t(`spread_${spread.name}_desc`)}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal veya geniş detay paneli */}
      {selectedSpread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
          <div className="rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in flex flex-col items-center bg-gradient-to-br from-[#180026] via-[#3B006A] to-[#7A2062] border-2 border-accent-gold">
            <button
              className="absolute top-4 right-4 text-accent-gold hover:text-white bg-[#1a0026] border-2 border-accent-gold rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold focus:outline-none transition-colors duration-200"
              onClick={() => setSelectedSpread(null)}
              aria-label={t('reading_spread_modal_close')}
            >
              &times;
            </button>
            <img
              src={`/images/spreads/${selectedSpread.name}.png`}
              alt={t(`spread_${selectedSpread.name}_title`)}
              className="w-full max-w-[420px] aspect-[19/9] object-contain mb-4 rounded-xl shadow-lg border border-accent-gold bg-[#1a0026]"
            />
            <h3 className="text-2xl font-bold mb-2 text-accent-gold text-center drop-shadow-lg">{t(`spread_${selectedSpread.name}_title`)}</h3>
            <p className="text-base text-gray-300 mb-4 text-center">{t(`spread_${selectedSpread.name}_desc`)}</p>
            <div className="w-full mb-2">
              <span className="block text-sm font-semibold text-accent-gold mb-1">{t('reading_spread_modal_card_positions')}</span>
              <ul className="list-disc list-inside text-sm text-gray-400">
                {(t.raw(`spread_${selectedSpread.name}_positions`) || []).map((pos: string, idx: number) => (
                  <li key={idx}>{pos}</li>
                ))}
              </ul>
            </div>
            <div className="w-full mt-2">
              <span className="block text-sm text-gray-400 text-center">{t(`spread_${selectedSpread.name}_longDesc`)}</span>
            </div>
          </div>
        </div>
      )}
      {onBack && (
        <button onClick={onBack} className="mt-6 text-accent-gold underline">{t('reading_back_button')}</button>
      )}
    </section>
  );
} 