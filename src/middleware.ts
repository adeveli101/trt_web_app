// src/middleware.ts
// Lütfen bu dosyanın gerçekten /src/middleware.ts yolunda olduğundan emin olun.

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server'; // Gerekirse ekleyin

const locales = ['en', 'de', 'es', 'fr', 'it', 'tr'];
const defaultLocale = 'en';

// `localePrefix` ayarı:
// 'as-needed': Varsayılan dil için URL'de önek olmaz (örn. '/', '/about'). Diğer dillerde önek olur (örn. '/tr', '/tr/about').
// 'always': Her dil için URL'de önek olur (örn. '/en', '/en/about', '/tr', '/tr/about').
// 'never': Hiçbir zaman dil öneki olmaz (genellikle tavsiye edilmez, dil algılama için farklı yöntemler gerektirir).
const localePrefix = 'as-needed'; // Genellikle en kullanıcı dostu seçenektir.
// Eğer 'always' kullanıyorsanız, lütfen 'matcher'ı da buna göre ayarlayın.


export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  // Eğer özel locale algılama veya yönlendirme mantığına ihtiyacınız varsa
  // buraya `localeDetection: false` ekleyip kendi manuel yönlendirmenizi yapabilirsiniz.
  // Ancak şimdilik default ayarda bırakalım.
});

// Middleware'in hangi yollarda çalışacağını belirleyen konfigürasyon.
// Bu kısım, `next-intl`'in URL'den doğru dil segmentini alması için kritik öneme sahiptir.
export const config = {
  // `matcher` içindeki desenler, middleware'in hangi gelen istekleri işleyeceğini belirler.
  // Amacımız, dil öneki içeren yolları (örneğin /tr, /de/hakkimizda) yakalamak
  // ve Next.js'in veya diğer yardımcı araçların kullandığı özel yolları dışlamaktır.
  matcher: [
    // 1. Kök dizini (varsayılan dilin öneksiz hali için) eşleştirin.
    //    Eğer `localePrefix: 'always'` kullanıyorsanız bu satırı kaldırın ve sadece
    //    '/(\w{2})/:path*' gibi bir şey bırakın.
    '/',

    // 2. Desteklenen tüm diller için prefix içeren yolları eşleştirin.
    //    Bu RegEx, örneğin `/de`, `/tr/about`, `/en/contact` gibi yolları yakalar.
    '/(de|en|es|fr|it|tr)/:path*',

    // 3. Next.js'in dahili yollarını ve statik dosyaları middleware işleminden hariç tutun.
    //    `next-intl` dokümantasyonunda genellikle bu kadar detaylı bir dışlama önerilmez
    //    çünkü ilk iki madde çoğu durumu kapsar ve Next.js kendisi de bazı dahili yolları dışlar.
    //    Ancak, Amplify gibi ek servisleriniz varsa bu faydalı olabilir.
    //    Bu desen:
    //    - 'api': API rotalarını
    //    - '_next/static': Statik Next.js kaynaklarını
    //    - '_next/image': Next.js görüntü optimizasyonu kaynaklarını
    //    - 'favicon.ico': Favicon dosyasını
    //    - '_vercel': Vercel'e özel dahili yolları (eğer Vercel kullanıyorsanız)
    //    - '_amplify': Amplify'a özel dahili yolları (eğer Amplify kullanıyorsanız)
    //    - '.*\\..*': Herhangi bir dosya uzantısı içeren diğer statik dosyaları (örn. .css, .js, .png)
    //    dışlar.
    '/((?!api|_next/static|_next/image|favicon.ico|_vercel|_amplify|.*\\..*).*)',
  ],
};

// Eğer karmaşık özel yönlendirme veya dil algılama ihtiyacınız varsa,
// createMiddleware fonksiyonunu kendiniz sarmalayabilirsiniz.
// Örneğin:
/*
export default async function middleware(request: NextRequest) {
  // Manuel olarak dil algılama veya yönlendirme yapabilirsiniz
  // const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';

  // next-intl middleware'ini çalıştır
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
    localePrefix,
  });

  const response = handleI18nRouting(request);

  // Gerekirse yanıtı değiştirebilirsiniz
  // response.cookies.set('NEXT_LOCALE', response.headers.get('x-middleware-detected-locale') || defaultLocale);

  return response;
}

export const config = {
  // Matcher burada da yukarıdaki gibi olmalı
  matcher: [
    '/',
    '/(de|en|es|fr|it|tr)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|_vercel|_amplify|.*\\..*).*)',
  ],
};
*/