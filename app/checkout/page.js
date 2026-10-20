import Checkout from '@/components/Checkout';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Pilih cara terima, isi alamat, dan buat pesanan di toko demo Takar. Ongkir dihitung otomatis dari contoh tarif, atau gratis bila diambil.';

export const metadata = {
  title: 'Checkout',
  description: deskripsi,
  ...ogHalaman({ path: '/checkout', judul: 'Checkout', deskripsi }),
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: true },
};

export default function HalamanCheckout() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-5xl sm:text-6xl">Checkout</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">Tiga bagian singkat: cara terima, alamat, lalu cara bayar.</p>
      </div>
      <Checkout />
    </>
  );
}
