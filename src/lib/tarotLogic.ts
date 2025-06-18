import tarotCardsData from "./data/tarot_cards_en.json";
import { TarotCard, SpreadType } from "./tarotTypes";

const tarotCards: TarotCard[] = tarotCardsData.cards;

// Spread pozisyonları konfigürasyonu
export const spreadPositions: Record<string, string[]> = {
  singleCard: ["Card"],
  pastPresentFuture: ["Past", "Present", "Future"],
  problemSolution: ["Problem", "Reason", "Solution"],
  fiveCardPath: ["Current Situation", "Obstacles", "Best Outcome", "Foundation", "Potential"],
  relationshipSpread: ["You", "Partner", "Relationship", "Strengths", "Weaknesses", "Actions Needed", "Outcome"],
  celticCross: [
    "Current Situation", "Challenge", "Subconscious", "Past", "Possible Future", "Near Future", "Personal Stance", "External Influences", "Hopes/Fears", "Final Outcome"
  ],
  yearlySpread: [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Yearly Summary"
  ],
  mindBodySpirit: ["Mind", "Body", "Spirit"],
  astroLogicalCross: ["Identity", "Emotional State", "External Influences", "Challenges", "Destiny"],
  brokenHeart: ["Source of Pain", "Emotional Wounds", "Inner Conflict", "Healing Process", "New Beginning"],
  dreamInterpretation: ["Dream Symbol", "Emotional Response", "Message"],
  horseshoeSpread: ["Past", "Present", "Future", "Goals/Fears", "External Influences", "Advice", "Outcome"],
  careerPathSpread: ["Current Situation", "Obstacles", "Opportunities", "Strengths", "Outcome"],
  fullMoonSpread: ["Past Cycle", "Current Energy", "Subconscious Message", "Obstacles", "Recommended Action", "Resulting Energy"],
  categoryReading: [], // Dinamik, kart sayısına göre
};

// Kart verisi erişimi
export function getTarotCardByName(name: string): TarotCard | undefined {
  return tarotCards.find((card: TarotCard) => card.name === name);
}

// Görsel yolu
export function getTarotCardImage(card: TarotCard): string {
  return card.img
    ? `/images/tarot_card_images/${card.img}`
    : `/images/tarot_card_images/${card.name.replace(/ /g, "_").toLowerCase()}.jpg`;
}

// Spread mapping (güncellenmiş)
export function mapSelectedCardsToSpread(
  spreadType: SpreadType,
  cards: TarotCard[]
): Record<string, TarotCard> {
  const spread: Record<string, TarotCard> = {};
  const positions = spreadPositions[spreadType.name] || [];
  if (spreadType.name === "categoryReading") {
    cards.forEach((card, i) => {
      spread[`Card ${i + 1}`] = card;
    });
  } else {
    positions.forEach((pos, i) => {
      if (cards[i]) spread[pos] = cards[i];
    });
  }
  return spread;
}

// Prompt ana fonksiyonu
export function buildTarotPrompt({
  spreadName,
  category,
  spread,
  locale,
  userInfo,
  customPrompt,
  formatInstructions,
  personaDescription,
  analysisFocus,
}: {
  spreadName: string;
  category: string;
  spread: Record<string, TarotCard>;
  locale: string;
  userInfo?: { name?: string; age?: number; gender?: string };
  customPrompt?: string;
  formatInstructions: string;
  personaDescription: string;
  analysisFocus: string;
}) {
  const userInfoSection = userInfo
    ? `User Information:\n${userInfo.name ? "- Name: " + userInfo.name + "\n" : ""}${userInfo.age ? "- Age: " + userInfo.age + "\n" : ""}${userInfo.gender ? "- Gender: " + userInfo.gender + "\n" : ""}Personalize the reading based on this information where relevant to the '${category}' context.`
    : "User information not provided; provide a general interpretation.";
  const customPromptSection = customPrompt
    ? `User's custom question/focus: "${customPrompt}"\nAddress this specifically in your interpretation.`
    : `No specific question provided; focus on the general ${category} context.`;
  const cardDetails = Object.entries(spread)
    .map(
      ([position, card]) =>
        `- Position: "${position}"\n  - Card: "${card.name}"\n  - Keywords: ${JSON.stringify(card.keywords)}\n  - Light Meanings: ${JSON.stringify(card.meanings.light)}\n  - Shadow Meanings: ${JSON.stringify(card.meanings.shadow)}`
    )
    .join("\n");

  return `
SYSTEM: ${personaDescription}
You MUST generate the response *only* in the language with code: "${locale}".
Adhere strictly to the specified Markdown format using '###' for main sections.
Do not include technical placeholders or instructions to yourself in the final output.
Focus on providing insightful, detailed, creative, and empathetic interpretations related to the user's context.

USER:
Tarot Reading Request
---------------------
Spread Type: ${spreadName}
Category/Focus: ${category}
Language for Response: ${locale}

${userInfoSection}

${customPromptSection}

Drawn Cards:
------------
${cardDetails}

Interpretation Format Required:
-----------------------------
${formatInstructions}

${analysisFocus}
`;
}

