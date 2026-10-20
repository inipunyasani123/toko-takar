import Rutinitas from '@/components/Rutinitas';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Susun rutinitas pagi dan malam per langkah. Urutan, bahan yang bentrok, jadwal 7 malam, dan biaya per bulan dihitung otomatis.';

export const metadata = {
  title: 'Penyusun rutinitas pagi dan malam',
  description: deskripsi,
  alternates: { canonical: '/rutinitas' },
  ...ogHalaman({ path: '/rutinitas', judul: 'Penyusun rutinitas pagi dan malam', deskripsi }),
};

export default function HalamanRutinitas() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="max-w-3xl text-5xl sm:text-6xl">Rutinitas pagi dan malam</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Pilih produk per langkah. Urutannya disusun otomatis dari yang paling encer, bahan yang tidak sebaiknya dipakai bersamaan diberi
          tanda, dan semuanya tersimpan di browser ini.
        </p>
      </div>
      <Rutinitas />
    </>
  );
}
