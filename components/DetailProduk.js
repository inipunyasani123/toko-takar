'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Kemasan from './Kemasan';
import Olesan from './Olesan';
import Takaran from './Takaran';
import { HasilHabis, opsiFrekuensi } from './KalkulatorHabis';
import { cariProduk, cariLangkah, cariKulit, skalaKental, site } from '@/lib/data';
import { bahanDariInci, cariBahan, fungsi as daftarFungsi } from '@/lib/kandungan';
import { cariVarian, labelVarian, stokVarian, varianAwal, produkAktif, hematIsiUlang, namaWadah } from '@/lib/katalog';
import { rupiah, gram, angkaId } from '@/lib/format';
import { useInventaris, useKeranjang, useTerpasang, useRutinitas, tambahKeKeranjang, tambahKeRutinitas } from '@/lib/store';

function Fakta({ label, children }) {
  return (
    <div className="border-t border-garis py-3 first:border-0 sm:border-0 sm:py-0">
      <dt className="text-[0.82rem] text-tinta-3">{label}</dt>
      <dd className="mt-0.5 font-medium">{children}</dd>
    </div>
  );
}

export default function DetailProduk({ slug }) {
  const p = cariProduk(slug);
  const l = cariLangkah(p.langkah);
  const terpasang = useTerpasang();
  const invAsli = useInventaris();
  const inv = terpasang ? invAsli : undefined;
  const keranjang = useKeranjang();
  const rutinitas = useRutinitas();
  const [vid, setVid] = useState(varianAwal(p));
  const [qty, setQty] = useState(1);
  const [gambar, setGambar] = useState(0);
  const [pesan, setPesan] = useState(null);
  const [pesanRutin, setPesanRutin] = useState('');
  const [frek, setFrek] = useState('saran');
  const [lengket, setLengket] = useState(false);
  const tombolRef = useRef(null);
  const sudahAtur = useRef(false);

  // Setelah terpasang: pakai varian dari URL (?varian=) dan stok sebenarnya di browser.
  useEffect(() => {
    if (!terpasang || sudahAtur.current) return;
    sudahAtur.current = true;
    const dariUrl = new URLSearchParams(window.location.search).get('varian');
    let v = dariUrl && p.varian.some((x) => x.id === dariUrl) ? dariUrl : vid;
    if (stokVarian(p, v, invAsli) <= 0) v = varianAwal(p, invAsli);
    setVid(v);
  }, [terpasang, invAsli, p, vid]);

  useEffect(() => {
    const el = tombolRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setLengket(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const v = cariVarian(p, vid);
  const aktif = produkAktif(p, inv);
  const stok = stokVarian(p, v.id, inv);
  const diKeranjang = terpasang ? keranjang.filter((it) => it.slug === p.slug && it.varian === v.id).reduce((n, it) => n + it.qty, 0) : 0;
  const bisaTambah = Math.max(0, stok - diKeranjang);
  const qtyAman = Math.min(Math.max(1, qty), Math.max(1, bisaTambah));
  const hemat = hematIsiUlang(p);
  const bolehRutin = p.langkah !== 'tubuh';
  const diRutinitas = terpasang ? ['pagi', 'malam'].filter((w) => (rutinitas[w] || []).includes(p.slug)) : [];
  const opsi = opsiFrekuensi(p);
  const kali = (opsi.find((o) => o.id === frek) || opsi[0]).kali;

  const pilihVarian = (id) => {
    setVid(id);
    setQty(1);
    setPesan(null);
    const i = p.varian.findIndex((x) => x.id === id);
    if (i >= 0) setGambar(i);
  };

  const tambah = () => {
    if (!aktif || bisaTambah <= 0) return;
    const r = tambahKeKeranjang({ slug: p.slug, varian: v.id, qty: qtyAman });
    if (r.ok) {
      setPesan({ ok: true, teks: `${r.ditambahkan} × ${p.nama} (${labelVarian(p, v.id)}) masuk keranjang.` });
      setQty(1);
    } else setPesan({ ok: false, teks: 'Stok ukuran ini sudah habis atau semuanya sudah ada di keranjangmu.' });
  };

  const keRutinitas = () => {
    const masuk = tambahKeRutinitas(p.slug, p.waktu);
    setPesanRutin(masuk.length ? `Masuk ke rutinitas ${masuk.join(' dan ')}.` : 'Produk ini sudah ada di rutinitasmu.');
  };

  const galeri = [
    ...p.varian.map((x) => ({ jenis: 'varian', id: x.id, label: labelVarian(p, x.id) })),
    ...(p.tekstur.kental ? [{ jenis: 'tekstur', label: `Tekstur: ${p.tekstur.jenis.toLowerCase()}` }] : []),
  ];
  const tampil = galeri[Math.min(gambar, galeri.length - 1)];
  const statusStok = stok <= 0 ? 'Habis untuk ukuran ini' : stok <= 5 ? `Sisa ${stok}` : `Stok ${stok}`;
  const cocok = p.kulit.cocok.map((k) => cariKulit(k).nama.toLowerCase());

  return (
    <div className="relative">
      <div className="wadah grid gap-x-12 gap-y-8 lg:grid-cols-12">
        {/* Galeri */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-square overflow-hidden rounded-[20px]" style={{ background: tampil.jenis === 'tekstur' ? undefined : l.muda }}>
              {tampil.jenis === 'varian' ? (
                <Kemasan
                  key={tampil.id}
                  slug={p.slug}
                  varian={tampil.id}
                  bingkai="pas"
                  judul={`Kemasan ${p.nama}, ${tampil.label} (foto contoh)`}
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="absolute inset-[4%] h-[92%] w-[92%] animate-[muncul_0.4s_ease-out] motion-reduce:animate-none"
                />
              ) : (
                <div className="ubin-dinding absolute inset-0 flex flex-col items-center justify-center p-8">
                  <Olesan slug={p.slug} judul={`Olesan ${p.nama}: ${p.tekstur.rasa}`} className="w-[86%] max-w-xl" />
                  <ol className="mt-6 flex w-full max-w-md justify-between" aria-label="Skala kekentalan">
                    {skalaKental.map((k) => (
                      <li key={k.n} className="flex flex-col items-center gap-1">
                        <span
                          className={`data flex h-8 w-8 items-center justify-center rounded-full text-[0.8rem] ${k.n === p.tekstur.kental ? 'bg-tinta text-kertas' : 'bg-kertas text-tinta-2'}`}
                          aria-current={k.n === p.tekstur.kental ? 'true' : undefined}
                        >
                          {k.n}
                        </span>
                        <span className={`text-center text-[0.75rem] leading-tight ${k.n === p.tekstur.kental ? 'font-semibold text-tinta' : 'text-tinta-3'}`}>{k.nama}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {tampil.jenis === 'varian' && (
                <p className="data absolute left-4 top-4 rounded-full bg-kertas/90 px-2.5 py-1 text-[0.75rem] text-tinta">{tampil.label}</p>
              )}
            </div>
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Gambar produk">
              {galeri.map((it, i) => (
                <li key={`${it.jenis}-${it.id || i}`} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setGambar(i)}
                    aria-pressed={i === gambar}
                    className={`relative block h-20 w-20 overflow-hidden rounded-xl border-2 sm:h-24 sm:w-24 ${i === gambar ? 'border-tinta' : 'border-transparent hover:border-garis-tua'}`}
                    style={{ background: it.jenis === 'tekstur' ? '#edf1ec' : l.muda }}
                  >
                    <span className="sr-only">{it.label}</span>
                    {it.jenis === 'varian' ? (
                      <Kemasan slug={p.slug} varian={it.id} bingkai="pas" className="h-full w-full" />
                    ) : (
                      <Olesan slug={p.slug} className="h-full w-full p-1.5" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Info beli */}
        <div className="lg:col-span-5">
          <p className="data flex items-center gap-2 text-[0.8rem] text-tinta-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: l.warna }} />
            {l.no ? `0${l.no} · ${l.nama} · ${l.jenis}` : `${l.nama} · ${l.jenis}`}
          </p>
          <h1 className="mt-2 text-[2.4rem] leading-[1.04] sm:text-5xl">{p.nama}</h1>
          <p className="mt-3 text-[1.05rem] text-tinta-2">{p.ringkas}</p>

          <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1 border-y border-garis py-4">
            <p className="text-[2rem] font-semibold leading-none tracking-tight">{rupiah(v.harga)}</p>
            <p className="data pb-0.5 text-[0.85rem] text-tinta-2">
              {labelVarian(p, v.id)} · {rupiah(Math.round(v.harga / v.ukuran))}/{v.satuan}
            </p>
          </div>

          {!aktif && (
            <p className="mt-5 rounded-xl border border-awas bg-[#fdf3ef] p-3 text-awas" role="status">
              Produk ini sedang tidak dijual. Penjual menonaktifkannya dari dasbor demo.
            </p>
          )}

          <fieldset className="mt-6">
            <legend className="font-semibold">Ukuran dan kemasan</legend>
            <div className="mt-3 grid gap-2">
              {p.varian.map((x) => {
                const s = stokVarian(p, x.id, inv);
                const habis = s <= 0;
                return (
                  <label key={x.id} className="pilihan flex items-center gap-3 p-3">
                    <input type="radio" name={`varian-${p.slug}`} value={x.id} checked={v.id === x.id} disabled={habis} onChange={() => pilihVarian(x.id)} className="sr-only" />
                    <span className="block h-12 w-10 shrink-0">
                      <Kemasan slug={p.slug} varian={x.id} bingkai="pas" className="h-full w-full" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-tinta">
                        {x.jumlahIsi ? `${x.jumlahIsi} × ${angkaId(x.ukuran / x.jumlahIsi)} ${x.satuan}` : `${angkaId(x.ukuran)} ${x.satuan}`}
                        {x.isiUlang && <span className="data ms-2 rounded-full bg-kunyit-muda px-2 py-0.5 text-[0.75rem] text-kunyit-tua">isi ulang</span>}
                      </span>
                      <span className="block text-[0.85rem] text-tinta-2">
                        {namaWadah(x)} · {rupiah(Math.round(x.harga / x.ukuran))}/{x.satuan}
                      </span>
                    </span>
                    <span className="text-end">
                      <span className="block text-[0.95rem] font-semibold text-tinta">{rupiah(x.harga)}</span>
                      <span className={`data block text-[0.75rem] ${habis || s <= 5 ? 'text-awas' : 'text-tinta-3'}`}>{habis ? 'Habis' : s <= 5 ? `Sisa ${s}` : `Stok ${s}`}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {hemat && (
              <p className="mt-2 text-[0.88rem] text-tinta-2">
                Isi ulang {hemat.ulang.ukuran} {hemat.ulang.satuan} {hemat.persen}% lebih murah per {hemat.ulang.satuan} dibanding botol.{' '}
                {hemat.ulang.kemasan === 'kantong' ? 'Tuang ke botol lamamu.' : 'Pasang di jar lamamu.'}{' '}
                <Link href="/isi-ulang" className="tautan">
                  Caranya
                </Link>
              </p>
            )}
          </fieldset>

          <div className="mt-6">
            <p className={`text-[0.95rem] font-medium ${stok <= 5 ? 'text-awas' : 'text-aman'}`}>
              {statusStok}
              {diKeranjang > 0 && <span className="font-normal text-tinta-2"> · {diKeranjang} sudah di keranjangmu</span>}
            </p>
            <div className="mt-3 flex flex-wrap items-stretch gap-3">
              <div className="flex items-stretch rounded-full border-[1.5px] border-garis-tua bg-kertas" role="group" aria-label="Jumlah">
                <button type="button" className="w-11 rounded-s-full text-xl disabled:text-tinta-3" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qtyAman <= 1 || bisaTambah <= 0} aria-label="Kurangi jumlah">
                  −
                </button>
                <label htmlFor={`qty-${p.slug}`} className="sr-only">
                  Jumlah
                </label>
                <input
                  id={`qty-${p.slug}`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={Math.max(1, bisaTambah)}
                  value={qtyAman}
                  onChange={(e) => setQty(Number(e.target.value) || 1)}
                  disabled={bisaTambah <= 0 || !aktif}
                  className="w-10 bg-transparent text-center font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button type="button" className="w-11 rounded-e-full text-xl disabled:text-tinta-3" onClick={() => setQty((q) => Math.min(bisaTambah, q + 1))} disabled={qtyAman >= bisaTambah} aria-label="Tambah jumlah">
                  +
                </button>
              </div>
              <button ref={tombolRef} type="button" className="tombol tombol-utama flex-1 px-6" onClick={tambah} disabled={!aktif || bisaTambah <= 0}>
                {!aktif ? 'Tidak dijual' : stok <= 0 ? 'Habis' : bisaTambah <= 0 ? 'Semua stok ada di keranjang' : 'Masukkan keranjang'}
              </button>
            </div>
            <div role="status" aria-live="polite" className="min-h-[1.25rem]">
              {pesan && (
                <p className={`mt-3 rounded-xl p-3 text-[0.95rem] ${pesan.ok ? 'bg-daun-muda text-tinta' : 'bg-[#fdf3ef] text-awas'}`}>
                  {pesan.teks}{' '}
                  {pesan.ok && (
                    <Link href="/keranjang" className="tautan font-semibold">
                      Lihat keranjang
                    </Link>
                  )}
                </p>
              )}
            </div>
            {bolehRutin && (
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                <button type="button" className="tombol tombol-garis min-h-11 py-2" onClick={keRutinitas}>
                  {diRutinitas.length ? `Ada di rutinitas ${diRutinitas.join(' & ')}` : `Tambah ke rutinitas ${p.waktu.join(' & ')}`}
                </button>
                <Link href="/rutinitas" className="tautan text-[0.95rem]">
                  Buka penyusun rutinitas
                </Link>
                <p role="status" aria-live="polite" className="w-full text-[0.9rem] text-tinta-2">
                  {pesanRutin}
                </p>
              </div>
            )}
          </div>

          <dl className="mt-6 grid rounded-[14px] border border-garis bg-kertas px-4 py-2 sm:grid-cols-2 sm:gap-4 sm:p-5">
            <Fakta label="Bahan aktif">
              {p.aktif.map((a) => (
                <span key={a.bahan} className="block">
                  {cariBahan(a.bahan)?.nama}
                  {a.kadar && <span className="data ms-1.5 text-[0.9rem]">{a.kadar}</span>}
                </span>
              ))}
            </Fakta>
            <Fakta label="Takaran">
              <Takaran takaran={p.takaran} />
            </Fakta>
            <Fakta label="Waktu pakai">{p.frekuensi}</Fakta>
            <Fakta label="pH dan batas setelah dibuka">
              <span className="data">
                {p.ph ? `pH ${p.ph}` : 'Tanpa air'} · {p.pao} bulan
              </span>
            </Fakta>
          </dl>

          <div className="mt-8 grid gap-8">
            <section aria-labelledby="judul-tentang">
              <h2 id="judul-tentang" className="font-sans text-lg font-semibold tracking-normal">
                Tentang produk ini
              </h2>
              <p className="mt-2 text-tinta-2">{p.deskripsi}</p>
              <p className="mt-2 text-[0.92rem] text-tinta-2">Cocok untuk kulit {cocok.length === 4 ? 'semua jenis' : cocok.join(', ')}.{p.ramahPeka ? ' Ramah untuk kulit peka.' : ''}</p>
            </section>

            <section aria-labelledby="judul-pakai">
              <h2 id="judul-pakai" className="font-sans text-lg font-semibold tracking-normal">
                Cara pakai
              </h2>
              <ol className="mt-3 grid gap-2.5">
                {p.caraPakai.map((t, i) => (
                  <li key={t} className="flex gap-3 text-tinta-2">
                    <span aria-hidden="true" className="data flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kabut text-[0.75rem] text-tinta">
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
              {p.perhatian.length > 0 && (
                <div className="mt-4 rounded-xl border-s-4 border-kunyit bg-kunyit-muda/50 p-4">
                  <p className="font-semibold">Perlu diperhatikan</p>
                  <ul className="mt-1.5 grid gap-1.5 text-[0.95rem] text-tinta-2">
                    {p.perhatian.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {p.takaran.ml && p.kaliSeminggu && (
              <section aria-labelledby="judul-habis">
                <h2 id="judul-habis" className="font-sans text-lg font-semibold tracking-normal">
                  Kapan isinya habis
                </h2>
                <div className="mt-3 rounded-[14px] border border-garis bg-kertas p-4 sm:p-5">
                  <label htmlFor={`frek-${p.slug}`} className="text-[0.9rem] font-medium">
                    Kalau dipakai
                  </label>
                  <select id={`frek-${p.slug}`} className="isian mt-1" value={frek} onChange={(e) => setFrek(e.target.value)}>
                    {opsi.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id === 'saran' ? `Sesuai saran (${p.frekuensi.toLowerCase()})` : o.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-4" aria-live="polite">
                    <HasilHabis p={p} v={v} kali={kali} />
                  </div>
                </div>
              </section>
            )}

            <section aria-labelledby="judul-tekstur">
              <h2 id="judul-tekstur" className="font-sans text-lg font-semibold tracking-normal">
                Tekstur dan aroma
              </h2>
              <p className="mt-2 text-tinta-2">
                {p.tekstur.rasa} {p.aroma}
              </p>
            </section>

            <section aria-labelledby="judul-kandungan">
              <h2 id="judul-kandungan" className="font-sans text-lg font-semibold tracking-normal">
                Kandungan lengkap
              </h2>
              <p className="mt-1 text-[0.9rem] text-tinta-3">Urut dari kadar terbesar. Ketuk nama bahan untuk membaca fungsinya di kamus.</p>
              <ol className="mt-3 flex flex-wrap gap-x-1 gap-y-1.5">
                {p.inci.map((n, i) => {
                  const b = bahanDariInci(n);
                  const utama = p.aktif.some((a) => a.bahan === b?.id);
                  return (
                    <li key={n} className="data text-[0.88rem]">
                      <Link
                        href={`/kandungan#${b.id}`}
                        title={b.fungsi.map((f) => daftarFungsi[f].nama).join(', ')}
                        className={`underline decoration-garis-tua underline-offset-[5px] hover:decoration-tinta ${utama ? 'font-medium text-tinta decoration-kunyit-tua decoration-2' : 'text-tinta-2'}`}
                      >
                        {n}
                      </Link>
                      {i < p.inci.length - 1 && <span aria-hidden="true">, </span>}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 rounded-xl bg-kabut p-3.5 text-[0.88rem] text-tinta-2">
                Di toko sungguhan, nomor notifikasi BPOM tercantum di sini dan di kemasan. {site.nama} toko fiktif, jadi tidak ada nomor yang bisa
                dicek, dan formula ini tidak pernah dibuat atau diuji.
              </p>
            </section>

            <section aria-labelledby="judul-kirim">
              <h2 id="judul-kirim" className="font-sans text-lg font-semibold tracking-normal">
                Pengiriman
              </h2>
              <p className="mt-2 text-tinta-2">
                Dikirim dari {site.kota}, atau ambil sendiri di toko. Pesanan yang dibayar sebelum {site.batasKemas} dikemas hari itu juga. Berat
                kiriman ukuran ini {gram(v.berat)}, termasuk wadah.{' '}
                <Link href="/bantuan#pengiriman" className="tautan">
                  Contoh tarif
                </Link>
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Bilah beli lengket untuk ponsel */}
      <div
        className={`sticky bottom-0 z-30 mt-10 border-t border-garis-tua bg-kertas/95 py-3 shadow-[0_-8px_20px_-12px_rgba(23,32,28,0.35)] transition-opacity lg:hidden ${
          lengket ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!lengket}
      >
        <div className="wadah flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.85rem] text-tinta-2">{labelVarian(p, v.id)}</p>
            <p className="font-semibold">{rupiah(v.harga)}</p>
          </div>
          <button type="button" className="tombol tombol-utama px-5" onClick={tambah} disabled={!aktif || bisaTambah <= 0} tabIndex={lengket ? 0 : -1}>
            {bisaTambah <= 0 ? 'Habis' : 'Masukkan keranjang'}
          </button>
        </div>
      </div>
    </div>
  );
}