// Örnek: Single Card Prompt
export function generatePromptForSingleCard({
  category,
  card,
  customPrompt,
  locale,
  userInfo,
}: {
  category: string;
  card: TarotCard;
  customPrompt?: string;
  locale: string;
  userInfo?: { name?: string; age?: number; gender?: string };
}) {
  const spread = { "Single Card": card };
  const spreadName = "Single Card Reading";
  const persona = "You are 'Astral Tarot', a compassionate and direct Tarot reader providing concise yet insightful guidance.";
  const analysisFocus = "Focus on the core message of this single card regarding the user's category/question.";
  const format = `
### Card's Essence
[Provide a brief, evocative description of the card's core energy.]

### Interpretation for ${category}
[Explain the card's primary meaning in the context of the user's category (${category}) and their custom prompt, if provided. Personalize if user info exists.]

### Guidance
[Offer one clear, actionable piece of advice based on the card's message for the user's situation.]
`;

  return buildTarotPrompt({
    spreadName,
    category,
    spread,
    locale,
    userInfo,
    customPrompt,
    formatInstructions: format,
    personaDescription: persona,
    analysisFocus,
  });
}

export function generatePromptForPastPresentFuture({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Past - Present - Future Spread";
  const persona = "You are 'Astral Tarot', a wise Tarot reader skilled in interpreting the flow of time and its influence.";
  const analysisFocus = "Analyze the progression from past influences to the present situation and potential future outcomes regarding the '${category}' category.";
  const format = `
### Past Influences (${spread.Past?.name || "?"})
[Analyze the card in the 'Past' position. How do past events or energies affect the current situation related to '${category}'? Personalize.]

### Current Situation (${spread.Present?.name || "?"})
[Analyze the card in the 'Present' position. What is the core energy or challenge the user is facing now regarding '${category}'? Personalize.]

### Potential Future (${spread.Future?.name || "?"})
[Analyze the card in the 'Future' position. What is the likely direction or outcome if the current path continues? What advice does this card offer for the future related to '${category}'? Personalize.]

### Synthesis and Guidance
[Summarize the connection between the three cards. Provide overall advice and actionable steps for the user based on the reading concerning '${category}'. Address the custom prompt if provided.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForProblemSolution({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Problem - Reason - Solution Spread";
  const persona = "You are 'Astral Tarot', a pragmatic and insightful Tarot reader focused on identifying challenges and finding solutions.";
  const analysisFocus = "Clearly define the problem, analyze its root cause (reason), and offer a concrete solution based on the cards regarding the '${category}' category.";
  const format = `
### The Problem (${spread.Problem?.name || "?"})
[Describe the core problem or challenge as represented by this card in the context of '${category}'. Personalize.]

### Root Cause / Contributing Factors (${spread.Reason?.name || "?"})
[Analyze the card representing the reason or underlying factors contributing to the problem related to '${category}'. Personalize.]

### The Path to Solution (${spread.Solution?.name || "?"})
[Analyze the card suggesting the solution. What steps, mindset shifts, or actions are recommended to overcome the problem regarding '${category}'? Personalize.]

### Action Plan and Summary
[Synthesize the reading. Provide clear, actionable steps based on the 'Solution' card. Briefly summarize the overall dynamic. Address the custom prompt.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForFiveCardPath({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Five Card Path Spread";
  const persona = "You are 'Astral Tarot', guiding users along their path with insights on past, present, challenges, future, and outcome.";
  const analysisFocus = "Analyze the user's journey regarding '${category}', covering the foundation, present situation, obstacles, potential future, and final outcome.";
  const format = `
### Foundation / Past Influence (${spread["Foundation"]?.name || "?"})
[Analyze the past events or foundation upon which the current situation regarding '${category}' is built.]

### Present Situation (${spread["Current Situation"]?.name || "?"})
[Analyze the current core circumstances or energies related to '${category}'.]

### Obstacles / Challenges (${spread["Obstacles"]?.name || "?"})
[Analyze the main challenges or obstacles the user faces on this path regarding '${category}'.]

### Near Future / Potential (${spread["Potential"]?.name || "?"})
[Analyze the potential developments or energies emerging in the near future related to '${category}'.]

### Best Outcome (${spread["Best Outcome"]?.name || "?"})
[Analyze the likely culmination or resolution of this path based on the other cards.]

### Synthesis and Path Guidance
[Summarize the journey depicted. Provide guidance on navigating the challenges and leveraging opportunities concerning '${category}'. Address the custom prompt.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForRelationshipSpread({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Relationship Spread";
  const persona = "You are 'Astral Tarot', specializing in relationship dynamics, offering compassionate and clear insights.";
  const analysisFocus = "Analyze the perspectives of both individuals ('You', 'Partner'), the relationship's foundation (Past, Present, Future), and its dynamics (Strengths, Challenges) regarding the '${category}' focus.";
  const format = `
### Your Perspective (${spread["You"]?.name || "?"})
[Analyze your viewpoint, feelings, and contribution to the relationship dynamics in the '${category}' context. Personalize.]

### Partner's Perspective (${spread["Partner"]?.name || "?"})
[Analyze your partner's viewpoint, feelings, and contribution as suggested by the card. Personalize.]

### Relationship Foundation (${spread["Relationship"]?.name || "?"})
[Analyze the foundation of the relationship.]

### Strengths (${spread["Strengths"]?.name || "?"})
[Identify the key strengths and positive aspects supporting the relationship.]

### Weaknesses (${spread["Weaknesses"]?.name || "?"})
[Identify the main challenges or areas needing attention.]

### Actions Needed (${spread["Actions Needed"]?.name || "?"})
[What actions or changes are needed to improve the relationship?]

### Outcome (${spread["Outcome"]?.name || "?"})
[Analyze the likely outcome or direction of the relationship.]

### Synthesis and Relationship Guidance
[Summarize the overall dynamic. Provide advice for nurturing strengths, addressing challenges, and improving communication or understanding within the '${category}' context. Address the custom prompt.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForCelticCross({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Celtic Cross Spread";
  const persona = "You are 'Astral Tarot', a master Tarot reader providing deep, comprehensive insights using the traditional Celtic Cross.";
  const analysisFocus = "Provide a detailed, position-by-position analysis of the Celtic Cross spread, synthesizing the insights to illuminate the user's situation regarding the '${category}' category.";
  const format = `
### 1. The Heart of the Matter / Present Situation (${spread["Current Situation"]?.name || "?"})
[Analyze the central issue or current energy regarding '${category}'.]

### 2. The Challenge (${spread["Challenge"]?.name || "?"})
[Analyze the immediate obstacle or conflicting force regarding '${category}'.]

### 3. The Foundation / Subconscious (${spread["Subconscious"]?.name || "?"})
[Analyze the underlying factors, roots of the situation, or subconscious influences regarding '${category}'.]

### 4. The Recent Past (${spread["Past"]?.name || "?"})
[Analyze past events or influences that led to the present situation regarding '${category}'.]

### 5. The Crown / Conscious Goals / Best Outcome (${spread["Possible Future"]?.name || "?"})
[Analyze conscious goals, awareness, or the best possible outcome in the current circumstances regarding '${category}'.]

### 6. The Near Future (${spread["Near Future"]?.name || "?"})
[Analyze events or energies likely to emerge soon regarding '${category}'.]

### 7. Your Stance / Personal Influence (${spread["Personal Stance"]?.name || "?"})
[Analyze the user's own attitude, perspective, or influence on the situation regarding '${category}'.]

### 8. External Environment / Others' Influence (${spread["External Influences"]?.name || "?"})
[Analyze external factors, people, or environmental influences regarding '${category}'.]

### 9. Hopes and Fears (${spread["Hopes/Fears"]?.name || "?"})
[Analyze the user's hopes, fears, or hidden expectations related to the situation regarding '${category}'.]

### 10. The Final Outcome (${spread["Final Outcome"]?.name || "?"})
[Analyze the likely long-term result or culmination of the situation based on the preceding cards regarding '${category}'.]

### Overall Synthesis and Guidance
[Summarize the key messages from the spread. Connect the positions and provide holistic guidance and actionable advice specifically for the '${category}' context. Address the custom prompt.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForYearlySpread({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Yearly Spread";
  const persona = "You are 'Astral Tarot', foreseeing the themes and energies of the year ahead, month by month.";
  const analysisFocus = "Provide a month-by-month forecast for the '${category}' context, followed by an overall summary and guidance for the year.";
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let format = months.map(m => `### ${m} (${spread[m]?.name || "?"})\n[Analyze this card's significance for this period/theme regarding '${category}'. Personalize.]`).join("\n\n");
  if (spread["Yearly Summary"]) {
    format += `\n\n### Yearly Summary (${spread["Yearly Summary"].name})\n[Summarize the year's main themes, challenges, and opportunities.]`;
  }
  format += `\n\n### Guidance for the Year Ahead\n[Synthesize the monthly insights. Offer overall guidance, identify key themes, challenges, and opportunities for the year regarding '${category}'. Address the custom prompt.]`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForMindBodySpirit({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Mind - Body - Spirit Spread";
  const persona = "You are 'Astral Tarot', exploring the holistic connection between mind, body, and spirit.";
  const analysisFocus = "Analyze the state of the user's mind, body, and spirit, and their interplay, especially concerning the '${category}' focus.";
  const format = `
### Mind (${spread["Mind"]?.name || "?"})
[Analyze the card representing the user's current mental state, thoughts, and clarity regarding '${category}'. Personalize.]

### Body (${spread["Body"]?.name || "?"})
[Analyze the card representing the user's physical well-being, energy levels, and connection to their body regarding '${category}'. Personalize.]

### Spirit (${spread["Spirit"]?.name || "?"})
[Analyze the card representing the user's spiritual connection, intuition, and inner self regarding '${category}'. Personalize.]

### Holistic Balance and Advice
[Discuss the interplay between mind, body, and spirit based on the cards. Offer guidance on achieving better balance and well-being in the '${category}' context. Address the custom prompt.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForAstroLogicalCross({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Astrological Cross Spread";
  const persona = "You are 'Astral Tarot', blending tarot wisdom with astrological insights for a deeper understanding.";
  const analysisFocus = "Interpret the cards through an astrological lens, focusing on identity, emotions, external factors, challenges, and destiny related to '${category}'.";
  const format = `
### 1. Identity / Self (${spread["Identity"]?.name || "?"})
[Analyze how this card reflects the user's core identity or self-perception in the context of '${category}'.]

### 2. Emotional State / Inner World (${spread["Emotional State"]?.name || "?"})
[Analyze the card representing the user's current emotional landscape regarding '${category}'.]

### 3. External Influences / Environment (${spread["External Influences"]?.name || "?"})
[Analyze the card showing external forces or environmental factors impacting the situation.]

### 4. Challenges / Karmic Lessons (${spread["Challenges"]?.name || "?"})
[Analyze the primary challenge or potential karmic lesson presented.]

### 5. Destiny / Potential Outcome (${spread["Destiny"]?.name || "?"})
[Analyze the card indicating the potential path or ultimate destiny related to the situation.]

### Astrological Synthesis and Guidance
[Integrate the insights from an astrological perspective (even if general). Provide guidance based on the cross spread for the '${category}' context. Address the custom prompt.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForBrokenHeart({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Broken Heart Spread";
  const persona = "You are 'Astral Tarot', offering gentle guidance and support for emotional healing.";
  const analysisFocus = "Focus on understanding the source of pain, emotional impact, lessons learned, hope, and the path to healing regarding '${category}'.";
  const format = `
### Source of Pain (${spread["Source of Pain"]?.name || "?"})
[Analyze the card representing the root cause or situation leading to the emotional pain in the '${category}' context.]

### Emotional Wounds (${spread["Emotional Wounds"]?.name || "?"})
[Analyze the card describing the current emotional state and the depth of the hurt.]

### Inner Conflict (${spread["Inner Conflict"]?.name || "?"})
[Analyze the card suggesting the key lesson or understanding to be gained from this experience.]

### Healing Process (${spread["Healing Process"]?.name || "?"})
[Analyze the card providing guidance on the steps or mindset needed for emotional healing and moving forward.]

### New Beginning (${spread["New Beginning"]?.name || "?"})
[Analyze the card offering hope, potential positive outcomes, or strengths to draw upon.]

### Compassionate Guidance for Healing
[Summarize the reading with empathy. Offer gentle, actionable advice for the healing process concerning '${category}'. Address the custom prompt.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForDreamInterpretation({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Dream Interpretation Spread";
  const persona = "You are 'Astral Tarot', adept at unveiling the hidden meanings within dreams using tarot symbolism.";
  const analysisFocus = "Interpret the tarot cards as symbols reflecting the user's dream, connecting them to past influences, present feelings, and future messages related to '${category}'.";
  const format = `
### Dream Symbol (${spread["Dream Symbol"]?.name || "?"})
[Analyze how this card relates to past experiences or subconscious elements reflected in the dream, concerning '${category}'.]

### Emotional Response (${spread["Emotional Response"]?.name || "?"})
[Analyze the card representing the core emotion or message the dream is conveying about the present situation regarding '${category}'.]

### Message (${spread["Message"]?.name || "?"})
[Analyze the card offering insight or guidance for the future based on the dream's message.]

### Unveiling the Dream's Message
[Synthesize the interpretation. What is the overall message or insight the dream offers regarding '${category}'? Provide guidance based on this understanding. Address the custom prompt.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForHorseshoeSpread({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Horseshoe Spread";
  const persona = "You are 'Astral Tarot', providing a comprehensive overview of a situation using the Horseshoe spread.";
  const analysisFocus = "Analyze the situation regarding '${category}' by examining past, present, future, internal factors (goals/fears), external influences, advice, and the likely outcome.";
  const format = `
### 1. Past Influence (${spread["Past"]?.name || "?"})
[Analyze relevant past factors influencing the current '${category}' situation.]

### 2. Present Situation (${spread["Present"]?.name || "?"})
[Analyze the core energy and circumstances of the present regarding '${category}'.]

### 3. Near Future Developments (${spread["Future"]?.name || "?"})
[Analyze potential events or shifts likely to occur soon regarding '${category}'.]

### 4. The User / Goals / Fears (${spread["Goals/Fears"]?.name || "?"})
[Analyze the user's role, attitude, goals, or fears concerning the situation.]

### 5. External Environment / Others' Influence (${spread["External Influences"]?.name || "?"})
[Analyze how external factors or other people are impacting the situation.]

### 6. Recommended Course of Action / Advice (${spread["Advice"]?.name || "?"})
[Analyze the card offering the best advice or course of action.]

### 7. Final Outcome (${spread["Outcome"]?.name || "?"})
[Analyze the most likely outcome based on the spread.]

### Horseshoe Synthesis and Guidance
[Summarize the key insights from each position. Provide integrated guidance and actionable advice for navigating the situation concerning '${category}'. Address the custom prompt.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForCareerPathSpread({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Career Path Spread";
  const persona = "You are 'Astral Tarot', offering guidance and clarity on professional journeys and career decisions.";
  const analysisFocus = "Analyze the user's career situation regarding '${category}', focusing on the current state, obstacles, opportunities, inherent strengths, and potential outcome.";
  const format = `
### Current Career Situation (${spread["Current Situation"]?.name || "?"})
[Analyze the card reflecting the user's present professional circumstances related to '${category}'.]

### Obstacles and Challenges (${spread["Obstacles"]?.name || "?"})
[Analyze the main obstacles or challenges hindering career progress in the '${category}' context.]

### Opportunities and Potential (${spread["Opportunities"]?.name || "?"})
[Analyze the card highlighting potential opportunities, new paths, or areas for growth.]

### Strengths and Resources (${spread["Strengths"]?.name || "?"})
[Analyze the inherent strengths, skills, or resources the user possesses related to their career.]

### Likely Outcome / Future Path (${spread["Outcome"]?.name || "?"})
[Analyze the card suggesting the likely outcome or direction of the user's career path.]

### Career Path Synthesis and Strategy
[Summarize the reading. Provide strategic advice for overcoming obstacles, seizing opportunities, and leveraging strengths in the '${category}' field. Address the custom prompt.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForFullMoonSpread({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = "Full Moon Spread";
  const persona = "You are 'Astral Tarot', attuned to lunar cycles, revealing insights brought to light by the Full Moon.";
  const analysisFocus = "Interpret the cards in the context of the Full Moon's energy (illumination, culmination, release) regarding '${category}'. Focus on past cycle completion, present energies, subconscious messages, obstacles, actions, and resulting energy.";
  const format = `
### Past Cycle / What is Culminating (${spread["Past Cycle"]?.name || "?"})
[Analyze what is coming to completion or being fully illuminated from the past cycle regarding '${category}'.]

### Present Energy / What is Revealed (${spread["Current Energy"]?.name || "?"})
[Analyze the core energy or truth being revealed by the Full Moon now.]

### Subconscious Message / What to Release (${spread["Subconscious Message"]?.name || "?"})
[Analyze the subconscious patterns, emotions, or attachments that need to be acknowledged or released.]

### Obstacles to Release / Illumination (${spread["Obstacles"]?.name || "?"})
[Analyze the main challenge hindering release or full understanding.]

### Recommended Action / Integration (${spread["Recommended Action"]?.name || "?"})
[Analyze the advised action or focus for integrating the Full Moon's insights.]

### Resulting Energy / Moving Forward (${spread["Resulting Energy"]?.name || "?"})
[Analyze the energy state or potential after integrating the Full Moon's lessons.]

### Full Moon Synthesis and Ritual Suggestion
[Summarize the key themes of release and culmination. Offer a simple ritual or reflection suggestion aligned with the Full Moon energy and the reading for the '${category}' context. Address the custom prompt.]
`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
}

export function generatePromptForCategoryReading({ category, spread, customPrompt, locale, userInfo }: { category: string; spread: Record<string, TarotCard>; customPrompt?: string; locale: string; userInfo?: { name?: string; age?: number; gender?: string }; }) {
  const spreadName = `${category} Category Reading (${Object.keys(spread).length} cards)`;
  const persona = "You are 'Astral Tarot', providing focused insights specifically for the chosen category: '${category}'.";
  const analysisFocus = "Analyze how these cards specifically relate to the '${category}' context for the user.";
  let format = `### Card Insights for ${category}\n`;
  Object.entries(spread).forEach(([pos, card]) => {
    format += `- Position: ${pos} (${card.name})\n  [Analyze this card's relevance to the '${category}' situation. Personalize if possible.]\n`;
  });
  format += `\n### Overall Guidance for ${category}\n[Synthesize the reading and provide actionable advice focused solely on the '${category}' context. Address the custom prompt.]`;
  return buildTarotPrompt({ spreadName, category, spread, locale, userInfo, customPrompt, formatInstructions: format, personaDescription: persona, analysisFocus });
} 