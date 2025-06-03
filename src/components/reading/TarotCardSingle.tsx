"use client";
// components/reading/TarotCardSingle.tsx
import React from "react";
import { TarotCard } from "../../lib/tarotTypes";
import { getTarotCardImage } from "@/lib/tarotLogic";
import { Card, CardContent } from "@/components/ui/card"; // Shadcn Card bileşeni
import { AspectRatio } from "@/components/ui/aspect-ratio"; // Shadcn AspectRatio
import { motion } from "framer-motion"; // Framer Motion import'u
import { Skeleton } from "@/components/ui/skeleton";

interface TarotCardSingleProps {
  card?: TarotCard;
  meaning?: string;       // Kartın açılıma göre anlamı
  meaningTitle?: string;  // Anlam başlığı (açılım pozisyonu gibi)
  size?: 'sm' | 'md' | 'lg'; // Kart boyutu için prop
  isBack?: boolean; // Kapalı kart göstergesi
}

function ClosedTarotCard({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = {
    sm: 'w-16 h-28 md:w-20 md:h-36',
    md: 'w-24 h-44 md:w-32 md:h-60',
    lg: 'w-32 h-60 md:w-40 md:h-72',
  };
  return (
    <div
      className={`relative rounded-xl overflow-hidden ${sizeMap[size]} flex flex-col items-center justify-center p-[1.5px] bg-gradient-to-br from-purple-900 via-purple-700 to-yellow-300 shadow-lg group cursor-pointer select-none`}
      style={{
        backgroundImage: 'linear-gradient(120deg, #6a003a 0%, #a78bfa 40%, #ffd700 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientMove 8s ease-in-out infinite',
      }}
    >
      <style jsx>{`
        @keyframes gradientMove {
          0% {background-position:0% 50%}
          50% {background-position:100% 50%}
          100% {background-position:0% 50%}
        }
      `}</style>
      <div className="absolute inset-0 opacity-30 bg-[url('/images/tarot_card_images/back_pattern.svg')] bg-cover bg-center" />
      <div className="z-10 flex flex-col items-center justify-center w-full h-full">
        {/* SVG: yıldız, ay, güneş, mistik desen */}
        <svg width="60" height="90" viewBox="0 0 60 90" fill="none" className="mx-auto mb-2 drop-shadow-xl">
          <defs>
            <radialGradient id="cardBackGrad" cx="0.5" cy="0.5" r="0.7">
              <stop offset="0%" stopColor="#fffbe6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </radialGradient>
            <linearGradient id="starGrad" x1="0" y1="0" x2="60" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          {/* Güneş */}
          <circle cx="30" cy="25" r="12" fill="url(#cardBackGrad)" stroke="#FFD700" strokeWidth="2" />
          {/* Ay */}
          <path d="M44 25a10 10 0 1 1-10-10" fill="#fffbe6" fillOpacity="0.7" />
          {/* Büyük yıldız */}
          <polygon points="30,10 32,22 44,22 34,28 36,40 30,32 24,40 26,28 16,22 28,22" fill="url(#starGrad)" opacity="0.8" />
          {/* Küçük yıldızlar */}
          <circle cx="12" cy="12" r="2" fill="#FFD700" />
          <circle cx="48" cy="16" r="1.5" fill="#FFD700" />
          <circle cx="20" cy="38" r="1.2" fill="#FFD700" />
          <circle cx="40" cy="38" r="1.2" fill="#FFD700" />
          {/* Mistik desen: spiral */}
          <path d="M30 60c10 0 10-15 0-15s-10 15 0 15z" stroke="#FFD700" strokeWidth="1.2" fill="none" />
        </svg>
        <span className="text-yellow-200 font-bold text-xs md:text-base drop-shadow tracking-widest uppercase">Tarot</span>
      </div>
      {/* Hover/tap animasyonu */}
      <div className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:ring-2 group-hover:ring-yellow-300/60" />
    </div>
  );
}

export default function TarotCardSingle({ card, meaning, meaningTitle, size = 'md', isBack }: TarotCardSingleProps) {
  // Boyutlar için eşleme
  const sizeMap = {
    sm: 'w-16 h-28 md:w-20 md:h-36', // Küçük boyut
    md: 'w-24 h-44 md:w-32 md:h-60', // Orta boyut
    lg: 'w-32 h-60 md:w-40 md:h-72', // Büyük boyut
  };

  if (isBack) return <ClosedTarotCard size={size} />;
  if (!card) return <Skeleton className={sizeMap[size]} />; // Kart verisi yoksa Skeleton göster

  return (
    <motion.div
      // Stepper benzeri animasyonlu degrade border için dış sarıcı
      className={`relative rounded-xl overflow-hidden
                  ${sizeMap[size]}
                  flex flex-col items-center justify-center
                  p-[1.5px] // Degrade border kalınlığı
                  bg-gradient-to-br from-black via-zinc-900 to-[#2d0101]`} // Kartın dış arka planı/border
      whileHover={{
        scale: 1.08,
        boxShadow: '0 8px 30px rgba(45, 1, 1, 0.8)', // Koyu kırmızıya çalan belirgin bir gölge
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.95 }} // Tıklama efekti
      style={{
        backgroundImage: `linear-gradient(120deg, #1a0008, #2c0018, #6a003a, #2c0018, #1a0008)`, // Stepper'dan esinlenilen degrade
        backgroundSize: '200% 200%', // Animasyon için büyük boyut
        animation: 'gradientMove 8s ease-in-out infinite' // Animasyon sınıfı
      }}
    >
      {/* CSS animasyonunu tanımla */}
      <style jsx>{`
        @keyframes gradientMove {
          0% {background-position:0% 50%}
          50% {background-position:100% 50%}
          100% {background-position:0% 50%}
        }
      `}</style>

      {/* Ana Kart İçeriği */}
      <Card
        className={`relative w-full h-full rounded-[calc(0.75rem-1.5px)] overflow-hidden
                    bg-zinc-950 flex flex-col items-center justify-between p-0`} // Daha koyu bir iç arka plan, padding kaldırıldı
      >
        <CardContent className="p-0 w-full h-full flex flex-col justify-between"> {/* CardContent flex-col ve justify-between olarak ayarlandı */}

          {/* En Üst Kısım: MeaningTitle */}
          {meaningTitle && (
            <div className="w-full text-center flex-shrink-0 pt-1 pb-0.5 px-1 bg-black/50 rounded-t-[calc(0.75rem-1.5px)]">
              <span className="block text-[8px] md:text-[10px] font-semibold text-rose-300 tracking-wide drop-shadow-sm line-clamp-1" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                {meaningTitle}
              </span>
            </div>
          )}

          {/* Anlam (Meaning) metni - Resmin hemen üstünde */}
          {meaning && (
            <div className="w-full text-center flex-shrink-0 py-0.5 px-1 bg-black/50">
              <span className="block text-[7px] md:text-[9px] text-rose-200 font-medium italic line-clamp-2 min-h-[16px] md:min-h-[20px]" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                {meaning}
              </span>
            </div>
          )}

          {/* Kart Resim Alanı - Dikeyde ortalı ve boşluğu dolduracak */}
          <AspectRatio ratio={3 / 5} className="w-full flex-grow flex items-center justify-center p-0.5">
            <img
              src={getTarotCardImage(card)}
              alt={card.name}
              className="object-contain rounded-md w-full h-full shadow-lg border border-gray-700 select-none pointer-events-none"
              draggable={false}
            />
          </AspectRatio>

          {/* Alt Kısım: Kart İsmi - Resmin hemen altında, daha küçük ve tek satır */}
          <div className="w-full text-center flex-shrink-0 pt-0.5 pb-1 px-1 bg-black/50 rounded-b-[calc(0.75rem-1.5px)]">
            <span className="block text-[9px] md:text-[11px] font-bold text-white tracking-wide line-clamp-1 capitalize" style={{ fontFamily: 'Cinzel Decorative, serif' }}> {/* Font boyutu küçültüldü ve line-clamp-1 ile tek satırda kalması sağlandı */}
              {card.name}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}