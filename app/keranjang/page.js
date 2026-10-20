import Keranjang from '@/components/Keranjang';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Isi keranjang belanja di toko demo Takar. Keranjang tersimpan di browser kamu, stok dicek lagi saat pesanan dibuat.';

export const metadata = {
  title: 'Keranjang',
  description: deskripsi,
  ...ogHalaman({ path: '/keranjang', judul: 'Keranjang', deskripsi }),
  alternates: { canonical: '/keranjang' },
  robots: { index: false, follow: true },
};

export default function HalamanKeranjang() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-5xl sm:text-6xl">Keranjang</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">Keranjang tersimpan di browser ini saja. Stok dicek lagi saat pesanan dibuat.</p>
      </div>
      <Keranjang />
    </>
  );
}
