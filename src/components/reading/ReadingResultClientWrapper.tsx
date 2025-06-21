"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import TarotCardSheet from "./TarotCardSheet";
import {
  mapSelectedCardsToSpread,
  generatePromptForCelticCross,
  generatePromptForPastPresentFuture,
  generatePromptForFiveCardPath,
  generatePromptForRelationshipSpread,
  generatePromptForSingleCard,
  generatePromptForYearlySpread,
  generatePromptForProblemSolution,
  generatePromptForMindBodySpirit,
  generatePromptForAstroLogicalCross,
  generatePromptForBrokenHeart,
  generatePromptForDreamInterpretation,
  generatePromptForHorseshoeSpread,
  generatePromptForCareerPathSpread,
  generatePromptForFullMoonSpread,
  generatePromptForCategoryReading,
  getTarotCardImage,
} from "@/lib/tarotLogic";
import spreadsData from "../../lib/data/spreads.json";

const spreadPromptMap: Record<string, Function> = {
  celticCross: generatePromptForCelticCross,
  pastPresentFuture: generatePromptForPastPresentFuture,
  fiveCardPath: generatePromptForFiveCardPath,
  relationshipSpread: generatePromptForRelationshipSpread,
  singleCard: generatePromptForSingleCard,
  yearlySpread: generatePromptForYearlySpread,
  problemSolution: generatePromptForProblemSolution,
  mindBodySpirit: generatePromptForMindBodySpirit,
  astroLogicalCross: generatePromptForAstroLogicalCross,
  brokenHeart: generatePromptForBrokenHeart,
  dreamInterpretation: generatePromptForDreamInterpretation,
  horseshoeSpread: generatePromptForHorseshoeSpread,
  careerPathSpread: generatePromptForCareerPathSpread,
  fullMoonSpread: generatePromptForFullMoonSpread,
  categoryReading: generatePromptForCategoryReading,
};

// Renk paleti - kategori bazlı
const categoryColors = {
  love: {
    primary: "#ff6b9d",
    secondary: "#ff8fab",
    accent: "#ffb3c7",
    bg: "rgba(255, 107, 157, 0.1)",
  },
  career: {
    primary: "#4f46e5",
    secondary: "#6366f1",
    accent: "#818cf8",
    bg: "rgba(79, 70, 229, 0.1)",
  },
  health: {
    primary: "#10b981",
    secondary: "#34d399",
    accent: "#6ee7b7",
    bg: "rgba(16, 185, 129, 0.1)",
  },
  spiritual: {
    primary: "#8b5cf6",
    secondary: "#a78bfa",
    accent: "#c4b5fd",
    bg: "rgba(139, 92, 246, 0.1)",
  },
  general: {
    primary: "#f59e0b",
    secondary: "#fbbf24",
    accent: "#fcd34d",
    bg: "rgba(245, 158, 11, 0.1)",
  },
};

// Input sanitization fonksiyonu
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe/gi, '')
    .replace(/<object/gi, '')
    .replace(/<embed/gi, '')
    .trim();
}

// Cache key oluşturma
function generateCacheKey(category: string, spread: string, cards: any[], intention: string): string {
  const data = JSON.stringify({ category, spread, cards, intention });
  return btoa(data).slice(0, 50); // Base64 encoding ile kısa key
}

// LocalStorage cache fonksiyonları
function getCachedResult(cacheKey: string): string | null {
  try {
    const cached = localStorage.getItem(`ai_result_${cacheKey}`);
    if (!cached) return null;

    const { result, timestamp } = JSON.parse(cached);
    const now = Date.now();
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat

    if (now - timestamp > CACHE_TTL) {
      localStorage.removeItem(`ai_result_${cacheKey}`);
      return null;
    }

    return result;
  } catch {
    return null;
  }
}

function setCachedResult(cacheKey: string, result: string): void {
  try {
    const data = { result, timestamp: Date.now() };
    localStorage.setItem(`ai_result_${cacheKey}`, JSON.stringify(data));
  } catch {
    // LocalStorage dolu olabilir, cache'i temizle
    clearOldCache();
  }
}

function clearOldCache(): void {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('ai_result_'));

    if (cacheKeys.length > 50) { // Max 50 cache entry
      cacheKeys.slice(0, 10).forEach(key => localStorage.removeItem(key));
    }
  } catch {
    // Ignore errors
  }
}

