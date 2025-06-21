export interface TarotCard {
  name: string;
  number?: string;
  keywords: string[];
  meanings: {
    light: string[];
    shadow: string[];
  };
  img?: string;
  arcana?: string;
  suit?: string;
  fortune_telling?: string[];
  Archetype?: string;
  "Hebrew Alphabet"?: string;
  Numerology?: string;
  Elemental?: string;
  "Mythical/Spiritual"?: string;
  "Questions to Ask"?: string[];
}

export interface SpreadType {
  key: string;
  label: string;
  desc: string;
  image: string;
  cardCount: number;
  isPopular: boolean;
  isNew: boolean;
}

export interface CategoryType {
  key: string;
  name: string;
  label: string;
  insight: string;
  image: string;
  isPopular: boolean;
  isPremium: boolean;
  isNew: boolean;
} 