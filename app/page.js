import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import MiniCocok from '@/components/MiniCocok';
import KalkulatorHabis from '@/components/KalkulatorHabis';
import LabelUrai from '@/components/LabelUrai';
import KartuProduk from '@/components/KartuProduk';
import Kemasan from '@/components/Kemasan';
import { produk, tidakDijanjikan } from '@/lib/data';
import { kandungan, cariBahan, fungsi } from '@/lib/kandungan';
import { urutPakai, hematIsiUlang } from '@/lib/katalog';
import { rupiah } from '@/lib/format';

export const metadata = {
  alternates: { canonical: '/' },
};

const SOROT_KAMUS = ['niasinamida', 'setearil-alkohol', 'fenoksietanol'];
const RAK_BERANDA = ['gel-pembersih-pegagan', 'esens-air-beras', 'toner-aha-5', 'serum-niasinamida-5', 'serum-vitamin-c-10', 'serum-retinol-03', 'krim-ceramide', 'tabir-surya-spf50'];
const FOTO_BAHAN = ['pegagan', 'fermentasi-beras', 'teh-hijau', 'lidah-buaya', 'minyak-kelapa', 'minyak-kemiri'];

function jumlahProdukBerisi(id) {
  const b = cariBahan(id);
  return produk.filter((p) => p.inci.some((n) => b.inci.includes(n))).length;
}

