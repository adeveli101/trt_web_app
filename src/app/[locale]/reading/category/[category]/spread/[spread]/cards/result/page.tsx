import React from 'react';

export default function ResultPage() {
  // Placeholder kartlar ve spread bilgisi (gerçek veri entegrasyonu için props veya context kullanılabilir)
  const cards = [
    { name: 'The Fool', img: '/images/tarot_card_images/m00.jpg' },
    { name: 'The Magician', img: '/images/tarot_card_images/m01.jpg' },
    { name: 'The High Priestess', img: '/images/tarot_card_images/m02.jpg' },
  ];
  const spread = {
    label: 'Past-Present-Future',
    desc: 'Classic three-card spread to see your journey across time.',
    image: '/images/spreads/pastPresentFuture.png',
  };
  const aiResult = `In the past, you embraced new beginnings (The Fool). Now, your skills and willpower are shaping your present (The Magician). The future calls for intuition and reflection (The High Priestess). Trust the journey.`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 w-full">
      <div className="bg-white/80 rounded-xl shadow-lg p-8 text-gray-900 max-w-2xl w-full text-center">
        {/* Başlık ve spread görseli */}
        <div className="flex flex-col items-center mb-8">
          <img src={spread.image} alt={spread.label} className="w-28 h-28 object-contain rounded-xl shadow mb-4 border-2 border-yellow-300 bg-white/80" />
          <h1 className="text-2xl font-bold text-accent-gold drop-shadow mb-2">AI Tarot Result</h1>
          <p className="text-gray-700 text-base text-center mb-2 max-w-md">{spread.desc}</p>
        </div>
        {/* Kartlar */}
        <div className="flex flex-row justify-center gap-6 mb-8">
          {cards.map((card, i) => (
            <div key={card.name} className="flex flex-col items-center">
              <div className="w-20 h-32 rounded-lg shadow border border-purple-200 bg-white overflow-hidden mb-2">
                <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-medium text-gray-800 mt-1 drop-shadow">{card.name}</span>
            </div>
          ))}
        </div>
        {/* AI Yorum kutusu */}
        <div className="relative bg-white/90 rounded-xl shadow p-6 text-gray-900 max-w-xl w-full mx-auto border border-yellow-200 mt-4">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <img src="/images/ai_icon.png" alt="AI" className="w-8 h-8 rounded-full border border-yellow-300 bg-white shadow" />
            <span className="text-base font-bold text-accent-gold drop-shadow">AI Tarot Insight</span>
          </div>
          <div className="mt-6 text-base text-gray-800 leading-relaxed">
            {aiResult}
          </div>
        </div>
      </div>
    </div>
  );
} 