// Markdown bileşeni - özelleştirilmiş
const CustomMarkdown = ({ children, category }: { children: string; category: string }) => {
  const colors = categoryColors[category as keyof typeof categoryColors] || categoryColors.general;

  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 mt-10 sm:mt-12 first:mt-0 text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-yellow-400 to-orange-400 border-b-2 pb-4 animate-gradient drop-shadow-lg"
            style={{ 
              borderImage: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent}) 1`,
              textShadow: `0 0 30px ${colors.primary}50, 0 0 60px ${colors.primary}30`
            }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 mt-8 sm:mt-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 border-l-4 pl-6 animate-gradient drop-shadow-lg"
            style={{ 
              borderColor: colors.secondary, 
              textShadow: `0 0 25px ${colors.secondary}40, 0 0 50px ${colors.secondary}20`,
              borderImage: `linear-gradient(180deg, ${colors.secondary}, ${colors.accent}) 1`
            }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 mt-6 sm:mt-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 border-l-3 pl-4 animate-gradient drop-shadow-lg"
            style={{ 
              borderColor: colors.accent, 
              textShadow: `0 0 20px ${colors.accent}40, 0 0 40px ${colors.accent}20`,
              borderImage: `linear-gradient(180deg, ${colors.accent}, ${colors.primary}) 1`
            }}>
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 mt-4 sm:mt-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 animate-gradient drop-shadow-lg"
            style={{ 
              textShadow: `0 0 15px ${colors.secondary}30, 0 0 30px ${colors.secondary}15`
            }}>
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-gray-100 leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg first:mt-0 font-normal" 
            style={{ 
              textIndent: '1.5em',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="font-bold px-3 py-2 rounded-lg inline-block bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-600/40 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}30)`,
              color: colors.primary,
              textShadow: `0 0 10px ${colors.primary}50, 0 0 20px ${colors.primary}30`,
              border: `1px solid ${colors.primary}40`,
              boxShadow: `0 4px 12px ${colors.primary}20`
            }}>
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic font-semibold px-3 py-2 rounded-lg inline-block bg-gradient-to-r from-gray-800/60 to-gray-700/60 border border-gray-600/40 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}30, ${colors.primary}30)`,
              color: colors.accent,
              textShadow: `0 0 8px ${colors.accent}40, 0 0 16px ${colors.accent}20`,
              border: `1px solid ${colors.accent}40`,
              boxShadow: `0 4px 12px ${colors.accent}20`
            }}>
            {children}
          </em>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-6 sm:mb-8 space-y-3 sm:space-y-4 text-gray-100 ml-4 sm:ml-6">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-6 sm:mb-8 space-y-3 sm:space-y-4 text-gray-100 ml-4 sm:ml-6">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-100 leading-relaxed pl-2 font-normal" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            {children}
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 pl-6 sm:pl-8 py-4 sm:py-6 mb-6 sm:mb-8 italic bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-r-xl shadow-lg"
            style={{ 
              borderColor: colors.primary,
              boxShadow: `0 4px 20px ${colors.primary}20`
            }}>
            <div className="text-gray-200 leading-relaxed font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              {children}
            </div>
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-gray-800 px-3 py-2 rounded-lg text-yellow-300 font-mono text-sm border border-gray-600/40 shadow-md"
            style={{ textShadow: '0 0 8px rgba(253, 224, 71, 0.3)' }}>
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-gray-900 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8 overflow-x-auto border border-gray-600/40 shadow-xl">
            <code className="text-green-300 font-mono text-sm leading-relaxed" style={{ textShadow: '0 0 8px rgba(34, 197, 94, 0.3)' }}>
              {children}
            </code>
          </pre>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

// Kart görseli bileşeni - Basitleştirilmiş versiyon
const CardImage = ({ card, position, translations, category }: { card: any; position: string; translations: any; category: string }) => {
  const colors = categoryColors[category as keyof typeof categoryColors] || categoryColors.general;
  const [showSheet, setShowSheet] = useState(false);

  // Fallback image paths
  const getImagePaths = (card: any): string[] => {
    const paths = [];
    
    // Primary path from getTarotCardImage
    paths.push(getTarotCardImage(card));
    
    // Direct img path if different
    if (card.img && card.img !== getTarotCardImage(card).split('/').pop()) {
      paths.push(`/images/tarot_card_images/${card.img}`);
    }
    
    // Card back as final fallback
    paths.push('/images/tarot_card_images/card_back.png');
    
    return paths;
  };

  // Get image source immediately
  const paths = getImagePaths(card);
  const [imageSrc, setImageSrc] = useState<string>(paths[0]);

  // Update image source when card changes
  useEffect(() => {
    const newPaths = getImagePaths(card);
    setImageSrc(newPaths[0]);
  }, [card]);

  const handleImageError = () => {
    const currentIndex = paths.indexOf(imageSrc);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < paths.length) {
      setImageSrc(paths[nextIndex]);
    }
  };

  return (
    <>
      <div 
        className="flex flex-col items-center mb-6 sm:mb-8 group card-image-container cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-2"
        onClick={() => setShowSheet(true)}
      >
        {/* Kart Container */}
        <div className="relative w-28 h-42 sm:w-32 sm:h-48 md:w-36 md:h-54 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500"
          style={{
            boxShadow: `0 15px 40px ${colors.primary}30, 0 0 30px ${colors.primary}20, 0 8px 25px rgba(0,0,0,0.3)`
          }}>
          {/* Kart çerçevesi - Geliştirilmiş */}
          <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-opacity-100 transition-all duration-500 z-10"
            style={{
              borderColor: colors.primary,
              boxShadow: `0 0 40px ${colors.primary}50`
            }}></div>

          {/* Kart görseli */}
          <Image
            src={imageSrc}
            alt={card.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 144px"
            onError={handleImageError}
            loading="eager"
            priority={true}
          />

          {/* Hover overlay - Geliştirilmiş */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-2 sm:pb-3">
            <div className="text-white text-xs font-bold bg-black/80 px-3 py-2 rounded-full border border-white/20 shadow-lg">
              {translations.reading_card_click_details || "Click for Details"}
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at center, ${colors.primary}30 0%, transparent 70%)`,
              boxShadow: `0 0 50px ${colors.primary}40`
            }}></div>
        </div>

        {/* Alt bilgi - Geliştirilmiş */}
        <div className="mt-4 sm:mt-5 text-center transform transition-all duration-300 group-hover:scale-105">
          <h4 className="text-sm sm:text-base font-bold text-white mb-2 px-4 py-2 rounded-full card-position transition-all duration-300 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}40, ${colors.accent}40)`,
              border: `2px solid ${colors.secondary}60`,
              boxShadow: `0 4px 15px ${colors.secondary}30, 0 2px 8px rgba(0,0,0,0.3)`,
              textShadow: `0 1px 3px rgba(0,0,0,0.5)`
            }}>
            {position}
          </h4>
          <p className="text-sm sm:text-base text-gray-100 max-w-32 sm:max-w-36 truncate card-name font-semibold" 
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
            {card.name}
          </p>
        </div>
      </div>

      {/* TarotCardSheet */}
      <TarotCardSheet
        open={showSheet}
        onOpenChange={setShowSheet}
        card={card}
        translations={translations}
      />
    </>
  );
};

