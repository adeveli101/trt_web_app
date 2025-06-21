import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    // Base URL'i request'ten al (örn: http://localhost:3000)
    const url = new URL(request.url);
    const baseUrl = url.origin;

    // Resim yollarını mutlak URL'lere dönüştür
    const finalHtml = html.replace(/src="\/images\//g, `src="${baseUrl}/images/`);

    // Puppeteer ile PDF oluştur
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--allow-running-insecure-content'
      ]
    });

    const page = await browser.newPage();
    
    // HTML içeriğini sayfaya yükle
    await page.setContent(finalHtml, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Resimlerin yüklenmesini bekle (opsiyonel ama önerilir)
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

    // PDF oluştur
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="tarot-reading.pdf"',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 