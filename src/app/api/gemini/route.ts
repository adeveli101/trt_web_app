import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createHash } from 'crypto';

// Rate limiting için basit bir in-memory store
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Cache store - production'da Redis kullanılabilir
const responseCache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 saat cache

// Rate limiting fonksiyonu
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 dakika
  const maxRequests = 10; // 1 dakikada maksimum 10 istek

  const userRequests = requestCounts.get(ip);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userRequests.count >= maxRequests) {
    return false;
  }

  userRequests.count++;
  return true;
}

// Input validation fonksiyonu
function validatePrompt(prompt: string): { isValid: boolean; error?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { isValid: false, error: 'Prompt is required and must be a string' };
  }

  // Celtic Cross ve Yearly Spread için daha yüksek limit
  const maxLength = prompt.includes('Celtic Cross') || prompt.includes('Yearly Spread') 
    ? 15000  // 15,000 karakter (Celtic Cross için)
    : 5000;  // 5,000 karakter (diğer spread'ler için)

  if (prompt.length > maxLength) {
    return { 
      isValid: false, 
      error: `Prompt is too long (max ${maxLength.toLocaleString()} characters for this spread type)` 
    };
  }

  // Zararlı içerik kontrolü
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(prompt)) {
      return { isValid: false, error: 'Prompt contains potentially dangerous content' };
    }
  }

  return { isValid: true };
}

// Cache key oluşturma - güvenli tip kontrolü ile
function generateCacheKey(prompt: string): string {
  // prompt zaten validate edildi, string olduğundan eminiz
  const hash = createHash('sha256');
  hash.update(prompt);
  return hash.digest('hex');
}

// Cache kontrolü
function getCachedResponse(cacheKey: string): string | null {
  const cached = responseCache.get(cacheKey);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    responseCache.delete(cacheKey);
    return null;
  }
  
  return cached.result;
}

// Cache'e kaydetme
function setCachedResponse(cacheKey: string, result: string): void {
  responseCache.set(cacheKey, { result, timestamp: Date.now() });
  
  // Cache boyutunu kontrol et (max 1000 entry)
  if (responseCache.size > 1000) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) {
      responseCache.delete(oldestKey);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // IP adresini al
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    // Rate limiting kontrolü
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Request body'yi parse et
    const body = await req.json();
    const { prompt } = body;

    // Input validation
    const validation = validatePrompt(prompt);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Cache kontrolü - prompt artık validate edildi, string olduğundan eminiz
    const cacheKey = generateCacheKey(prompt);
    const cachedResult = getCachedResponse(cacheKey);
    
    if (cachedResult) {
      return NextResponse.json({ 
        result: cachedResult,
        cached: true 
      });
    }

    // API anahtarını kontrol et
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 500 }
      );
    }

    // Gemini API'ye istek gönder
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    // Response'u validate et
    const result = response.text;
    if (!result || typeof result !== 'string') {
      throw new Error('Invalid response from AI service');
    }

    // Sonucu cache'e kaydet
    setCachedResponse(cacheKey, result);

    return NextResponse.json({ 
      result,
      cached: false 
    });

  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    
    // Hata mesajlarını güvenli hale getir
    let errorMessage = 'An error occurred while processing your request';
    
    if (error instanceof Error) {
      if (error.message?.includes('API key')) {
        errorMessage = 'Service temporarily unavailable';
      } else if (error.message?.includes('quota')) {
        errorMessage = 'Service temporarily unavailable';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = 'Too many requests. Please try again later.';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 