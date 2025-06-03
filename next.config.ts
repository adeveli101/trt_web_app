// next.config.js
import type { NextConfig } from "next";
import withNextIntl from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Diğer Next.js ayarlarınızı buraya ekleyebilirsiniz (örneğin, experimental, images, compiler vb.)
  // ÖNEMLİ: Burada manuel olarak i18n objesi TANIMLAMAYIN!
};

export default withNextIntl({
  // `next-intl`'in `requestConfig` ayarı burada kalmalı, bu doğru.
  requestConfig: './src/i18n/request.ts'
})(nextConfig);