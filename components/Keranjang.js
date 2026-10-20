'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Kemasan from './Kemasan';
import { cariProduk, cariLangkah } from '@/lib/data';
import { cariVarian, labelVarian, stokVarian, produkAktif, hematIsiUlang } from '@/lib/katalog';
import { beratKemasan } from '@/lib/ongkir';
import { rupiah, gram } from '@/lib/format';
import { useKeranjang, useInventaris, useTerpasang, ubahJumlah, hapusItem, itemKunci } from '@/lib/store';

export function rakitIsiKeranjang(keranjang, inv) {
  return keranjang
    .map((it) => {
      const p = cariProduk(it.slug);
      if (!p) return null;
      const v = cariVarian(p, it.varian);
      return { ...it, kunci: itemKunci(it), p, v, stok: stokVarian(p, v.id, inv), aktif: produkAktif(p, inv), harga: v.harga, berat: v.berat, label: labelVarian(p, v.id) };
    })
    .filter(Boolean);
}

export function Gambar({ p, v, className = 'h-16 w-14' }) {
  return (
    <span className={`block shrink-0 rounded-lg ${className}`} style={{ background: cariLangkah(p.langkah).muda }}>
      <Kemasan slug={p.slug} varian={v.id} bingkai="pas" className="h-full w-full" />
    </span>
  );
}

function Stepper({ it }) {
  const maks = Math.max(1, it.stok);
  return (
    <div className="flex items-stretch rounded-full border-[1.5px] border-garis-tua bg-kertas" role="group" aria-label={`Jumlah ${it.p.nama}`}>
      <button type="button" className="min-h-10 w-10 rounded-s-full text-lg disabled:text-tinta-3" onClick={() => ubahJumlah(it.kunci, it.qty - 1)} disabled={it.qty <= 1} aria-label={`Kurangi ${it.p.nama}`}>
        −
      </button>
      <span className="flex w-9 items-center justify-center font-semibold tabular-nums" aria-live="polite">
        <span className="sr-only">Jumlah: </span>
        {it.qty}
      </span>
      <button type="button" className="min-h-10 w-10 rounded-e-full text-lg disabled:text-tinta-3" onClick={() => ubahJumlah(it.kunci, it.qty + 1)} disabled={it.qty >= maks} aria-label={`Tambah ${it.p.nama}`}>
        +
      </button>
    </div>
  );
}

const SARAN = ['gel-pembersih-pegagan', 'serum-niasinamida-5', 'tabir-surya-spf50'];

