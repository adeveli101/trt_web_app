export interface TarotCard {
  name: string;
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
  name: string;
  cardCount: number;
} 