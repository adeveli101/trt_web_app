"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import PDFShareButton from "./PDFShareButton";
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
          <h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0 text-white border-b-2 pb-2" 
              style={{ borderColor: colors.primary, textShadow: `0 0 10px ${colors.primary}40` }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mb-4 mt-6 text-white border-l-4 pl-4" 
              style={{ borderColor: colors.secondary, textShadow: `0 0 8px ${colors.secondary}30` }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold mb-3 mt-5 text-white border-l-3 pl-3" 
              style={{ borderColor: colors.accent, textShadow: `0 0 6px ${colors.accent}20` }}>
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-semibold mb-2 mt-4 text-white" 
              style={{ color: colors.secondary, textShadow: `0 0 4px ${colors.secondary}20` }}>
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-gray-200 leading-relaxed mb-4 text-lg">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold px-1 rounded" 
                  style={{ 
                    color: colors.primary, 
                    textShadow: `0 0 4px ${colors.primary}30`,
                    background: `${colors.primary}10`
                  }}>
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic px-1 rounded" 
              style={{ 
                color: colors.accent, 
                textShadow: `0 0 3px ${colors.accent}20`,
                background: `${colors.accent}10`
              }}>
            {children}
          </em>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-gray-200">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-200">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-200 leading-relaxed">
            {children}
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 pl-4 py-3 my-6 italic text-gray-300 bg-black/30 rounded-r-lg backdrop-blur-sm"
                      style={{ 
                        borderColor: colors.primary,
                        boxShadow: `0 0 20px ${colors.primary}20`
                      }}>
            <div className="text-sm text-gray-400 mb-1">💫 Kozmik Bilgelik</div>
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-black/40 px-2 py-1 rounded text-sm font-mono" 
                style={{ 
                  color: colors.accent,
                  border: `1px solid ${colors.accent}30`
                }}>
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto my-4 border" 
               style={{ borderColor: colors.primary }}>
            {children}
          </pre>
        ),
        a: ({ children, href }) => (
          <a href={href} 
             className="underline hover:no-underline transition-all duration-300" 
             style={{ 
               color: colors.secondary,
               textShadow: `0 0 3px ${colors.secondary}20`
             }}
             target="_blank" 
             rel="noopener noreferrer">
            {children}
          </a>
        ),
        hr: () => (
          <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        ),
        // Özel anahtar kelime vurgulaması için span
        span: ({ children, className }) => {
          if (className?.includes('keyword')) {
            return (
              <span className="inline-block px-2 py-1 mx-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      color: 'white',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      boxShadow: `0 2px 8px ${colors.primary}40`
                    }}>
                {children}
              </span>
            );
          }
          return <span>{children}</span>;
        }
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

// Kart görseli bileşeni
const CardImage = ({ card, position, translations, category }: { card: any; position: string; translations: any; category: string }) => {
  const colors = categoryColors[category as keyof typeof categoryColors] || categoryColors.general;
  
  return (
    <div className="flex flex-col items-center mb-6 group card-image-container">
      <div className="relative w-32 h-48 rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-2">
        {/* Kart çerçevesi */}
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-opacity-100 transition-all duration-500"
             style={{ 
               borderColor: colors.primary,
               boxShadow: `0 0 20px ${colors.primary}20`
             }}></div>
        
        {/* Kart görseli */}
        <Image
          src={getTarotCardImage(card)}
          alt={card.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 128px, 128px"
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      {/* Alt bilgi */}
      <div className="mt-3 text-center">
        <h4 className="text-sm font-bold text-white mb-1 px-2 py-1 rounded-full card-position"
            style={{ 
              background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.accent}20)`,
              border: `1px solid ${colors.secondary}30`
            }}>
          {position}
        </h4>
        <p className="text-xs text-gray-400 max-w-32 truncate card-name">{card.name}</p>
      </div>
    </div>
  );
};

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
      const spreadMap = mapSelectedCardsToSpread({ name: spread }, cards);

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
        <div className="text-accent-gold text-xl font-bold mt-6 text-center">
          {translations.reading_loading || "Yorum hazırlanıyor..."}
        </div>
        <div className="text-gray-400 text-sm mt-2 text-center">
          {translations.reading_ai_creating || "AI tarot yorumunuz oluşturuluyor"}
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
  const spreadMap = mapSelectedCardsToSpread({ name: spread }, selectedCards);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" ref={contentRef}>
      {/* Header */}
      <div className="text-center mb-12 relative">
        {/* Arka plan efekti */}
        <div className="absolute inset-0 -top-8 -bottom-8 opacity-5" 
             style={{
               background: `radial-gradient(circle at 50% 50%, ${colors.primary}40 0%, transparent 70%)`
             }}></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-white"
              style={{ 
                textShadow: `0 0 30px ${colors.primary}40`,
                background: `linear-gradient(135deg, white, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            {translations.reading_result || "Tarot Yorumu"}
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-gray-300 mb-6">
            <span className="capitalize px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                    border: `1px solid ${colors.primary}30`
                  }}>
              {category}
            </span>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            <span className="capitalize px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.accent}20)`,
                    border: `1px solid ${colors.secondary}30`
                  }}>
              {spread.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          
          {/* Dekoratif çizgi */}
          <div className="h-1 w-48 rounded-full mx-auto" 
               style={{ 
                 background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.secondary}, ${colors.accent}, transparent)`,
                 boxShadow: `0 0 15px ${colors.primary}30`
               }}></div>
        </div>
      </div>

      {/* Kartlar Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          {translations.reading_selected_cards || "Seçilen Kartlar"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
          {Object.entries(spreadMap).map(([position, card]) => (
            <CardImage key={position} card={card} position={position} translations={translations} category={category} />
          ))}
        </div>
      </div>

      {/* AI Sonucu */}
      <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10 relative overflow-hidden">
        {/* Arka plan efekti */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               background: `radial-gradient(circle at 20% 80%, ${colors.primary}40 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, ${colors.secondary}30 0%, transparent 50%)`
             }}></div>
        
        <div className="relative z-10">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                   style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
                <span className="text-white text-lg">✨</span>
              </div>
              <h2 className="text-3xl font-bold text-white"
                  style={{ textShadow: `0 0 20px ${colors.primary}40` }}>
                {translations.reading_ai_interpretation || "AI Tarot Yorumu"}
              </h2>
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                   style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})` }}>
                <span className="text-white text-lg">🔮</span>
              </div>
            </div>
            <div className="h-1 w-32 rounded-full mx-auto" 
                 style={{ 
                   background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
                   boxShadow: `0 0 10px ${colors.primary}40`
                 }}></div>
          </div>
          
          <div className="prose prose-invert max-w-none reading-content">
            <CustomMarkdown category={category}>
              {aiResult}
            </CustomMarkdown>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>{translations.reading_disclaimer || "Bu yorum AI tarafından oluşturulmuştur ve eğlence amaçlıdır."}</p>
      </div>

      {/* PDF Paylaşım Butonları */}
      <PDFShareButton 
        category={category} 
        spread={spread} 
        translations={translations} 
        colors={colors}
        contentRef={contentRef}
      />
    </div>
  );
} 