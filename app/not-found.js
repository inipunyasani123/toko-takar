import Link from 'next/link';
import Kemasan from '@/components/Kemasan';

export const metadata = {
  title: 'Halaman tidak ditemukan',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function TidakDitemukan() {
  return (
    <div className="wadah grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-12">
      <div className="ubin-dinding relative mx-auto flex aspect-square w-full max-w-sm items-end justify-center overflow-hidden rounded-[24px] border border-garis lg:col-span-5">
        <div className="relative h-[78%] w-[60%] rotate-[-14deg] translate-y-[6%]">
          <Kemasan slug="serum-niasinamida-5" varian="30-pipet" bingkai="pas" className="h-full w-full opacity-90" />
        </div>
        <svg viewBox="0 0 120 40" className="absolute bottom-[12%] left-[16%] w-[42%]" aria-hidden="true" focusable="false">
          <path d="M6 26c14-12 30-14 46-8s32 8 50-4c6 6 4 14-8 16H14C6 30 2 30 6 26Z" fill="#e4edf3" stroke="#a3b1aa" strokeWidth="1" opacity="0.9" />
          <path d="M30 20c8-3 18-3 28 0" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
        </svg>
        <div aria-hidden="true" className="pita absolute inset-x-0 bottom-0 h-[16px]" />
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <p className="data text-[0.9rem] text-kunyit-tua">404 · takarannya meleset</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">Halaman ini tumpah sebelum sampai</h1>
        <p className="mt-4 max-w-lg text-tinta-2">
          Alamat yang kamu buka tidak ada, atau sudah pindah. Coba mulai dari daftar produk, atau cari bahan yang ingin kamu ketahui di kamus.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/produk" className="tombol tombol-utama">
            Lihat produk
          </Link>
          <Link href="/" className="tombol tombol-garis">
            Ke beranda
          </Link>
          <Link href="/kandungan" className="tautan self-center font-medium">
            Kamus kandungan
          </Link>
        </div>
      </div>
    </div>
  );
}