export default function Keranjang() {
  const terpasang = useTerpasang();
  const keranjang = useKeranjang();
  const inv = useInventaris();
  const isi = rakitIsiKeranjang(keranjang, inv);

  // Jumlah melebihi stok (mis. stok diubah di dasbor) disesuaikan otomatis.
  useEffect(() => {
    for (const it of isi) if (it.stok > 0 && it.qty > it.stok) ubahJumlah(it.kunci, it.stok);
  }, [isi]);

  if (!terpasang) {
    return (
      <div className="wadah pb-24">
        <p className="text-tinta-2">Memuat keranjang…</p>
      </div>
    );
  }

  if (!isi.length) {
    return (
      <div className="wadah pb-24">
        <div className="rounded-[18px] border border-dashed border-garis-tua bg-kertas p-6 sm:p-10">
          <h2 className="text-3xl">Keranjangmu masih kosong</h2>
          <p className="mt-2 max-w-md text-tinta-2">Belum tahu mulai dari mana? Jawab empat pertanyaan, atau lihat rutinitas dasar di bawah.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/cocokkan" className="tombol tombol-utama">
              Cocokkan dengan kulitmu
            </Link>
            <Link href="/produk" className="tombol tombol-garis">
              Lihat semua produk
            </Link>
          </div>
        </div>
        <h2 className="mt-14 text-2xl">Rutinitas dasar: bersihkan, rawat, lindungi</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {SARAN.map((s) => {
            const p = cariProduk(s);
            return (
              <li key={s}>
                <Link href={`/produk/${s}`} className="group flex items-center gap-3 rounded-[14px] border border-garis bg-kertas p-3 hover:border-garis-tua">
                  <Gambar p={p} v={p.varian[0]} />
                  <span>
                    <span className="block font-medium group-hover:underline">{p.nama}</span>
                    <span className="block text-[0.9rem] text-tinta-2">mulai {rupiah(Math.min(...p.varian.map((x) => x.harga)))}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const subtotal = isi.reduce((n, it) => n + it.harga * it.qty, 0);
  const berat = isi.reduce((n, it) => n + it.berat * it.qty, 0);
  const jumlah = isi.reduce((n, it) => n + it.qty, 0);
  const masalah = isi.filter((it) => it.stok <= 0 || !it.aktif);
  // Saran isi ulang: produk di keranjang yang dibeli dalam botol padahal ada isi ulangnya.
  const bisaUlang = isi.filter((it) => !it.v.isiUlang && hematIsiUlang(it.p));

  return (
    <div className="wadah grid gap-10 pb-6 lg:grid-cols-12">
      <section aria-labelledby="judul-isi" className="lg:col-span-8">
        <h2 id="judul-isi" className="sr-only">
          Isi keranjang
        </h2>
        <ul className="border-t-2 border-tinta">
          {isi.map((it) => {
            const habis = it.stok <= 0 || !it.aktif;
            return (
              <li key={it.kunci} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-garis py-5 sm:grid-cols-[6rem_1fr_auto]">
                <Link href={`/produk/${it.slug}?varian=${it.v.id}`} tabIndex={-1} aria-hidden="true">
                  <Gambar p={it.p} v={it.v} className="h-24 w-[4.5rem] sm:h-28 sm:w-24" />
                </Link>
                <div className="min-w-0">
                  <h3 className="font-display text-xl leading-snug">
                    <Link href={`/produk/${it.slug}?varian=${it.v.id}`} className="hover:underline">
                      {it.p.nama}
                    </Link>
                  </h3>
                  <p className="data text-[0.82rem] text-tinta-2">{it.label}</p>
                  <p className="mt-1 text-[0.92rem]">
                    {rupiah(it.harga)} <span className="text-tinta-3">· {gram(it.berat)} dengan wadah</span>
                  </p>
                  {habis ? (
                    <p className="mt-2 text-[0.9rem] font-medium text-awas">
                      {it.aktif ? 'Stok ukuran ini habis.' : 'Produk ini sedang tidak dijual.'} Hapus dari keranjang untuk melanjutkan.
                    </p>
                  ) : it.qty >= it.stok ? (
                    <p className="mt-2 text-[0.85rem] text-awas">Sudah maksimal, stok tinggal {it.stok}.</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap items-center gap-4 sm:hidden">
                    {!habis && <Stepper it={it} />}
                    <button type="button" className="tautan min-h-10 text-[0.92rem]" onClick={() => hapusItem(it.kunci)}>
                      Hapus<span className="sr-only"> {it.p.nama}</span>
                    </button>
                  </div>
                </div>
                <div className="hidden flex-col items-end justify-between gap-3 sm:flex">
                  <p className="text-lg font-semibold tabular-nums">{rupiah(it.harga * it.qty)}</p>
                  {!habis && <Stepper it={it} />}
                  <button type="button" className="tautan text-[0.92rem]" onClick={() => hapusItem(it.kunci)}>
                    Hapus<span className="sr-only"> {it.p.nama}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {bisaUlang.length > 0 && (
          <p className="mt-5 rounded-xl border-s-4 border-kunyit bg-kunyit-muda/50 p-3.5 text-[0.92rem]">
            {bisaUlang.map((it) => it.p.nama).join(', ')} juga ada dalam kemasan isi ulang. Kalau sudah punya botolnya, isi ulang lebih hemat sampai{' '}
            {Math.max(...bisaUlang.map((it) => hematIsiUlang(it.p).persen))}% per ml.
          </p>
        )}
        <Link href="/produk" className="tautan mt-5 inline-block font-medium">
          Lanjut belanja
        </Link>
      </section>

      <aside aria-labelledby="judul-ringkas" className="lg:col-span-4">
        <div className="rounded-[18px] border border-garis-tua bg-kertas p-5 sm:p-6 lg:sticky lg:top-28">
          <h2 id="judul-ringkas" className="text-2xl">
            Ringkasan
          </h2>
          <dl className="mt-4 grid gap-2 text-[0.95rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Subtotal ({jumlah} barang)</dt>
              <dd className="font-semibold tabular-nums">{rupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Berat barang</dt>
              <dd className="tabular-nums">{gram(berat)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Perkiraan kemasan kirim</dt>
              <dd className="tabular-nums">{gram(beratKemasan(berat))}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-garis pt-4 text-[0.88rem] text-tinta-2">Ongkir dihitung di checkout dari provinsi tujuan, atau gratis bila diambil di toko.</p>
          {masalah.length > 0 ? (
            <>
              <p className="mt-4 text-[0.9rem] font-medium text-awas" role="status">
                Ada {masalah.length} barang yang tidak bisa dipesan. Hapus dulu untuk melanjutkan.
              </p>
              <span className="tombol mt-4 w-full" aria-disabled="true">
                Lanjut ke checkout
              </span>
            </>
          ) : (
            <Link href="/checkout" className="tombol tombol-utama mt-5 w-full">
              Lanjut ke checkout
            </Link>
          )}
        </div>
      </aside>

      {masalah.length === 0 && (
        <div className="sticky bottom-0 z-30 -mx-4 border-t border-garis-tua bg-kertas/95 px-4 py-3 shadow-[0_-8px_20px_-12px_rgba(23,32,28,0.35)] sm:-mx-6 sm:px-6 lg:hidden">
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1">
              <span className="block text-[0.82rem] text-tinta-2">Subtotal {jumlah} barang</span>
              <span className="block font-semibold tabular-nums">{rupiah(subtotal)}</span>
            </p>
            <Link href="/checkout" className="tombol tombol-utama px-5">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
