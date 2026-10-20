import { Suspense } from 'react';
import Katalog, { GridStatis } from '@/components/Katalog';
import { produk } from '@/lib/data';
import { ogHalaman } from '@/lib/seo';

const deskripsi = `Semua ${produk.length} produk Takar: pembersih, toner, serum, pelembap, tabir surya, dan perawatan badan. Saring per langkah, jenis kulit, dan isi ulang.`;

export const metadata = {
  title: 'Semua produk',
  description: deskripsi,
  alternates: { canonical: '/produk' },
  ...ogHalaman({ path: '/produk', judul: 'Semua produk', deskripsi }),
};

export default function HalamanProduk() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-5xl sm:text-6xl">Semua produk</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          {produk.length} produk dalam urutan pakainya. Kadar bahan aktif tertulis di kartu, dan setiap halaman produk memuat daftar
          kandungan lengkap, takaran, dan perkiraan kapan isinya habis.
        </p>
      </div>
      <Suspense fallback={<GridStatis />}>
        <Katalog />
      </Suspense>
    </>
  );
}
