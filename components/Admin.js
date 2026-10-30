'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TOPIK } from './FormKontak';
import { produk, statusPesanan, cariKulit } from '@/lib/data';
import { stokVarian, produkAktif, labelVarian } from '@/lib/katalog';
import { ringkasPenjualan, labelStatus } from '@/lib/pesanan';
import { rupiah, rupiahRingkas, waktuWIB, tanggalPanjang, hariPendek, tanggalPendek } from '@/lib/format';
import {
  usePesanan,
  useInventaris,
  useTerpasang,
  usePesanKontak,
  ubahStatusPesanan,
  aturStok,
  aturAktif,
  kembalikanDataContoh,
  tandaiPesanDibaca,
} from '@/lib/store';

const BATAS_MENIPIS = 3;

function Ubin({ label, nilai, catatan }) {
  return (
    <div className="rounded-[14px] border border-garis-tua bg-kertas p-4 sm:p-5">
      <p className="text-[0.9rem] text-tinta-2">{label}</p>
      <p className="mt-1 text-[1.3rem] font-semibold leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-3xl">{nilai}</p>
      {catatan && <p className="mt-1 text-[0.85rem] text-tinta-3">{catatan}</p>}
    </div>
  );
}

function GrafikTujuhHari({ hari }) {
  const [aktif, setAktif] = useState(null);
  const maks = Math.max(...hari.map((h) => h.total), 1);
  const atas = maks <= 500000 ? 500000 : Math.ceil(maks / 500000) * 500000;
  const iMaks = hari.reduce((a, h, i) => (h.total > hari[a].total ? i : a), 0);
  const tinggiPlot = 180;
  return (
    <figure className="m-0">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-semibold">Penjualan per hari, 7 hari terakhir</span>
        <span className="text-[0.85rem] text-tinta-3">Pesanan yang sudah dibayar, per tanggal WIB</span>
      </figcaption>
      <div className="relative mt-5 grid grid-cols-[3.4rem_1fr] gap-2">
        <div className="relative" style={{ height: tinggiPlot }} aria-hidden="true">
          {[atas, atas / 2, 0].map((v, i) => (
            <span key={v} className="data absolute right-0 -translate-y-1/2 text-[0.75rem] text-tinta-3" style={{ top: `${i * 50}%` }}>
              {rupiahRingkas(v)}
            </span>
          ))}
        </div>
        <div className="relative" style={{ height: tinggiPlot }}>
          {[0, 50, 100].map((t) => (
            <span key={t} aria-hidden="true" className="absolute inset-x-0 h-px bg-garis" style={{ top: `${t}%` }} />
          ))}
          <ul className="absolute inset-0 grid grid-cols-7 items-end">
            {hari.map((h, i) => {
              const tinggi = (h.total / atas) * 100;
              const hariIni = i === hari.length - 1;
              const label = `${tanggalPanjang(h.awal + 3600000)}: ${rupiah(h.total)}, ${h.jumlah} pesanan`;
              return (
                <li key={h.kunci} className="relative flex h-full items-end justify-center">
                  <div
                    role="img"
                    tabIndex={0}
                    aria-label={label}
                    onPointerEnter={() => setAktif(i)}
                    onPointerLeave={() => setAktif(null)}
                    onFocus={() => setAktif(i)}
                    onBlur={() => setAktif(null)}
                    className="group relative flex h-full w-full cursor-default items-end justify-center rounded-sm"
                  >
                    <span
                      className={`block w-[min(26px,60%)] rounded-t-[6px] ${hariIni ? 'bg-kunyit' : 'bg-[#b9c7bf]'} ${aktif === i ? 'opacity-80' : ''}`}
                      style={{ height: `${Math.max(tinggi, h.total ? 2 : 0)}%` }}
                    />
                    {(hariIni || (i === iMaks && h.total > 0)) && (
                      <span className="data absolute -translate-y-1 text-[0.75rem] font-medium text-tinta" style={{ bottom: `${Math.max(tinggi, 0)}%` }} aria-hidden="true">
                        {rupiahRingkas(h.total)}
                      </span>
                    )}
                  </div>
                  {aktif === i && (
                    <span role="presentation" className={`pointer-events-none absolute bottom-full z-10 mb-2 w-max max-w-[11rem] rounded-lg bg-tinta px-2.5 py-1.5 text-[0.78rem] text-kertas shadow-lg ${i > 3 ? 'right-0' : 'left-0'}`}>
                      <span className="block font-semibold">{rupiah(h.total)}</span>
                      <span className="block">
                        {h.jumlah} pesanan · {tanggalPendek(h.awal + 3600000)}
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <span />
        <ul className="grid grid-cols-7" aria-hidden="true">
          {hari.map((h, i) => (
            <li key={h.kunci} className={`text-center text-[0.75rem] leading-tight ${i === hari.length - 1 ? 'font-semibold text-tinta' : 'text-tinta-3'}`}>
              {i === hari.length - 1 ? 'Hari ini' : hariPendek(h.awal + 3600000)}
              <span className="block tabular-nums">{tanggalPendek(h.awal + 3600000)}</span>
            </li>
          ))}
        </ul>
      </div>
      <details className="mt-4 text-[0.9rem]">
        <summary className="cursor-pointer underline underline-offset-4">Lihat sebagai tabel</summary>
        <table className="mt-2 w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-tinta">
              <th scope="col" className="py-1.5 pe-3 font-semibold">Tanggal</th>
              <th scope="col" className="py-1.5 pe-3 text-end font-semibold">Pesanan</th>
              <th scope="col" className="py-1.5 text-end font-semibold">Penjualan</th>
            </tr>
          </thead>
          <tbody>
            {hari.map((h) => (
              <tr key={h.kunci} className="border-b border-garis">
                <td className="py-1.5 pe-3">{tanggalPanjang(h.awal + 3600000)}</td>
                <td className="py-1.5 pe-3 text-end tabular-nums">{h.jumlah}</td>
                <td className="py-1.5 text-end tabular-nums">{rupiah(h.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

function InputStok({ nilai, onSimpan, label }) {
  const [teks, setTeks] = useState(String(nilai));
  const [fokus, setFokus] = useState(false);
  useEffect(() => {
    if (!fokus) setTeks(String(nilai));
  }, [nilai, fokus]);
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      step={1}
      aria-label={label}
      value={teks}
      onFocus={() => setFokus(true)}
      onBlur={() => {
        setFokus(false);
        if (teks.trim() === '' || Number.isNaN(Number(teks))) setTeks(String(nilai));
      }}
      onChange={(e) => {
        setTeks(e.target.value);
        const n = Number(e.target.value);
        if (e.target.value.trim() !== '' && Number.isInteger(n) && n >= 0) onSimpan(n);
      }}
      className={`isian min-h-10 w-[4.75rem] px-2 py-1.5 text-center tabular-nums ${nilai === 0 ? 'border-awas text-awas' : nilai <= BATAS_MENIPIS ? 'border-[#c2410c]' : ''}`}
    />
  );
}

function PilihStatus({ p, onUbah, className = '' }) {
  return (
    <select className={`isian min-h-10 py-1.5 text-[0.9rem] ${className}`} aria-label={`Status ${p.kode}`} value={p.status} onChange={(e) => onUbah(p.kode, e.target.value)}>
      {statusPesanan.map((s) => (
        <option key={s.id} value={s.id}>
          {labelStatus(s.id, p.kirim.layanan)}
        </option>
      ))}
    </select>
  );
}

export default function Admin() {
  const terpasang = useTerpasang();
  const daftar = usePesanan();
  const inv = useInventaris();
  const pesanMasuk = usePesanKontak();
  const [saring, setSaring] = useState('semua');
  const [yakin, setYakin] = useState(false);
  const [pesan, setPesan] = useState('');

  if (!terpasang) {
    return (
      <div className="wadah pb-20">
        <p className="text-tinta-2" role="status">
          Memuat data di browser ini…
        </p>
      </div>
    );
  }

  const r = ringkasPenjualan(daftar, Date.now());
  const tampil = saring === 'semua' ? daftar : daftar.filter((p) => p.status === saring);
  const menipis = [];
  for (const p of produk) for (const v of p.varian) {
    const s = stokVarian(p, v.id, inv);
    if (s <= BATAS_MENIPIS) menipis.push({ p, v, s });
  }
  menipis.sort((a, b) => a.s - b.s);
  const belumDibaca = pesanMasuk.filter((m) => !m.dibaca).length;

  const ubahStatus = (kode, status) => {
    ubahStatusPesanan(kode, status);
    const o = daftar.find((x) => x.kode === kode);
    setPesan(`Status ${kode} diubah menjadi ${labelStatus(status, o?.kirim.layanan)}.`);
  };

  return (
    <div className="wadah grid gap-14 pb-20">
      <div role="status" aria-live="polite" className="sr-only">
        {pesan}
      </div>

      <section aria-labelledby="judul-ringkas">
        <h2 id="judul-ringkas" className="text-3xl sm:text-4xl">
          Ringkasan penjualan
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Ubin label="Penjualan hari ini" nilai={rupiah(r.hariIni.total)} catatan={`${r.hariIni.jumlah} pesanan dibayar`} />
          <Ubin label="7 hari terakhir" nilai={rupiah(r.tujuhHari.total)} catatan={`${r.tujuhHari.jumlah} pesanan dibayar`} />
          <Ubin label="Menunggu pembayaran" nilai={r.menunggu} catatan="pesanan" />
          <Ubin label="Isi ulang terjual" nilai={r.isiUlang} catatan="kantong atau wadah, 7 hari" />
        </div>
        <div className="mt-4 rounded-[14px] border border-garis-tua bg-kertas p-4 sm:p-6">
          <GrafikTujuhHari hari={r.hari} />
        </div>
      </section>

      <section aria-labelledby="judul-pesanan">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="judul-pesanan" className="text-3xl sm:text-4xl">
            Pesanan
          </h2>
          <label className="flex items-center gap-2 text-[0.92rem]">
            <span className="text-tinta-2">Tampilkan</span>
            <select className="isian min-h-10 w-auto py-1.5" value={saring} onChange={(e) => setSaring(e.target.value)}>
              <option value="semua">Semua status ({daftar.length})</option>
              {statusPesanan.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({daftar.filter((p) => p.status === s.id).length})
                </option>
              ))}
            </select>
          </label>
        </div>
        <ul className="mt-5 grid gap-3 md:hidden" aria-label={`Daftar pesanan, ${tampil.length} pesanan`}>
          {tampil.map((p) => (
            <li key={p.kode} className="rounded-[14px] border border-garis-tua bg-kertas p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/pesanan/${p.kode}`} className="data inline-block py-1 whitespace-nowrap text-[0.85rem] underline underline-offset-2">
                    {p.kode}
                  </Link>
                  <p className="mt-1 text-[0.85rem] text-tinta-2">
                    {waktuWIB(p.dibuat)}
                    {p.contoh ? ' · contoh' : ''}
                  </p>
                </div>
                <p className="font-semibold tabular-nums">{rupiah(p.total)}</p>
              </div>
              <p className="mt-2">
                {p.pembeli.nama}
                <span className="text-[0.85rem] text-tinta-3">
                  {' '}
                  · {p.kirim.layanan === 'ambil' ? 'ambil di toko' : p.pembeli.kota} · {p.items.reduce((n, it) => n + it.qty, 0)} barang
                </span>
              </p>
              <div className="mt-3">
                <PilihStatus p={p} onUbah={ubahStatus} className="w-full" />
              </div>
            </li>
          ))}
          {!tampil.length && <li className="rounded-[14px] border border-garis bg-kertas p-4 text-tinta-2">Tidak ada pesanan dengan status ini.</li>}
        </ul>
        <div className="mt-5 hidden overflow-x-auto rounded-[14px] border border-garis-tua bg-kertas md:block">
          <table className="w-full min-w-[46rem] border-collapse text-left text-[0.92rem]">
            <caption className="sr-only">Daftar pesanan, {tampil.length} baris</caption>
            <thead>
              <tr className="border-b border-tinta bg-kabut/60">
                <th scope="col" className="px-4 py-2.5 font-semibold">Kode</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Dibuat</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Pembeli</th>
                <th scope="col" className="px-4 py-2.5 text-end font-semibold">Total</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((p) => (
                <tr key={p.kode} className="border-b border-garis last:border-0">
                  <th scope="row" className="px-4 py-3 font-normal">
                    <Link href={`/pesanan/${p.kode}`} className="data inline-block py-1 whitespace-nowrap text-[0.85rem] underline underline-offset-2">
                      {p.kode}
                    </Link>
                    {p.contoh && <span className="block text-[0.75rem] text-tinta-3">contoh</span>}
                  </th>
                  <td className="whitespace-nowrap px-4 py-3 text-tinta-2">{waktuWIB(p.dibuat)}</td>
                  <td className="px-4 py-3">
                    {p.pembeli.nama}
                    <span className="block text-[0.8rem] text-tinta-3">
                      {p.kirim.layanan === 'ambil' ? 'Ambil di toko' : p.pembeli.kota} · {p.items.reduce((n, it) => n + it.qty, 0)} barang
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end tabular-nums">{rupiah(p.total)}</td>
                  <td className="px-4 py-3">
                    <PilihStatus p={p} onUbah={ubahStatus} className="w-auto" />
                  </td>
                </tr>
              ))}
              {!tampil.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-tinta-2">
                    Tidak ada pesanan dengan status ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[0.85rem] text-tinta-3">
          Mengubah status ke tahap yang lebih jauh ikut mengisi tahap yang terlewat dengan waktu yang sama. Resi contoh dibuat saat status Dikirim; pesanan
          ambil di toko memakai status Siap diambil.
        </p>
      </section>

      <section id="pesan" aria-labelledby="judul-pesan" className="scroll-mt-28">
        <h2 id="judul-pesan" className="text-3xl sm:text-4xl">
          Pesan masuk {belumDibaca > 0 && <span className="data align-middle text-[1rem] text-kunyit-tua">{belumDibaca} belum dibaca</span>}
        </h2>
        <p className="mt-2 max-w-2xl text-tinta-2">Dari formulir kontak di browser ini. Di toko sungguhan, pesan masuk ke email atau aplikasi layanan pelanggan.</p>
        {pesanMasuk.length ? (
          <ul className="mt-5 grid gap-3 lg:grid-cols-2">
            {pesanMasuk.map((m) => (
              <li key={m.id} className={`rounded-[14px] border p-4 ${m.dibaca ? 'border-garis bg-ubin' : 'border-garis-tua bg-kertas'}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">
                    {m.nama}
                    {!m.dibaca && <span className="data ms-2 rounded-full bg-kunyit px-2 py-0.5 text-[0.75rem] font-medium">baru</span>}
                  </p>
                  <p className="data text-[0.78rem] text-tinta-3">{waktuWIB(m.waktu)}</p>
                </div>
                <p className="text-[0.85rem] text-tinta-2">
                  {TOPIK.find((t) => t.id === m.topik)?.nama}
                  {m.kulit ? ` · kulit ${cariKulit(m.kulit)?.nama.toLowerCase()}` : ''}
                  {m.email ? ` · ${m.email}` : ''}
                </p>
                <p className="mt-2 whitespace-pre-line text-[0.95rem]">{m.pesan}</p>
                <button type="button" className="tautan mt-3 min-h-10 text-[0.9rem]" onClick={() => tandaiPesanDibaca(m.id, !m.dibaca)}>
                  {m.dibaca ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 rounded-[14px] border border-dashed border-garis-tua bg-kertas p-5 text-tinta-2">
            Belum ada pesan. Coba kirim satu dari{' '}
            <Link href="/kontak" className="tautan">
              halaman kontak
            </Link>
            .
          </p>
        )}
      </section>

      <section aria-labelledby="judul-menipis" className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="judul-menipis" className="text-3xl sm:text-4xl">
            Stok menipis
          </h2>
          <p className="mt-2 text-tinta-2">Varian dengan stok {BATAS_MENIPIS} atau kurang. Pesanan baru mengurangi stok otomatis.</p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 lg:col-span-8">
          {menipis.slice(0, 12).map(({ p, v, s }) => (
            <li key={`${p.slug}-${v.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-garis bg-kertas px-3.5 py-2.5">
              <span className="min-w-0">
                <a href={`#stok-${p.slug}`} className="block py-0.5 font-medium leading-snug hover:underline">
                  {p.nama}
                </a>
                <span className="data block text-[0.78rem] text-tinta-2">{labelVarian(p, v.id)}</span>
              </span>
              <span className={`data shrink-0 text-[0.78rem] ${s === 0 ? 'font-medium text-awas' : 'text-[#9a3412]'}`}>{s === 0 ? 'Habis' : `Sisa ${s}`}</span>
            </li>
          ))}
          {!menipis.length && <li className="text-tinta-2">Semua varian masih di atas batas.</li>}
          {menipis.length > 12 && <li className="text-[0.9rem] text-tinta-2">dan {menipis.length - 12} varian lain.</li>}
        </ul>
      </section>

      <section aria-labelledby="judul-stok">
        <h2 id="judul-stok" className="text-3xl sm:text-4xl">
          Stok per varian
        </h2>
        <p className="mt-2 max-w-2xl text-tinta-2">Ubah angka untuk menyimpan langsung. Produk yang dinonaktifkan hilang dari katalog dan tidak bisa dibeli.</p>
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {produk.map((p) => {
            const aktif = produkAktif(p, inv);
            return (
              <li key={p.slug} id={`stok-${p.slug}`} className={`scroll-mt-28 rounded-[14px] border p-4 sm:p-5 ${aktif ? 'border-garis-tua bg-kertas' : 'border-dashed border-garis-tua bg-ubin'}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-xl leading-snug">
                    <Link href={`/produk/${p.slug}`} className="hover:underline">
                      {p.nama}
                    </Link>
                  </h3>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={aktif}
                    aria-label={`Jual ${p.nama}`}
                    onClick={() => {
                      aturAktif(p.slug, !aktif);
                      setPesan(`${p.nama} ${aktif ? 'dinonaktifkan' : 'diaktifkan'}.`);
                    }}
                    className="flex min-h-10 items-center gap-2.5 rounded-full px-1 text-[0.9rem]"
                  >
                    <span className={`relative inline-block h-6 w-11 shrink-0 rounded-full transition-colors ${aktif ? 'bg-aman' : 'bg-tinta-3'}`} aria-hidden="true">
                      <span className={`absolute left-0 top-0.5 block h-5 w-5 rounded-full bg-kertas shadow transition-transform ${aktif ? 'translate-x-[1.375rem]' : 'translate-x-0.5'}`} />
                    </span>
                    <span>{aktif ? 'Dijual' : 'Nonaktif'}</span>
                  </button>
                </div>
                <ul className="mt-3 grid gap-2">
                  {p.varian.map((v) => (
                    <li key={v.id} className="flex items-center justify-between gap-3 border-t border-garis pt-2">
                      <span className="data text-[0.85rem] text-tinta-2">{labelVarian(p, v.id)}</span>
                      <InputStok nilai={stokVarian(p, v.id, inv)} label={`Stok ${p.nama}, ${labelVarian(p, v.id)}`} onSimpan={(n) => aturStok(p.slug, v.id, n)} />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="judul-reset" className="rounded-[18px] border-2 border-dashed border-garis-tua p-5 sm:p-6">
        <h2 id="judul-reset" className="font-sans text-xl font-semibold tracking-normal">
          Kembalikan data contoh
        </h2>
        <p className="mt-2 max-w-2xl text-tinta-2">
          Menghapus pesanan buatanmu, pesan kontak, dan semua perubahan stok di browser ini, lalu membuat ulang pesanan contoh dengan tanggal relatif hari
          ini. Keranjang dan rutinitas tidak ikut dihapus.
        </p>
        {yakin ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="font-medium">Yakin? Ini tidak bisa dibatalkan.</p>
            <button
              type="button"
              className="tombol tombol-utama"
              onClick={() => {
                kembalikanDataContoh();
                setYakin(false);
                setSaring('semua');
                setPesan('Data contoh dikembalikan.');
              }}
            >
              Ya, kembalikan
            </button>
            <button type="button" className="tombol tombol-garis" onClick={() => setYakin(false)}>
              Batal
            </button>
          </div>
        ) : (
          <button type="button" className="tombol tombol-garis mt-4" onClick={() => setYakin(true)}>
            Kembalikan data contoh
          </button>
        )}
        {pesan === 'Data contoh dikembalikan.' && <p className="mt-3 font-medium text-aman">Data contoh sudah dikembalikan.</p>}
      </section>
    </div>
  );
}
