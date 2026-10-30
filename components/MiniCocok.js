'use client';

import Link from 'next/link';
import { useState } from 'react';
import Kemasan from './Kemasan';
import { cariProduk, cariKulit, cariLangkah } from '@/lib/data';
import { usulRutinitas, skorProduk } from '@/lib/cocok';
import { hargaTermurah } from '@/lib/katalog';
import { rupiah } from '@/lib/format';

const PILIHAN = [
  { id: 'kering', teks: 'Kencang atau bersisik' },
  { id: 'normal', teks: 'Nyaman saja' },
  { id: 'kombinasi', teks: 'Mengilap di dahi dan hidung' },
  { id: 'berminyak', teks: 'Mengilap hampir di mana-mana' },
];

// Penemu mini di beranda: satu pertanyaan, tiga produk awal untuk rutinitas pagi.
export default function MiniCocok() {
  const [kulit, setKulit] = useState('kombinasi');
  const j = { kulit, peka: '', tujuan: [], ringkas: true };
  const usul = usulRutinitas(j).pagi.filter((s) => s !== 'tabir-surya-spf50');
  const tiga = [...usul, 'tabir-surya-spf50'].slice(0, 3);
  const k = cariKulit(kulit);

  return (
    <div className="flex h-full flex-col">
      <fieldset>
        <legend className="font-display text-[1.45rem] leading-snug sm:text-[1.7rem]">
          Dua jam setelah cuci muka tanpa memakai apa pun, kulitmu terasa…
        </legend>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {PILIHAN.map((o) => (
            <label key={o.id} className="pilihan flex min-h-14 items-center gap-3 px-3.5 py-2.5 text-[0.95rem] leading-snug">
              <input type="radio" name="mini-kulit" value={o.id} checked={kulit === o.id} onChange={() => setKulit(o.id)} className="h-[1.25rem] w-[1.25rem] shrink-0 accent-[#17201c]" />
              <span>
                {o.teks}
                <span className="block text-[0.8rem] text-tinta-3">{cariKulit(o.id).nama}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 border-t border-garis pt-5" aria-live="polite">
        <p className="text-[0.95rem] text-tinta-2">
          Kulit <span className="font-semibold text-tinta">{k.nama.toLowerCase()}</span>: mulai dari tiga produk ini untuk pagi hari.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {tiga.map((slug, i) => {
            const p = cariProduk(slug);
            const alasan = skorProduk(p, j).alasan[0];
            return (
              <li key={slug}>
                <Link href={`/produk/${slug}`} className="group flex h-full items-center gap-3 rounded-xl border border-garis bg-kertas p-2.5 hover:border-garis-tua sm:flex-col sm:items-stretch sm:p-3">
                  <span className="block h-20 w-16 shrink-0 rounded-lg sm:h-44 sm:w-full" style={{ background: cariLangkah(p.langkah).muda }}>
                    <Kemasan slug={slug} varian={p.varian[0].id} bingkai="pas" className="h-full w-full" />
                  </span>
                  <span className="min-w-0">
                    <span className="data block text-[0.75rem] text-tinta-3">Langkah {i === 2 ? 'terakhir' : i + 1}</span>
                    <span className="block font-medium leading-snug group-hover:underline">{p.nama}</span>
                    <span className="block text-[0.82rem] text-tinta-3">{alasan ? `${alasan[0].toUpperCase()}${alasan.slice(1)}` : 'Untuk semua jenis kulit'}</span>
                    <span className="mt-1 block text-[0.9rem] font-semibold">{rupiah(hargaTermurah(p))}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[0.88rem] text-tinta-3">
          Usulan ini sengaja tanpa bahan kuat seperti AHA, BHA, atau retinol. Penemu lengkap menanyakan kepekaan kulit dan apa yang ingin
          kamu rawat, lalu menyusun rutinitas pagi dan malam.
        </p>
        <Link href={`/cocokkan?kulit=${kulit}`} className="tombol tombol-garis mt-5 w-full sm:w-auto">
          Jawab tiga pertanyaan lagi
        </Link>
      </div>
    </div>
  );
}
