"use client";
import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import categories from '@/lib/data/categories.json';
import spreads from '@/lib/data/spreads.json';

interface PrintFunctionsProps {
  translations: any;
  category: string;
  spread: string;
  selectedCards: any[];
  spreadMap: any;
  aiResult: string;
  onPrint?: () => void;
  onPDFDownload?: () => void;
}

const getImageAsBase64 = (url: string): Promise<string> => {
  return fetch(url)
    .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
        return response.blob();
    })
    .then(blob => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
};

const getSvgAsPngBase64 = (url: string, size: number = 100): Promise<string> => {
    return fetch(url)
      .then(response => {
          if (!response.ok) throw new Error(`Failed to fetch SVG: ${url}`);
          return response.text();
      })
      .then(svgText => {
          return new Promise<string>((resolve, reject) => {
              const modifiedSvgText = svgText.replace(/<rect[^>]+fill="black"[^>]*\/>/g, '');
              const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(modifiedSvgText)));
              
              const canvas = document.createElement('canvas');
              canvas.width = size;
              canvas.height = size;
              const ctx = canvas.getContext('2d');
              if (!ctx) return reject(new Error('Could not get canvas context'));

              const img = new Image();
              img.onload = () => {
                  ctx.drawImage(img, 0, 0, size, size);
                  resolve(canvas.toDataURL('image/png'));
              };
              img.onerror = () => reject(new Error('Failed to load SVG into image element'));
              img.src = svgDataUrl;
          });
      });
};

