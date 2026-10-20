'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { produk, cariProduk } from '@/lib/data';
import { cekPao, biayaPerBulan, labelVarian } from '@/lib/katalog';
import { durasi, rupiahRingkas } from '@/lib/format';

const DAFTAR = produk.filter((p) => p.takaran.ml && p.kaliSeminggu);

export function opsiFrekuensi(p) {
  const saran = { id: 'saran', kali: p.kaliSeminggu, label: 'Sesuai saran' };
  const lain = [
    { id: 'sekali', kali: 7, label: 'Sekali sehari' },
    { id: 'dua', kali: 14, label: 'Pagi dan malam' },
    { id: 'tiga', kali: 3, label: 'Tiga kali seminggu' },
  ].filter((o) => o.kali !== p.kaliSeminggu && (p.waktu.length === 2 || o.kali !== 14));
  return [saran, ...lain];
}

// Perkiraan kapan satu kemasan habis, dibandingkan dengan batas pakai setelah dibuka (PAO).
export function HasilHabis({ p, v, kali, besar = false }) {
  const c = cekPao(p, v, kali);
  const bulanan = biayaPerBulan(p, v, kali);
  if (!c) return null;
  return (
    <div>
      <p className={`font-display leading-none ${besar ? 'text-5xl sm:text-6xl' : 'text-4xl'}`}>{durasi(c.hari)}</p>
      <p className="mt-2 text-[0.92rem] text-tinta-2">
        {v.ukuran} {v.satuan} dengan takaran {p.takaran.label}, {kali} kali seminggu. Biayanya sekitar {rupiahRingkas(bulanan)} per bulan.
      </p>
      <p className={`mt-3 rounded-xl px-3.5 py-2.5 text-[0.92rem] ${c.lewat ? 'bg-[#fdf0e8] text-awas' : 'bg-daun-muda text-tinta'}`}>
        {c.lewat
          ? `Lebih lama dari batas ${p.pao} bulan setelah dibuka. Sisa yang lewat batas sebaiknya dibuang, jadi ukuran yang lebih kecil lebih pas.`
          : `Habis sebelum batas ${p.pao} bulan setelah dibuka.`}
      </p>
    </div>
  );
}

export default function KalkulatorHabis({ awal = 'tabir-surya-spf50' }) {
  const id = useId();
  const [slug, setSlug] = useState(awal);
  const p = cariProduk(slug);
  const [varian, setVarian] = useState(() => (p.varian.filter((x) => !x.isiUlang).slice(-1)[0] || p.varian[0]).id);
  const [frek, setFrek] = useState('saran');
  const v = p.varian.find((x) => x.id === varian) || p.varian[p.varian.length - 1];
  const opsi = opsiFrekuensi(p);
  const kali = (opsi.find((o) => o.id === frek) || opsi[0]).kali;

  const gantiProduk = (s) => {
    const baru = cariProduk(s);
    setSlug(s);
    setVarian(baru.varian.find((x) => !x.isiUlang)?.id || baru.varian[0].id);
    setFrek('saran');
  };

  return (
    <div className="flex h-full flex-col">
      <h3 className="font-display text-[1.45rem] leading-snug sm:text-[1.7rem]">Berapa lama satu kemasan habis?</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-produk`} className="text-[0.9rem] font-medium">
            Produk
          </label>
          <select id={`${id}-produk`} className="isian mt-1" value={slug} onChange={(e) => gantiProduk(e.target.value)}>
            {DAFTAR.map((x) => (
              <option key={x.slug} value={x.slug}>
                {x.nama}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-ukuran`} className="text-[0.9rem] font-medium">
            Ukuran
          </label>
          <select id={`${id}-ukuran`} className="isian mt-1" value={v.id} onChange={(e) => setVarian(e.target.value)}>
            {p.varian.map((x) => (
              <option key={x.id} value={x.id}>
                {labelVarian(p, x.id)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-frek`} className="text-[0.9rem] font-medium">
            Dipakai
          </label>
          <select id={`${id}-frek`} className="isian mt-1" value={frek} onChange={(e) => setFrek(e.target.value)}>
            {opsi.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5 border-t border-garis pt-5" aria-live="polite">
        <HasilHabis p={p} v={v} kali={kali} />
      </div>
      <Link href={`/produk/${p.slug}`} className="tautan mt-4 self-start text-[0.95rem] font-medium">
        Lihat {p.nama}
      </Link>
    </div>
  );
}
