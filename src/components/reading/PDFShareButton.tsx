"use client";
import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import Button from '@/components/ui/button';
import { Download, Share2, FileText, CheckCircle } from 'lucide-react';

interface PDFShareButtonProps {
  category: string;
  spread: string;
  translations: any;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  contentRef: React.RefObject<HTMLDivElement>;
}

export default function PDFShareButton({ category, spread, translations, colors, contentRef }: PDFShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Dile göre tarih formatı
  const getLocalizedDate = () => {
    const date = new Date();
    const locale = document.documentElement.lang || 'tr';
    
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return date.toLocaleDateString(locale, dateOptions);
  };

  const generatePDF = async () => {
    if (!contentRef.current) return;

    setIsGenerating(true);
    setIsSuccess(false);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 25;
      const contentWidth = pageWidth - (2 * margin);
      
      let yPosition = margin;
      const lineHeight = 6;
      const sectionSpacing = 15;

      // Arka plan rengi - Mor gradient efekti
      pdf.setFillColor(26, 16, 59); // Koyu mor arka plan
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Üst dekoratif çizgi
      pdf.setDrawColor(122, 110, 153);
      pdf.setLineWidth(2);
      pdf.line(margin, yPosition - 10, pageWidth - margin, yPosition - 10);

      // Başlık - Büyük ve güzel
      pdf.setFontSize(28);
      pdf.setTextColor(255, 255, 255); // Beyaz metin
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${translations.tarot_reading || 'Tarot Yorumu'}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Alt başlık - Kategori ve Açılım
      pdf.setFontSize(18);
      pdf.setTextColor(224, 230, 255); // Açık beyaz
      pdf.setFont('helvetica', 'bold');
      const subtitle = `${category} - ${spread}`;
      pdf.text(subtitle, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Tarih - Güzel format ve dile göre
      pdf.setFontSize(12);
      pdf.setTextColor(122, 110, 153); // Açık mor
      pdf.setFont('helvetica', 'italic');
      const currentDate = getLocalizedDate();
      pdf.text(currentDate, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += sectionSpacing;

      // Alt dekoratif çizgi
      pdf.setDrawColor(122, 110, 153);
      pdf.setLineWidth(1);
      pdf.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
      yPosition += 10;

      // İçerik alanını parse et
      const contentText = contentRef.current.innerText || contentRef.current.textContent || '';
      
      // Metni bölümlere ayır
      const sections = parseContentIntoSections(contentText);
      
      pdf.setFontSize(11);
      pdf.setTextColor(224, 230, 255); // Açık beyaz metin
      pdf.setFont('helvetica', 'normal');

      for (const section of sections) {
        // Bölüm başlığı
        if (section.title) {
          // Bölüm başlığı arka planı
          pdf.setFillColor(44, 0, 62); // Koyu mor
          pdf.rect(margin - 5, yPosition - 8, contentWidth + 10, 12, 'F');
          
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(255, 255, 255); // Beyaz başlık
          pdf.text(section.title, margin, yPosition);
          yPosition += 15;
        }

        // Bölüm içeriği
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(224, 230, 255); // Açık beyaz

        const lines = section.content.split('\n').filter(line => line.trim().length > 0);
        
        for (const line of lines) {
          // Satır çok uzunsa böl
          const words = line.split(' ');
          let currentLine = '';
          
          for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const textWidth = pdf.getTextWidth(testLine);
            
            if (textWidth > contentWidth) {
              if (currentLine) {
                pdf.text(currentLine, margin, yPosition);
                yPosition += lineHeight;
                currentLine = word;
              } else {
                // Tek kelime çok uzun, zorla böl
                pdf.text(word, margin, yPosition);
                yPosition += lineHeight;
              }
            } else {
              currentLine = testLine;
            }
          }
          
          if (currentLine) {
            pdf.text(currentLine, margin, yPosition);
            yPosition += lineHeight;
          }

          // Sayfa sonu kontrolü
          if (yPosition > pageHeight - margin - 30) {
            // Yeni sayfa için arka plan
            pdf.addPage();
            pdf.setFillColor(26, 16, 59);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
            yPosition = margin;
          }
        }

        yPosition += 8; // Bölümler arası boşluk
      }

      // Alt bilgi - Güzel footer
      yPosition += 10;
      
      // Footer arka planı
      pdf.setFillColor(44, 0, 62);
      pdf.rect(margin - 5, yPosition - 5, contentWidth + 10, 15, 'F');
      
      pdf.setFontSize(10);
      pdf.setTextColor(122, 110, 153);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`${translations.generated_by || 'Oluşturan'}: Astral Tarot`, pageWidth / 2, yPosition + 5, { align: 'center' });

      const fileName = `tarot-reading-${category}-${spread}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert(translations.pdf_error || 'PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };

  // İçeriği bölümlere ayıran fonksiyon
  const parseContentIntoSections = (content: string) => {
    const sections = [];
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    let currentSection = { title: '', content: '' };
    let isInSection = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // PDF butonlarını ve gereksiz metinleri filtrele
      if (trimmedLine.includes('Download PDF') || 
          trimmedLine.includes('PDF İndir') ||
          trimmedLine.includes('Share') ||
          trimmedLine.includes('Paylaş') ||
          trimmedLine.includes('Generated by') ||
          trimmedLine.includes('Oluşturan')) {
        continue; // Bu satırları atla
      }
      
      // Bölüm başlıklarını tanı ve çevirileri kullan
      if (trimmedLine.includes('Selected Cards') || 
          trimmedLine.includes('Seçilen Kartlar')) {
        
        // Önceki bölümü kaydet
        if (currentSection.title || currentSection.content) {
          sections.push({ ...currentSection });
        }
        
        // Yeni bölüm başlat
        currentSection = { title: translations.pdf_selected_cards || 'Selected Cards', content: '' };
        isInSection = true;
      } else if (trimmedLine.includes('AI Tarot Interpretation') ||
                 trimmedLine.includes('AI Tarot Yorumu')) {
        
        if (currentSection.title || currentSection.content) {
          sections.push({ ...currentSection });
        }
        
        currentSection = { title: translations.pdf_ai_interpretation || 'AI Tarot Interpretation', content: '' };
        isInSection = true;
      } else if (trimmedLine.includes('Unveiling') ||
                 trimmedLine.includes('Rüyanın Mesajını')) {
        
        if (currentSection.title || currentSection.content) {
          sections.push({ ...currentSection });
        }
        
        currentSection = { title: translations.pdf_unveiling_message || 'Unveiling the Dream\'s Message', content: '' };
        isInSection = true;
      } else if (trimmedLine.includes('This reading is generated') ||
                 trimmedLine.includes('Bu yorum AI tarafından')) {
        
        if (currentSection.title || currentSection.content) {
          sections.push({ ...currentSection });
        }
        
        currentSection = { title: translations.pdf_disclaimer || 'This reading is generated by AI and is for entertainment purposes only.', content: '' };
        isInSection = true;
      } else if (isInSection) {
        // Bölüm içeriğine ekle
        if (currentSection.content) {
          currentSection.content += '\n' + trimmedLine;
        } else {
          currentSection.content = trimmedLine;
        }
      }
    }

    // Son bölümü ekle
    if (currentSection.title || currentSection.content) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sharePDF = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Tarot Reading - ${category} - ${spread}`,
          text: `${translations.reading_result || "Tarot Yorumu"} - ${category} kategorisinde ${spread} açılımı`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: URL'yi kopyala
      navigator.clipboard.writeText(window.location.href);
      alert(translations.pdf_link_copied || 'Link kopyalandı!');
    }
  };

  return (
    <div className="flex gap-3 mt-8 justify-center">
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        className="px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          boxShadow: `0 4px 15px ${colors.primary}40`
        }}
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            {translations.pdf_generating || "PDF Oluşturuluyor..."}
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            {translations.pdf_downloaded || "İndirildi!"}
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            {translations.pdf_download || "PDF İndir"}
          </>
        )}
      </Button>

      <Button
        onClick={sharePDF}
        variant="outline"
        className="px-6 py-3 font-semibold border-2 transition-all duration-300 transform hover:scale-105"
        style={{
          borderColor: colors.accent,
          color: colors.accent,
          background: `${colors.accent}10`
        }}
      >
        <Share2 className="w-4 h-4 mr-2" />
        {translations.pdf_share || "Paylaş"}
      </Button>
    </div>
  );
} 