export default function Beranda() {
  const rak = RAK_BERANDA.map((s) => produk.find((p) => p.slug === s)).sort(urutPakai);
  const isiUlang = produk.map((p) => hematIsiUlang(p) && { p, ...hematIsiUlang(p) }).filter(Boolean);
  const hematTerbesar = Math.max(...isiUlang.map((x) => x.persen));

  return (
    <>
      <Hero />

      {/* Mulai dari kulitmu: penemu mini, kalkulator habis, dan kamus */}
      <section aria-labelledby="judul-mulai" className="border-t border-garis bg-kertas py-12 sm:py-20">
        <div className="wadah">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="judul-mulai" className="max-w-2xl text-[2.2rem] sm:text-5xl">
              Mulai dari kulitmu, bukan dari produk terbaru
            </h2>
            <Link href="/cocokkan" className="tautan font-medium">
              Penemu produk lengkap
            </Link>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            <div className="rounded-[18px] border border-garis bg-ubin p-5 sm:p-7 lg:col-span-7 lg:row-span-2">
              <MiniCocok />
            </div>
            <div className="rounded-[18px] border border-garis bg-kunyit-muda/60 p-5 sm:p-7 lg:col-span-5">
              <KalkulatorHabis />
            </div>
            <div className="gelap rounded-[18px] bg-malam p-5 text-[#dfe6e1] sm:p-7 lg:col-span-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-[1.45rem] leading-snug text-kertas sm:text-[1.7rem]">Kamus kandungan</h3>
                <p className="data text-[0.8rem] text-[#b7c3bc]">{kandungan.length} bahan</p>
              </div>
              <p className="mt-2 text-[0.92rem] text-[#c9d3cd]">Termasuk pengawet, pengental, dan pengatur pH yang biasanya dilewati.</p>
              <ul className="mt-4 grid gap-1">
                {SOROT_KAMUS.map((id) => {
                  const b = cariBahan(id);
                  return (
                    <li key={id} className="border-t border-white/12 first:border-0">
                      <Link href={`/kandungan#${id}`} className="group block py-3">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <span className="font-medium text-kertas group-hover:underline group-hover:decoration-kunyit">{b.nama}</span>
                          <span className="data text-[0.75rem] text-kunyit">{b.fungsi.map((f) => fungsi[f].nama).join(' · ')}</span>
                        </span>
                        <span className="mt-1 block text-[0.88rem] leading-snug text-[#c9d3cd]">{b.ringkas.split('. ')[0]}.</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link href="/kandungan" className="tombol tombol-terang mt-4 w-full sm:w-auto">
                Buka kamus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rak per langkah */}
      <section aria-labelledby="judul-rak" className="border-t border-garis py-12 sm:py-20">
        <div className="wadah">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="judul-rak" className="text-[2.2rem] sm:text-5xl">
                Satu rak, lima langkah
              </h2>
              <p className="mt-3 max-w-xl text-tinta-2">
                Diurutkan seperti cara memakainya: bersihkan, seimbangkan, rawat, lembapkan, lindungi. Warna tutup menandai langkahnya.
              </p>
            </div>
            <Link href="/produk" className="tautan font-medium">
              Semua {produk.length} produk
            </Link>
          </div>
        </div>
        <div className="mt-9 overflow-x-auto pb-4 [scrollbar-width:thin]" tabIndex={0} role="region" aria-label="Rak produk wajah, gulir ke samping">
          <ul className="flex w-max gap-4 px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-78rem)/2+2rem))]">
            {rak.map((p) => (
              <li key={p.slug} className="w-[12.5rem] shrink-0 sm:w-[14rem]">
                <KartuProduk produk={p} judulTag="h3" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cara membaca label */}
      <section aria-labelledby="judul-label" className="border-t border-garis bg-kabut/70 py-12 sm:py-20">
        <div className="wadah">
          <h2 id="judul-label" className="max-w-3xl text-[2.2rem] sm:text-5xl">
            Cara membaca label kami
          </h2>
          <p className="mt-3 max-w-2xl text-tinta-2">
            Lima angka di depan botol, dan daftar kandungan lengkap di belakangnya. Ini serum yang paling sering ditanyakan, kami urai satu
            per satu.
          </p>
          <div className="mt-10">
            <LabelUrai />
          </div>
        </div>
      </section>

      {/* Isi ulang */}
      <section aria-labelledby="judul-isi-ulang" className="border-t border-garis bg-kunyit-muda/55 py-12 sm:py-20">
        <div className="wadah grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="judul-isi-ulang" className="text-[2.2rem] sm:text-5xl">
              Botolnya disimpan, isinya diganti
            </h2>
            <p className="mt-4 max-w-lg text-tinta-2">
              {isiUlang.length} produk yang paling cepat habis tersedia dalam kemasan isi ulang, sampai {hematTerbesar}% lebih murah per
              ml dibanding membeli botol baru. Vitamin C, retinol, dan tabir surya sengaja tidak, karena lebih aman dijual dalam kemasan
              yang langsung dipakai.
            </p>
            <table className="mt-7 w-full border-collapse text-left text-[0.92rem]">
              <caption className="sr-only">Perbandingan harga botol dan isi ulang</caption>
              <thead>
                <tr className="border-b border-tinta">
                  <th scope="col" className="py-2 pe-3 font-semibold">Produk</th>
                  <th scope="col" className="py-2 pe-3 text-end font-semibold">Botol</th>
                  <th scope="col" className="py-2 pe-3 text-end font-semibold">Isi ulang</th>
                  <th scope="col" className="py-2 text-end font-semibold">Lebih hemat</th>
                </tr>
              </thead>
              <tbody>
                {isiUlang.slice(0, 4).map(({ p, botol, ulang, persen }) => (
                  <tr key={p.slug} className="border-b border-garis-tua/50">
                    <th scope="row" className="py-2.5 pe-3 font-normal">
                      <Link href={`/produk/${p.slug}`} className="hover:underline">
                        {p.nama}
                      </Link>
                    </th>
                    <td className="data py-2.5 pe-3 text-end text-[0.85rem]">
                      {botol.ukuran} {botol.satuan}
                      <span className="block text-tinta-2">{rupiah(botol.harga)}</span>
                    </td>
                    <td className="data py-2.5 pe-3 text-end text-[0.85rem]">
                      {ulang.ukuran} {ulang.satuan}
                      <span className="block text-tinta-2">{rupiah(ulang.harga)}</span>
                    </td>
                    <td className="data py-2.5 text-end font-medium">{persen}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[0.85rem] text-tinta-3">Dihitung per ml dari harga botol terkecil.</p>
            <Link href="/isi-ulang" className="tombol tombol-utama mt-6">
              Cara mengisi ulang
            </Link>
          </div>
          <div className="lg:col-span-6">
            <div className="ubin-dinding relative mx-auto flex max-w-xs sm:max-w-lg items-end justify-center gap-1 overflow-hidden rounded-[22px] border border-garis px-4 pb-[16px] pt-6">
              <Kemasan slug="gel-pembersih-pegagan" varian="100-pompa" bingkai="rak-dekat" judul="Botol pompa Gel Pembersih Pegagan 100 ml" className="-mb-[3%] w-[40%]" />
              <svg viewBox="0 0 60 120" className="mb-[22%] w-[12%]" aria-hidden="true" focusable="false">
                <path d="M6 60h40" stroke="#17201c" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M38 50l12 10-12 10" fill="none" stroke="#17201c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Kemasan slug="gel-pembersih-pegagan" varian="200-isi-ulang" bingkai="rak-dekat" judul="Kantong isi ulang Gel Pembersih Pegagan 200 ml" className="-mb-[3%] w-[44%]" />
              <div aria-hidden="true" className="pita absolute inset-x-0 bottom-0 h-[16px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Bahan dari dekat */}
      <section aria-labelledby="judul-bahan" className="border-t border-garis py-12 sm:py-20">
        <div className="wadah">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="judul-bahan" className="text-[2.2rem] sm:text-5xl">
                Bahan dari dekat
              </h2>
              <p className="mt-3 max-w-xl text-tinta-2">
                Sebagian bahan kami berasal dari tanaman yang akrab di dapur dan kebun. Sebagian lagi dibuat di pabrik, dan itu sama
                pentingnya.
              </p>
            </div>
            <Link href="/kandungan" className="tautan font-medium">
              Semua bahan di kamus
            </Link>
          </div>
          <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4 lg:grid-cols-5">
            {FOTO_BAHAN.map((id, i) => {
              const b = cariBahan(id);
              const n = jumlahProdukBerisi(id);
              const besar = i === 0;
              return (
                <li key={id} className={besar ? 'col-span-2 md:row-span-2' : ''}>
                  <Link href={`/kandungan#${id}`} className="group flex h-full flex-col">
                    <span className={`relative block overflow-hidden rounded-[14px] bg-kabut ${besar ? 'aspect-[4/3] md:aspect-auto md:min-h-[18rem] md:flex-1' : 'aspect-[4/3]'}`}>
                      <Image
                        src={b.foto.src}
                        alt={b.foto.alt}
                        fill
                        sizes={besar ? '(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw'}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </span>
                    <span className="mt-2.5 block font-medium leading-snug group-hover:underline">{b.nama}</span>
                    <span className="data block truncate text-[0.75rem] text-tinta-3">{b.inci[0]}</span>
                    <span className="block text-[0.82rem] text-tinta-2">Ada di {n} produk</span>
                  </Link>
                </li>
              );
            })}
            <li className="md:col-span-2 lg:col-span-1">
              <Link href="/kandungan" className="group flex h-full min-h-[10rem] flex-col justify-between rounded-[14px] border border-dashed border-garis-tua p-4 hover:border-tinta">
                <span className="font-display text-[1.6rem] leading-tight">
                  {kandungan.length - FOTO_BAHAN.length} bahan lain
                </span>
                <span className="text-[0.88rem] text-tinta-2">Termasuk yang dibuat di pabrik: pengawet, filter UV, dan pengatur pH.</span>
                <span className="font-medium group-hover:underline">Buka kamus →</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Yang tidak kami janjikan */}
      <section aria-labelledby="judul-janji" className="gelap border-t border-malam-3 bg-malam py-16 text-[#dfe6e1] sm:py-20">
        <div className="wadah grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="judul-janji" className="text-[2.2rem] text-kertas sm:text-5xl">
              Yang tidak kami janjikan
            </h2>
            <p className="mt-4 max-w-sm text-[#c9d3cd]">
              Kalimat seperti ini sering ada di kemasan perawatan kulit. Kami memilih tidak menulisnya, dan ini alasannya.
            </p>
            <Link href="/tentang" className="tautan mt-5 inline-block font-medium">
              Cara kami meracik
            </Link>
          </div>
          <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-8">
            {tidakDijanjikan.map((x) => (
              <li key={x.t} className="border-t border-white/15 pt-5">
                <p className="font-display text-[1.9rem] leading-tight text-kertas line-through decoration-kunyit decoration-[3px] sm:text-[2.2rem]">
                  {x.t}
                </p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-[#c9d3cd]">{x.j}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

