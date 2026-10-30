import './globals.css';
import { Hedvig_Letters_Serif, Instrument_Sans, DM_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Benih from '@/components/Benih';
import { site } from '@/lib/data';
import { jsonLdToko, OG_ALT } from '@/lib/seo';

const hedvig = Hedvig_Letters_Serif({ subsets: ['latin'], axes: ['opsz'], variable: '--font-hedvig', display: 'swap' });
const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument', display: 'swap' });
const dmMono = DM_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-dm-mono', display: 'swap', preload: false });

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.judul, template: `%s · ${site.nama}` },
  description: site.deskripsi,
  applicationName: site.nama,
  keywords: ['perawatan kulit', 'skincare isi ulang', 'serum niasinamida', 'tabir surya', 'kamus kandungan skincare', 'demo toko online'],
  authors: [{ name: 'PintuWeb', url: 'https://www.pintuweb.id' }],
  creator: 'PintuWeb',
  publisher: 'PintuWeb',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: site.url,
    siteName: site.nama,
    title: site.judul,
    description: site.deskripsi,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: OG_ALT }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.judul,
    description: site.deskripsi,
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
};

export const viewport = {
  themeColor: '#f3f5f1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${hedvig.variable} ${instrument.variable} ${dmMono.variable}`}>
      <body className="antialiased">
        <a href="#isi" className="sr-only-fokus fixed left-3 top-3 z-50 rounded-full bg-tinta px-4 py-2 text-kertas">
          Langsung ke isi
        </a>
        <Header />
        <Benih />
        <main id="isi">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdToko) }} />
        <aside aria-label="Tentang situs demo ini" style={{ display: 'block', margin: 0, padding: '12px 16px', background: '#0f1b33', color: '#dfe6f3', font: '400 13px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', textAlign: 'center' }}>
          Situs demo buatan PintuWeb — nama dan isinya rekaan.{' '}
          <a href="https://www.pintuweb.id/kontak?demo=takar" style={{ color: '#ffffff', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px', display: 'inline-block', padding: '8px 4px' }}>Buat yang seperti ini →</a>
        </aside>
      </body>
    </html>
  );
}
