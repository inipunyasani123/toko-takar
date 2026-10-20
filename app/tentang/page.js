import Link from 'next/link';
import Image from 'next/image';
import Kemasan from '@/components/Kemasan';
import { site, tidakDijanjikan, produk } from '@/lib/data';
import { kandungan, cariBahan } from '@/lib/kandungan';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Takar meracik perawatan kulit dengan kadar tertulis, takaran pakai yang jelas, dan kemasan isi ulang dari Bandung. Toko demo buatan PintuWeb.';

export const metadata = {
  title: 'Tentang kami',
  description: deskripsi,
  alternates: { canonical: '/tentang' },
  ...ogHalaman({ path: '/tentang', judul: 'Tentang kami', deskripsi }),
};

const TIGA = [
  { n: '5%', t: 'Kadar di depan botol', j: 'Kadar bahan aktif utama tertulis besar di label depan, bukan disimpan di balik botol atau diganti kata "diperkaya".' },
  { n: '3 tetes', t: 'Takaran di setiap halaman', j: 'Berapa banyak yang dioles dan seberapa sering. Dari situ kami hitung kapan satu kemasan habis.' },
  { n: '12M', t: 'Batas setelah dibuka', j: 'Kami bandingkan dengan perkiraan habisnya. Kalau ukuran besar tidak akan habis sebelum batasnya, kami bilang terus terang.' },
];

const CARA = [
  { t: 'Racikan kecil', j: 'Setiap racikan dibuat dalam jumlah yang habis terjual dalam beberapa bulan, supaya produk yang sampai ke tanganmu tidak lama tersimpan di gudang.' },
  { t: 'Tanpa pewangi di produk wajah', j: 'Pewangi tidak menambah fungsi pada serum atau pelembap, dan bisa memicu reaksi pada kulit peka. Sabun batang sereh adalah satu-satunya yang beraroma.' },
  { t: 'Pengawet secukupnya', j: 'Produk berbahan air memakai pengawet di bawah batas yang diizinkan. Produk tanpa air tidak memakainya sama sekali.' },
  { t: 'Kemasan yang bisa dipakai lagi', j: 'Botol kaca dan jar dirancang untuk diisi ulang. Kantongnya dari satu jenis plastik supaya lebih mudah didaur ulang.' },
];

export default function HalamanTentang() {
  const teh = cariBahan('teh-hijau');
  const beras = cariBahan('fermentasi-beras');
  return (
    <>
      <div className="wadah grid gap-10 pb-12 pt-10 sm:pt-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="text-5xl sm:text-6xl">Tentang Takar</h1>
          <p className="mt-5 max-w-2xl text-[1.1rem] leading-relaxed text-tinta-2">
            Takar dimulai dari satu pertanyaan yang jarang dijawab di kemasan: sebenarnya berapa banyak yang perlu dioles, dan sampai kapan isinya
            boleh dipakai? Dari dapur racik kecil di {site.kota}, kami menulis jawabannya di setiap botol.
          </p>
          <p className="mt-5 max-w-2xl rounded-xl border-s-4 border-kunyit bg-kunyit-muda/50 p-4 text-[0.95rem]">
            Takar adalah merek fiktif. Toko ini dibuat PintuWeb sebagai contoh toko online perawatan kulit; cerita, produk, dan formulanya rekaan.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-5">
          <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-[18px]">
            <Image src={teh.foto.src} alt={teh.foto.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" priority />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-[18px]">
            <Image src={beras.foto.src} alt={beras.foto.alt} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" />
          </div>
          <div className="ubin-dinding relative flex aspect-square items-end justify-center overflow-hidden rounded-[18px] border border-garis">
            <Kemasan slug="esens-air-beras" varian="150-botol" bingkai="pas" judul="Botol Esens Air Beras 150 ml" className="h-full w-full" />
          </div>
        </div>
      </div>

      <section aria-labelledby="judul-tiga" className="border-t border-garis bg-kertas py-14 sm:py-20">
        <div className="wadah">
          <h2 id="judul-tiga" className="max-w-2xl text-[2.2rem] sm:text-5xl">
            Tiga hal yang kami tulis di setiap botol
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {TIGA.map((x) => (
              <li key={x.t} className="border-t-2 border-tinta pt-5">
                <p className="data text-5xl font-medium leading-none">{x.n}</p>
                <h3 className="mt-4 font-sans text-[1.15rem] font-semibold tracking-normal">{x.t}</h3>
                <p className="mt-2 text-tinta-2">{x.j}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="judul-cara" className="border-t border-garis py-14 sm:py-20">
        <div className="wadah grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="judul-cara" className="text-[2.2rem] sm:text-5xl">
              Cara kami meracik
            </h2>
            <p className="mt-4 max-w-sm text-tinta-2">
              {produk.length} produk, {kandungan.length} bahan. Setiap bahan dan fungsinya bisa kamu baca di{' '}
              <Link href="/kandungan" className="tautan">
                kamus kandungan
              </Link>
              .
            </p>
          </div>
          <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-8">
            {CARA.map((x, i) => (
              <li key={x.t} className="grid grid-cols-[2.5rem_1fr] gap-3">
                <span aria-hidden="true" className="data flex h-9 w-9 items-center justify-center rounded-full bg-kunyit text-[0.9rem] font-medium">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-sans text-[1.1rem] font-semibold tracking-normal">{x.t}</h3>
                  <p className="mt-1 text-tinta-2">{x.j}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="judul-janji" className="gelap bg-malam py-14 text-[#dfe6e1] sm:py-20">
        <div className="wadah">
          <h2 id="judul-janji" className="text-[2.2rem] text-kertas sm:text-5xl">
            Yang tidak kami janjikan
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tidakDijanjikan.map((x) => (
              <li key={x.t} className="border-t border-white/15 pt-4">
                <p className="font-display text-[1.7rem] leading-tight text-kertas line-through decoration-kunyit decoration-[3px]">{x.t}</p>
                <p className="mt-2 text-[0.95rem] text-[#c9d3cd]">{x.j}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="judul-toko" className="py-14 sm:py-20">
        <div className="wadah grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="judul-toko" className="text-[2.2rem] sm:text-5xl">
              Mampir ke toko
            </h2>
            <p className="mt-4 max-w-lg text-tinta-2">
              Di toko kami kamu bisa mencoba tekstur di punggung tangan, mengisi ulang botol secara curah, dan mengambil pesanan online tanpa ongkir.
            </p>
          </div>
          <div className="rounded-[18px] border border-garis bg-kertas p-5 lg:col-span-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[0.85rem] text-tinta-3">Alamat</dt>
              <dd className="mt-0.5">{site.alamatToko}</dd>
            </div>
            <div>
              <dt className="text-[0.85rem] text-tinta-3">Jam toko</dt>
              <dd className="mt-0.5">{site.jamToko}</dd>
            </div>
          </dl>
          <Link href="/kontak" className="tombol tombol-utama mt-5">
            Hubungi kami
          </Link>
          </div>
        </div>
      </section>
    </>
  );
}