// Font loading functions
const loadFontAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load font: ${url}`);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const addFontsToPDF = async (pdf: jsPDF) => {
  try {
    // Load Cabin font for normal text
    const cabinFontBase64 = await loadFontAsBase64('https://fonts.gstatic.com/s/cabin/v26/u-4X0qWljRw-PfU81xCKCpdpbgZJl6XvptCs.woff2');
    pdf.addFileToVFS('Cabin-normal.woff2', cabinFontBase64);
    pdf.addFont('Cabin-normal.woff2', 'Cabin', 'normal');
    
    // Load Cinzel font for decorative headings
    const cinzelFontBase64 = await loadFontAsBase64('https://fonts.gstatic.com/s/cinzel/v24/8vIU387zzZjfLWGsb8q8aJ4.woff2');
    pdf.addFileToVFS('Cinzel-normal.woff2', cinzelFontBase64);
    pdf.addFont('Cinzel-normal.woff2', 'Cinzel', 'normal');
  } catch (error) {
    console.warn('Could not load custom fonts, using default fonts:', error);
  }
};

// Add page numbers function
const addPageNumbers = (pdf: jsPDF, pageHeight: number, pageWidth: number) => {
  const pageCount = (pdf as any).internal.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    
    // Do not add page number to the cover page
    if (i > 1) {
      // Add Page Number
      pdf.setFont('Cabin', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(170, 170, 170); // Slightly dimmer
      pdf.text(String(i - 1), pageWidth / 2, pageHeight - 15, { align: 'center' });
    }
  }
};

// --- HELPER FUNCTION FOR DYNAMIC LAYOUT ---
const getLayoutParams = (totalCards: number) => {
  if (totalCards <= 4) {
    return { cardsPerRow: totalCards, cardWidth: 40, cardHeight: 60, cardSpacing: 10 };
  }
  if (totalCards <= 6) {
    return { cardsPerRow: 3, cardWidth: 40, cardHeight: 60, cardSpacing: 10 };
  }
  if (totalCards <= 9) {
    return { cardsPerRow: 3, cardWidth: 35, cardHeight: 52, cardSpacing: 10 };
  }
  if (totalCards <= 12) { // e.g., Celtic Cross (10)
    return { cardsPerRow: 4, cardWidth: 35, cardHeight: 52, cardSpacing: 10 };
  }
  // For 13 cards (Yearly Spread) and more, fit them onto one page by making them smaller.
  return { cardsPerRow: 5, cardWidth: 28, cardHeight: 42, cardSpacing: 6 };
};

export const PrintFunctions: React.FC<PrintFunctionsProps> = ({
  translations,
  category,
  spread,
  selectedCards,
  spreadMap,
  aiResult,
  onPrint,
  onPDFDownload
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const readingResult = document.getElementById('reading-result');
    if (readingResult) {
      readingResult.classList.add('print-mode');
      window.print();
      setTimeout(() => readingResult.classList.remove('print-mode'), 1000);
    }
    if (onPrint) onPrint();
  };

  const handlePDFDownload = async () => {
    setIsGeneratingPDF(true);
    
    try {
        console.log("--- DEBUG: Data received by PrintFunctions ---", { spreadMap });

        // --- ROBUSTNESS CHECK (ENHANCED) ---
        // Ensure spreadMap is valid and all cards have a usable identifier.
        if (!spreadMap || Object.values(spreadMap).some((card: any) => !card || (!card.id && !card.key && !card.img))) {
            console.error("PDF Generation Error: Invalid spreadMap data. Some cards are missing a usable identifier (id, key, or img).", spreadMap);
            alert(translations.reading_error_invalid_data || 'Cannot generate PDF due to missing card data. Please refresh and try again.');
            setIsGeneratingPDF(false);
            return;
        }

        let revealedCards: Record<string, string> = JSON.parse(localStorage.getItem('revealedCards') || '{}');

        // Fallback: If localStorage is empty, generate images on the fly from spreadMap
        if ((!revealedCards || Object.keys(revealedCards).length === 0) && spreadMap) {
            console.warn("Card images not in localStorage. Generating on the fly.");
            try {
                const imagePromises = Object.values(spreadMap).map(async (card: any) => {
                    // --- Enhanced Image Path Logic ---
                    let cardIdentifier = card.id || card.key; // Prefer id or key
                    if (!cardIdentifier && card.img) {
                        cardIdentifier = card.img.replace('.jpg', '');
                    }
                    if (!cardIdentifier) {
                        console.error("Could not determine card identifier for PDF image generation", card);
                        throw new Error("Invalid card data: missing id, key, or img field.");
                    }

                    const imageUrl = `/images/tarot_card_images/${cardIdentifier}.jpg`;
                    const base64 = await getImageAsBase64(imageUrl);
                    return { id: cardIdentifier, base64 };
                });

                const images = await Promise.all(imagePromises);

                revealedCards = images.reduce((acc, { id, base64 }) => {
                    if(id) acc[id] = base64;
                    return acc;
                }, {} as Record<string, string>);
                
                // Save back to localStorage for caching
                localStorage.setItem('revealedCards', JSON.stringify(revealedCards));

            } catch (imageError) {
                console.error("Error generating card images on-the-fly:", imageError);
                alert(translations.reading_error_no_cards || 'Could not load card images for the PDF. Please ensure you have a connection and try again.');
                setIsGeneratingPDF(false);
                return;
            }
        }
      
        // Final check if we have cards after fallback
        if (!revealedCards || Object.keys(revealedCards).length === 0) {
            alert(translations.reading_error_no_cards || 'Card data is missing. Cannot generate PDF.');
            setIsGeneratingPDF(false);
            return;
        }

      const categoryData = categories.find(c => c.key === category);
      const spreadData = spreads.find(s => s.key === spread) as any;

      const [
        categoryImageBase64,
        spreadImageBase64,
        pageBackgroundBase64,
        coverBackgroundBase64
      ] = await Promise.all([
        categoryData ? getImageAsBase64(categoryData.image) : Promise.resolve(''),
        spreadData ? getImageAsBase64(spreadData.image) : Promise.resolve(''),
        getImageAsBase64('/images/pdf_background.png').catch(() => ''), // The old background for content pages
        getImageAsBase64('/images/pdf_cover_background.png').catch(() => '') // The new cover background
      ]);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const sideMargin = 20; // Margin for left and right
      const topMargin = 40; // Margin for top to avoid symbol
      const bottomMargin = 40; // Margin for bottom to avoid symbol

      // Load custom fonts
      await addFontsToPDF(pdf);

      const addPageWithBackground = (isFirstPage = false) => {
        if (!isFirstPage) pdf.addPage();
        if (pageBackgroundBase64) {
            pdf.addImage(pageBackgroundBase64, 'PNG', 0, 0, pageWidth, pageHeight, '', 'FAST');
        } else {
            // Fallback to old background if new one fails to load
            pdf.setFillColor(15, 23, 42);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        }
      };
      
      // --- PAGE 1: COVER (New Design) ---
      // Use the new, specific cover background
      if (coverBackgroundBase64) {
        pdf.addImage(coverBackgroundBase64, 'PNG', 0, 0, pageWidth, pageHeight, '', 'FAST');
      } else {
        // Fallback for cover if it fails to load
        addPageWithBackground(true); 
      }
      
      // Get language-sensitive names
      const categoryLabel = translations[`category_${category}_label`] || categoryData?.name || category;
      const spreadTitle = translations[`spread_${spread}_title`] || spreadData?.name || spread;

      // Draw category and spread as "chips" with date below
      if (categoryLabel && spreadTitle) {
        const chipHeight = 10;
        const chipPadding = 6;
        const chipSpacing = 5;
        const chipFontSize = 14;
        const chipsY = pageHeight - (pageHeight / 3.7);

        pdf.setFont('Cinzel', 'normal');
        pdf.setFontSize(chipFontSize);

        // Calculate widths
        const categoryTextWidth = pdf.getStringUnitWidth(categoryLabel) * chipFontSize / (pdf as any).internal.scaleFactor;
        const spreadTextWidth = pdf.getStringUnitWidth(spreadTitle) * chipFontSize / (pdf as any).internal.scaleFactor;
        const categoryChipWidth = categoryTextWidth + chipPadding * 2;
        const spreadChipWidth = spreadTextWidth + chipPadding * 2;
        const totalChipsWidth = categoryChipWidth + spreadChipWidth + chipSpacing;
        
        // Calculate starting X to center the whole block, with a slight offset to the left
        const horizontalOffset = 5; // Nudge to the left by 5mm
        const startX = ((pageWidth - totalChipsWidth) / 2) - horizontalOffset;
        const spreadChipX = startX + categoryChipWidth + chipSpacing;

        // --- Gradient Chip Generation ---
        const createGradientImage = (width: number, height: number): string => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return '';

            // Gradient compatible with the background (dark purple to lighter purple, transparent)
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, 'rgba(46, 26, 70, 0.5)');  // Darker, semi-transparent purple
            gradient.addColorStop(1, 'rgba(119, 78, 149, 0.4)'); // Lighter, semi-transparent purple

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            return canvas.toDataURL('image/png');
        };

        const categoryGradientImg = createGradientImage(categoryChipWidth, chipHeight);
        const spreadGradientImg = createGradientImage(spreadChipWidth, chipHeight);

        // Draw gradient images as chip backgrounds
        if (categoryGradientImg) {
            pdf.addImage(categoryGradientImg, 'PNG', startX, chipsY, categoryChipWidth, chipHeight);
        }
        if (spreadGradientImg) {
            pdf.addImage(spreadGradientImg, 'PNG', spreadChipX, chipsY, spreadChipWidth, chipHeight);
        }
        
        // Draw text on chips
        pdf.setTextColor(255, 215, 0); // Vibrant Gold color
        pdf.text(categoryLabel, startX + chipPadding, chipsY + chipHeight / 2, { baseline: 'middle' });
        pdf.text(spreadTitle, spreadChipX + chipPadding, chipsY + chipHeight / 2, { baseline: 'middle' });

        // Add creation date at the very bottom
        const dateY = pageHeight - 15; // Positioned at the bottom
        const currentDate = new Date().toLocaleDateString();
        pdf.setFont('Cabin', 'normal');
        pdf.setFontSize(12); // Increased font size
        pdf.setTextColor(200, 200, 200); // Light gray for subtlety
        pdf.text(currentDate, pageWidth / 2, dateY, { align: 'center' });
      }
      
      // --- PAGE 2: CARDS ---
      addPageWithBackground();
      
      const totalCards = Object.keys(spreadMap).length;
      const { cardsPerRow, cardWidth, cardHeight, cardSpacing } = getLayoutParams(totalCards);
      
      const cardPositions = Object.keys(spreadMap);
      const rows = [];
      for (let i = 0; i < totalCards; i += cardsPerRow) {
          rows.push(cardPositions.slice(i, i + cardsPerRow));
      }

      const totalRows = rows.length;
      const blockHeight = totalRows * (cardHeight + 25);
      const availableHeight = pageHeight - topMargin - bottomMargin;
      let startY = topMargin + (availableHeight - blockHeight) / 2;
      if (startY < topMargin + 15) startY = topMargin + 15;

      rows.forEach((row, rowIndex) => {
          const rowCards = row.length;
          const rowWidth = rowCards * cardWidth + (rowCards - 1) * cardSpacing;
          const rowStartX = (pageWidth - rowWidth) / 2;

          row.forEach((position, cardIndexInRow) => {
              const card = spreadMap[position as keyof typeof spreadMap] as any;
              let cardIdentifier = card.id || card.key;
              if (!cardIdentifier && card.img) {
                  cardIdentifier = card.img.replace('.jpg', '');
              }
              const cardImageBase64 = revealedCards[cardIdentifier];

              const x = rowStartX + cardIndexInRow * (cardWidth + cardSpacing);
              const y = startY + rowIndex * (cardHeight + 30);

              pdf.setTextColor(255, 215, 0);
              pdf.setFontSize(10);
              pdf.setFont('Cabin', 'normal');
              pdf.text(position, x + cardWidth / 2, y - 4, { align: 'center' });

              if (cardImageBase64) {
                  pdf.addImage(cardImageBase64, 'JPEG', x, y, cardWidth, cardHeight);
              } else {
                  pdf.setDrawColor(255, 215, 0);
                  pdf.setLineWidth(0.5);
                  pdf.rect(x, y, cardWidth, cardHeight, 'S');
                  pdf.text('?', x + cardWidth / 2, y + cardHeight / 2, { align: 'center' });
              }

              pdf.setTextColor(220, 220, 220);
              pdf.setFontSize(8);
              pdf.setFont('Cabin', 'normal');
              const cardName = card.name || "Unknown";
              const splitCardName = pdf.splitTextToSize(cardName, cardWidth);
              pdf.text(splitCardName, x + cardWidth / 2, y + cardHeight + 5, { align: 'center' });
          });
      });


      // --- PAGE 3+: AI INTERPRETATION (with smart section-level page breaks) ---
      addPageWithBackground();
      
      let currentY = topMargin + 5;
      const contentWidth = pageWidth - sideMargin * 2;
      
      // 1. Group content into logical sections (heading + its paragraphs)
      const sections: { heading: string | null; content: string[] }[] = [];
      let currentSection: { heading: string | null; content: string[] } = { heading: null, content: [] };

      aiResult.split('\n').forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('#')) {
              if (currentSection.heading || currentSection.content.length > 0) {
                  sections.push(currentSection);
              }
              currentSection = { heading: trimmedLine, content: [] };
          } else if (trimmedLine) {
              currentSection.content.push(trimmedLine);
          }
      });
      if (currentSection.heading || currentSection.content.length > 0) {
          sections.push(currentSection);
      }
      
      // 2. Render sections with smart page breaks
      const getBlockProperties = (line: string, isHeading: boolean) => {
        let fontSize = 14, fontStyle = 'normal', color: [number, number, number] = [255, 255, 255], topMargin = isHeading ? 0 : 4;
        if (isHeading) {
          if (line.startsWith('# ')) { fontSize = 22; fontStyle = 'normal'; color = [255, 215, 0]; topMargin = 12; } // Gold
          else if (line.startsWith('## ')) { fontSize = 18; fontStyle = 'normal'; color = [196, 181, 253]; topMargin = 10; } // Lilac
          else if (line.startsWith('### ')) { fontSize = 16; fontStyle = 'normal'; color = [107, 229, 235]; topMargin = 8; } // Cyan
        }
        return { fontSize, fontStyle, color, topMargin };
      };

      sections.forEach(section => {
          // Calculate the total height of the section
          let sectionHeight = 0;
          if (section.heading) {
              const props = getBlockProperties(section.heading, true);
              pdf.setFontSize(props.fontSize);
              const text = pdf.splitTextToSize(section.heading.replace(/^#+\s*/, ''), contentWidth);
              sectionHeight += (text.length * props.fontSize * 0.6) + props.topMargin;
          }
          if (section.content.length > 0) {
              const props = getBlockProperties('', false);
              pdf.setFontSize(props.fontSize);
              const text = pdf.splitTextToSize(section.content.join('\n'), contentWidth);
              sectionHeight += (text.length * props.fontSize * 0.6) + props.topMargin;
          }

          // If section doesn't fit and it's not the first thing on a blank page, create a new page
          if (currentY > topMargin + 20 && currentY + sectionHeight > pageHeight - bottomMargin) {
            addPageWithBackground();
            currentY = topMargin;
          }
          
          // Render the section
          if (section.heading) {
            const props = getBlockProperties(section.heading, true);
            currentY += props.topMargin;
            pdf.setFont('Cinzel', props.fontStyle);
            pdf.setFontSize(props.fontSize);
            pdf.setTextColor(props.color[0], props.color[1], props.color[2]);
            const text = pdf.splitTextToSize(section.heading.replace(/^#+\s*/, ''), contentWidth);
            pdf.text(text, sideMargin, currentY);
            currentY += text.length * props.fontSize * 0.6;
          }
          if (section.content.length > 0) {
            const props = getBlockProperties('', false);
            currentY += props.topMargin;
            pdf.setFont('Cabin', props.fontStyle);
            pdf.setFontSize(props.fontSize);
            pdf.setTextColor(props.color[0], props.color[1], props.color[2]);
            const text = pdf.splitTextToSize(section.content.join('\n'), contentWidth);
            pdf.text(text, sideMargin, currentY);
            currentY += text.length * props.fontSize * 0.6;
          }
      });
      
      // Add page numbers to all pages
      addPageNumbers(pdf, pageHeight, pageWidth);
      
      const dateString = new Date().toISOString().split('T')[0];
      const filename = `tarot-reading-${category}-${spread}-${dateString}.pdf`;
      
      pdf.save(filename);
      
      if (onPDFDownload) onPDFDownload();
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(translations.reading_error || 'Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
        try {
          await navigator.share({
            title: translations.reading_share_title || 'My Tarot Reading',
            text: translations.reading_share_text || 'I am sharing my AI-interpreted tarot reading result!',
            url: window.location.href
          });
        } catch (error) {
          console.log('Share cancelled or failed');
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert(translations.reading_link_copied || 'Link copied to clipboard!');
        } catch (error) {
          console.error('Failed to copy link:', error);
          alert('Failed to copy link. Please copy the URL manually.');
        }
      }
  };

  const handleCopyText = async () => {
    try {
        const textToCopy = `My Tarot Reading\n\nCategory: ${category}\nSpread: ${spread}\n\n--- SELECTED CARDS ---\n${Object.entries(spreadMap).map(([pos, card]: [string, any]) => `${pos}: ${card.name}`).join('\n')}\n\n--- AI INTERPRETATION ---\n${aiResult.replace(/#/g, '')}`;
        await navigator.clipboard.writeText(textToCopy);
        alert(translations.reading_text_copied || 'Reading text copied to clipboard!');
    } catch (error) {
        console.error('Failed to copy text:', error);
        alert('Failed to copy text. Please select and copy manually.');
    }
  };

  return (
    <>
      <div className="flex items-center justify-center sm:justify-end gap-3 mb-6">
        <button
          onClick={handlePrint}
          className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
          title={translations.reading_print || "Print"}
        >
          🖨️
        </button>
        
        <button
          onClick={handlePDFDownload}
          disabled={isGeneratingPDF}
          className="p-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-gray-500 transition-all duration-300 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed"
          title={translations.reading_export_pdf || "Download PDF"}
        >
          {isGeneratingPDF ? '⏳' : '📄'}
        </button>
        
        <button
          onClick={handleShare}
          className="p-3 rounded-xl bg-green-600 hover:bg-green-700 transition-all duration-300 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
          title={translations.reading_share || "Share"}
        >
          📤
        </button>

        <button
          onClick={handleCopyText}
          className="p-3 rounded-xl bg-orange-600 hover:bg-orange-700 transition-all duration-300 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
          title={translations.copy_text || "Copy Text"}
        >
          📋
        </button>
      </div>

      <div 
        ref={contentRef}
        className="hidden"
        id="pdf-content"
      >
      </div>
    </>
  );
};

export default PrintFunctions; 