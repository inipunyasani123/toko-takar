// Metadata Open Graph lengkap per halaman (Next.js mengganti objek openGraph induk, tidak menggabungkannya)
// dan data terstruktur JSON-LD.
import { site, cariLangkah } from './data';
import { stokDasar, labelVarian } from './katalog';
import { cariBahan } from './kandungan';

export const OG_ALT = 'Toko demo Takar: botol serum, pelembap, dan tabir surya berjajar di atas pita ukur kuning';

export function ogHalaman({ path = '', judul, deskripsi, gambar }) {
  const url = `${site.url}${path}`;
  const title = judul ? `${judul} · ${site.nama}` : site.judul;
  const images = gambar ? [gambar] : [{ url: '/og.jpg', width: 1200, height: 630, alt: OG_ALT }];
  return {
    openGraph: { type: 'website', locale: 'id_ID', url, siteName: site.nama, title, description: deskripsi, images },
    twitter: { card: 'summary_large_image', title, description: deskripsi, images: images.map((g) => g.url) },
  };
}

export const jsonLdToko = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'OnlineStore',
      '@id': `${site.url}/#toko`,
      name: site.nama,
      url: site.url,
      logo: `${site.url}/icon.svg`,
      image: `${site.url}/og.jpg`,
      description: site.deskripsi,
      slogan: site.tagline,
      areaServed: { '@type': 'Country', name: 'Indonesia' },
      knowsLanguage: 'id-ID',
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#situs`,
      name: site.nama,
      url: site.url,
      description: site.deskripsi,
      inLanguage: 'id-ID',
      publisher: { '@id': `${site.url}/#toko` },
    },
  ],
};

// Product tanpa rating dan ulasan: toko demo tidak punya ulasan sungguhan.
export function jsonLdProduk(p) {
  const l = cariLangkah(p.langkah);
  const url = `${site.url}/produk/${p.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${url}#produk`,
        name: p.nama,
        description: p.ringkas,
        url,
        image: `${site.url}/gambar-produk/${p.slug}.jpg`,
        brand: { '@type': 'Brand', name: site.nama },
        category: `Perawatan ${p.langkah === 'tubuh' ? 'tubuh' : 'wajah'} > ${l?.jenis}`,
        sku: `TKR-${p.slug.toUpperCase()}`,
        additionalProperty: [
          ...p.aktif
            .filter((a) => a.kadar)
            .map((a) => ({ '@type': 'PropertyValue', name: `Kadar ${cariBahan(a.bahan)?.nama || a.bahan}`, value: a.kadar })),
          ...(p.ph ? [{ '@type': 'PropertyValue', name: 'pH', value: p.ph }] : []),
          { '@type': 'PropertyValue', name: 'Batas pakai setelah dibuka', value: `${p.pao} bulan` },
        ],
        offers: p.varian.map((v) => ({
          '@type': 'Offer',
          sku: `TKR-${p.slug.toUpperCase()}-${v.id.toUpperCase()}`,
          name: labelVarian(p, v.id),
          price: v.harga,
          priceCurrency: 'IDR',
          availability: stokDasar(p, v.id) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          url,
          seller: { '@id': `${site.url}/#toko` },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Produk', item: `${site.url}/produk` },
          { '@type': 'ListItem', position: 2, name: l?.jenis, item: `${site.url}/produk?langkah=${p.langkah}` },
          { '@type': 'ListItem', position: 3, name: p.nama, item: url },
        ],
      },
    ],
  };
}
