'use client';

import Link from 'next/link';
import { useState } from 'react';
import Kemasan from './Kemasan';
import { cariProduk, cariLangkah, produk } from '@/lib/data';

const RAK = {
  pagi: {
    produk: ['gel-pembersih-pegagan', 'esens-air-beras', 'serum-vitamin-c-10', 'gel-pelembap-lidah-buaya', 'tabir-surya-spf50'],
    catatan: 'Pagi: lima langkah, dari yang paling encer. Tabir surya selalu terakhir.',
  },
  malam: {
    produk: ['balm-pembersih-kelapa', 'gel-pembersih-pegagan', 'esens-air-beras', 'serum-retinol-03', 'krim-ceramide'],
    catatan: 'Malam: bersihkan dua kali, lalu retinol dua sampai tiga malam seminggu.',
  },
};

function IkonMatahari() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IkonBulan() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" focusable="false">
      <path d="M19.2 14.6A7.6 7.6 0 0 1 9.4 4.8a7.6 7.6 0 1 0 9.8 9.8Z" fill="currentColor" />
    </svg>
  );
}

export default function Hero() {
  const [waktu, setWaktu] = useState('pagi');
  const rak = RAK[waktu];
  const malam = waktu === 'malam';
  const jumlahWajah = produk.filter((p) => p.langkah !== 'tubuh').length;

  return (
    <section aria-labelledby="judul-hero" className="relative overflow-hidden">
      <div className="wadah grid gap-x-10 gap-y-8 pb-14 pt-9 sm:pt-12 lg:grid-cols-12 lg:items-center lg:pb-20 lg:pt-14">
        <div className="lg:col-span-5">
          <h1 id="judul-hero" className="text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem]">
            Kadarnya tertulis. Takarannya jelas.
          </h1>
          <p className="mt-6 max-w-xl text-[1.08rem] leading-relaxed text-tinta-2">
            Serum, pelembap, dan tabir surya dengan kadar bahan aktif di depan botol dan takaran pakai di setiap halaman produk. Yang
            paling cepat habis tersedia dalam kantong isi ulang.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/cocokkan" className="tombol tombol-utama px-6">
              Cocokkan dengan kulitmu
            </Link>
            <Link href="/produk" className="tautan font-medium">
              Lihat {produk.length} produk
            </Link>
          </div>
          <p className="mt-8 hidden max-w-md border-t border-garis pt-4 text-[0.92rem] text-tinta-3 lg:block">
            {jumlahWajah} produk wajah, dua untuk badan. Semua tanpa pewangi tambahan, kecuali sabun batang sereh, dan setiap
            kandungannya dijelaskan di kamus.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className={`relative overflow-hidden rounded-[22px] border ${malam ? 'ubin-malam gelap border-malam-3' : 'ubin-dinding border-garis'} transition-colors duration-500`}>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
              <p className={`text-[0.9rem] font-medium ${malam ? 'text-[#e6ece8]' : 'text-tinta-2'}`}>Urutan pakai di rak kami</p>
              <fieldset>
                <legend className="sr-only">Pilih rutinitas</legend>
                <div className={`flex rounded-full p-1 ${malam ? 'bg-malam-3' : 'bg-kertas shadow-[inset_0_0_0_1px_var(--color-garis)]'}`}>
                  {[
                    { id: 'pagi', label: 'Pagi', Ikon: IkonMatahari },
                    { id: 'malam', label: 'Malam', Ikon: IkonBulan },
                  ].map(({ id, label, Ikon }) => (
                    <label
                      key={id}
                      className={`flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[0.92rem] font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kunyit ${
                        waktu === id ? 'bg-kunyit text-tinta' : malam ? 'text-[#e6ece8] hover:text-white' : 'text-tinta-2 hover:text-tinta'
                      }`}
                    >
                      <input type="radio" name="waktu-hero" value={id} checked={waktu === id} onChange={() => setWaktu(id)} className="sr-only" />
                      <Ikon />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <ol className="relative mt-2 grid grid-cols-5 items-end px-2 sm:px-5" aria-label={`Rutinitas ${waktu}, urut dari langkah pertama`}>
              {rak.produk.map((slug, i) => {
                const p = cariProduk(slug);
                const v = p.varian.find((x) => !x.isiUlang) || p.varian[0];
                return (
                  <li key={`${waktu}-${slug}`} className="relative">
                    <Link href={`/produk/${slug}`} className="group block rounded-xl focus-visible:outline-offset-[-2px]">
                      <span className="sr-only">
                        Langkah {i + 1}: {p.nama}
                      </span>
                      <Kemasan
                        slug={slug}
                        varian={v.id}
                        bingkai="rak-dekat"
                        className="mx-auto -mb-[4%] block w-[150%] max-w-none -translate-x-[16.5%] transition-transform duration-300 group-hover:-translate-y-1.5 sm:w-[124%] sm:-translate-x-[9.5%]"
                      />
                    </Link>
                  </li>
                );
              })}
            </ol>

            {/* pita ukur sebagai bibir rak */}
            <div aria-hidden="true" className="pita relative h-[18px] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.45)]" />
            <ol aria-hidden="true" className="grid grid-cols-5 gap-1 px-2 pb-4 pt-3 sm:px-5 sm:pb-5">
              {rak.produk.map((slug, i) => {
                const p = cariProduk(slug);
                const l = cariLangkah(p.langkah);
                return (
                  <li key={`${waktu}-l-${slug}`} className="text-center">
                    <span className={`data block text-[0.95rem] font-medium ${malam ? 'text-kunyit' : 'text-tinta'}`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={`block text-[0.72rem] leading-tight sm:text-[0.8rem] ${malam ? 'text-[#c9d3cd]' : 'text-tinta-2'}`}>{l.nama}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[0.92rem]">
            <span className="text-tinta-2" aria-live="polite">
              {rak.catatan}
            </span>
            <Link href="/rutinitas" className="tautan font-medium">
              Susun rutinitasmu
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