// Spread bilgisini al
function getSpreadInfo(spreadKey: string) {
  return (spreadsData as any[]).find((s: any) => s.key === spreadKey);
}

export default function ReadingResultClientWrapper({ locale, category, spread, translations }: {
  locale: string;
  category: string;
  spread: string;
  translations: any;
}) {
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Renk paleti
  const colors = categoryColors[category as keyof typeof categoryColors] || categoryColors.general;

  // Memoized cache key
  const cacheKey = useMemo(() => {
    try {
      const cardsRaw = localStorage.getItem(`selectedCards_${spread}`);
      const intention = localStorage.getItem("userIntention") || "";
      if (!cardsRaw) return null;

      const cards = JSON.parse(cardsRaw);
      setSelectedCards(cards);
      return generateCacheKey(category, spread, cards, intention);
    } catch {
      return null;
    }
  }, [category, spread]);

  // Debounced fetch fonksiyonu
  const debouncedFetch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (fetchFn: () => Promise<void>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(fetchFn, 300); // 300ms debounce
      };
    })(),
    []
  );

  const fetchAIResult = useCallback(async () => {
    const startTime = performance.now();
    setLoading(true);
    setError(null);
    setAiResult(null);

    try {
      // Cache kontrolü
      if (cacheKey) {
        const cachedResult = getCachedResult(cacheKey);
        if (cachedResult) {
          setAiResult(cachedResult);
          setLoading(false);

          // Performance tracking
          const loadTime = performance.now() - startTime;
          console.log(`Cache hit - Load time: ${loadTime.toFixed(2)}ms`);
          return;
        }
      }

      // Kartlar ve intention localStorage'dan alınır
      const cardsRaw = localStorage.getItem(`selectedCards_${spread}`);
      const intention = localStorage.getItem("userIntention") || "";

      if (!cardsRaw) {
        throw new Error(translations.reading_card_no_selected || "Seçili kartlar bulunamadı.");
      }

      // Input validation
      if (!category || !spread) {
        throw new Error(translations.reading_invalid_category || "Geçersiz kategori veya spread.");
      }

      const cards = JSON.parse(cardsRaw);
      setSelectedCards(cards);

      // Kart verilerini validate et
      if (!Array.isArray(cards) || cards.length === 0) {
        throw new Error(translations.reading_invalid_cards || "Geçersiz kart seçimi.");
      }

      // Intention'ı sanitize et
      const sanitizedIntention = sanitizeInput(intention);

      // Spread pozisyonlarına göre kartları map'le
      const spreadInfo = getSpreadInfo(spread);
      if (!spreadInfo) {
        throw new Error(translations.reading_spread_not_found || "Spread bulunamadı.");
      }
      const spreadMap = mapSelectedCardsToSpread(spreadInfo, cards);

      // Doğru prompt fonksiyonunu seç
      const promptFn = spreadPromptMap[spread] || generatePromptForCategoryReading;
      const prompt = promptFn({
        category,
        spread: spreadMap,
        customPrompt: sanitizedIntention,
        locale,
      });

      // Prompt'u validate et
      const maxLength = spread === 'celticCross' || spread === 'yearlySpread'
        ? 15000  // 15,000 karakter (Celtic Cross için)
        : 5000;  // 5,000 karakter (diğer spread'ler için)

      if (!prompt || prompt.length > maxLength) {
        const errorMessage = translations.reading_prompt_too_long || "Prompt çok uzun veya geçersiz (maksimum {maxLength} karakter).";
        throw new Error(errorMessage.replace('{maxLength}', maxLength.toLocaleString()));
      }

      // Timeout ile API isteği gönder
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 saniye timeout

      const apiStartTime = performance.now();
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Response'u validate et
      if (!data.result || typeof data.result !== 'string') {
        throw new Error(translations.reading_invalid_ai_response || "Geçersiz AI yanıtı.");
      }

      // Sonucu cache'e kaydet
      if (cacheKey) {
        setCachedResult(cacheKey, data.result);
      }

      setAiResult(data.result);
    } catch (e: any) {
      console.error('AI Result Error:', e);

      // Performance tracking for errors
      const errorTime = performance.now() - startTime;
      console.log(`Error occurred after ${errorTime.toFixed(2)}ms`);

      // Kullanıcı dostu hata mesajları
      let errorMessage = translations.reading_unknown_error || "Bilinmeyen bir hata oluştu.";

      if (e.name === 'AbortError') {
        errorMessage = translations.reading_timeout_error || "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
      } else if (e.message?.includes('429')) {
        errorMessage = translations.reading_rate_limit_error || "Çok fazla istek gönderildi. Lütfen biraz bekleyin.";
      } else if (e.message?.includes('500')) {
        errorMessage = translations.reading_server_error || "Sunucu hatası. Lütfen daha sonra tekrar deneyin.";
      } else if (e.message) {
        errorMessage = e.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [category, spread, locale, translations, cacheKey]);

  useEffect(() => {
    debouncedFetch(fetchAIResult);
  }, [fetchAIResult, debouncedFetch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent-gold rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 max-w-xs mt-6">
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-gold to-yellow-400 rounded-full animate-pulse" 
                 style={{ width: '60%' }}></div>
          </div>
        </div>
        
        <div className="text-accent-gold text-xl font-bold mt-6 text-center">
          {translations.reading_loading || "Preparing your reading..."}
        </div>
        <div className="text-gray-400 text-sm mt-2 text-center">
          {translations.reading_ai_creating || "AI is creating your tarot interpretation"}
        </div>
        
        {/* Loading Steps */}
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{translations.reading_loading_step_1 || "Analyzing cards..."}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span>{translations.reading_loading_step_2 || "Creating AI interpretation..."}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span>{translations.reading_loading_step_3 || "Formatting results..."}</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-xl font-bold mb-4 text-center">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-accent-gold text-black rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
        >
          {translations.reading_try_again || "Tekrar Dene"}
        </button>
      </div>
    );
  }

  if (!aiResult) {
    return null;
  }

  // Spread pozisyonlarını al
  const spreadInfo = getSpreadInfo(spread);
  const spreadMap = spreadInfo ? mapSelectedCardsToSpread(spreadInfo, selectedCards) : {};

  return (
    <div 
      id="reading-result"
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a1a] text-white p-2 sm:p-4 md:p-8 animate-fade-in"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, ${colors.primary}10 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, ${colors.secondary}08 0%, transparent 50%)`
      }}
    >
      {/* Cosmic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/bg_stars.svg')] opacity-10 animate-twinkle"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section - Fade In */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-yellow-400 to-accent-gold animate-gradient drop-shadow-lg"
            style={{
              textShadow: `0 0 30px ${colors.primary}40, 0 0 60px ${colors.primary}20`
            }}>
            {translations.reading_result_title || "Tarot Reading Result"}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-300 font-medium">
            <span className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-full border border-gray-600/50">
              <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }}></span>
              {translations[`category_${category}_label`] || category}
            </span>
            <span className="hidden sm:inline text-gray-500">•</span>
            <span className="bg-gray-800/50 px-3 py-2 rounded-full border border-gray-600/50">
              {translations[`spread_${spread}_title`] || spread}
            </span>
          </div>
        </div>

        {/* Cards Grid - Staggered Animation */}
        <div className="mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center animate-fade-in-up drop-shadow-lg" 
            style={{ animationDelay: '0.2s', textShadow: `0 0 20px ${colors.secondary}30` }}>
            {translations.reading_selected_cards || "Selected Cards"}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
            {Object.entries(spreadMap).map(([position, card], index) => (
              <div 
                key={position}
                className="animate-fade-in-up flex justify-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardImage
                  card={card}
                  position={position}
                  translations={translations}
                  category={category}
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI Sonuç Bölümü */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8 sm:mb-12 border border-gray-600/30 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
            <h3 className="text-xl sm:text-2xl font-bold text-accent-gold flex items-center gap-3 drop-shadow-lg"
              style={{ textShadow: `0 0 20px ${colors.primary}40` }}>
              <span className="text-2xl sm:text-3xl">🔮</span>
              {translations.reading_ai_interpretation || "AI Tarot Interpretation"}
            </h3>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-3">
              {/* Print Button */}
              <button
                onClick={() => window.print()}
                className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
                title={translations.reading_print || "Print"}
              >
                🖨️
              </button>
              
              {/* PDF Export */}
              <button
                onClick={() => {
                  // PDF export functionality
                  const element = document.getElementById('reading-result');
                  if (element) {
                    window.print();
                  }
                }}
                className="p-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-300 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
                title={translations.reading_export_pdf || "Download PDF"}
              >
                📄
              </button>
              
              {/* Share Button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: translations.reading_share_title || 'My Tarot Reading',
                      text: translations.reading_share_text || 'I am sharing my AI-interpreted tarot reading result!',
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert(translations.reading_link_copied || 'Link copied!');
                  }
                }}
                className="p-3 rounded-xl bg-green-600 hover:bg-green-700 transition-all duration-300 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
                title={translations.reading_share || "Share"}
              >
                📤
              </button>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none prose-sm sm:prose-base lg:prose-lg">
            <CustomMarkdown category={category}>
              {aiResult}
            </CustomMarkdown>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center mt-8 sm:mt-12 text-gray-400 text-sm sm:text-base px-4 bg-gray-900/50 rounded-xl py-4 border border-gray-700/30">
          <p className="font-medium">{translations.reading_disclaimer || "This interpretation is generated by AI and is for entertainment purposes only."}</p>
        </div>
      </div>
    </div>
  );
} 