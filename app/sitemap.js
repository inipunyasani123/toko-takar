import { produk, site } from '@/lib/data';

export default function sitemap() {
  const statis = [
    { path: '', prioritas: 1, ubah: 'weekly' },
    { path: '/produk', prioritas: 0.9, ubah: 'weekly' },
    { path: '/cocokkan', prioritas: 0.8, ubah: 'monthly' },
    { path: '/rutinitas', prioritas: 0.7, ubah: 'monthly' },
    { path: '/kandungan', prioritas: 0.8, ubah: 'monthly' },
    { path: '/isi-ulang', prioritas: 0.7, ubah: 'monthly' },
    { path: '/bantuan', prioritas: 0.6, ubah: 'monthly' },
    { path: '/tentang', prioritas: 0.5, ubah: 'yearly' },
    { path: '/kontak', prioritas: 0.5, ubah: 'yearly' },
    { path: '/lacak', prioritas: 0.4, ubah: 'monthly' },
  ].map((h) => ({ url: `${site.url}${h.path}`, changeFrequency: h.ubah, priority: h.prioritas }));
  const halamanProduk = produk.map((p) => ({ url: `${site.url}/produk/${p.slug}`, changeFrequency: 'weekly', priority: 0.8 }));
  return [...statis, ...halamanProduk];
}
