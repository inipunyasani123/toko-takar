'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import Kemasan from './Kemasan';
import Takaran from './Takaran';
import { produk, langkah, cariProduk, cariLangkah } from '@/lib/data';
import { periksaRutinitas, jadwalMalam, biayaRutinitas, bolehDiWaktu, urutkanRutinitas } from '@/lib/cocok';
import { varianBotol } from '@/lib/katalog';
import { rupiah, rupiahRingkas, durasi, hariPendek, tanggalPendek, kunciHariWIB } from '@/lib/format';
import { useRutinitas, useTerpasang, simpanRutinitas, tambahKeRutinitas, hapusDariRutinitas, kosongkanRutinitas, tambahBanyak } from '@/lib/store';

const LANGKAH_HARIAN = langkah.filter((l) => l.no);

function KolomWaktu({ waktu, daftar, onTambah, onHapus }) {
  const id = useId();
  const malam = waktu === 'malam';
  const terpilih = daftar.map(cariProduk).filter(Boolean);
  return (
    <section aria-labelledby={`${id}-judul`} className={`rounded-[18px] p-4 sm:p-6 ${malam ? 'gelap bg-malam text-[#e6ece8]' : 'border border-garis bg-kertas'}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={`${id}-judul`} className={`text-3xl ${malam ? 'text-kertas' : ''}`}>
          {malam ? 'Malam' : 'Pagi'}
        </h2>
        <p className={`data text-[0.8rem] ${malam ? 'text-[#b7c3bc]' : 'text-tinta-3'}`}>{terpilih.length} produk</p>
      </div>
      <ol className="mt-4 grid gap-3">
        {LANGKAH_HARIAN.filter((l) => !(malam && l.id === 'lindungi')).map((l) => {
          const isi = terpilih.filter((p) => p.langkah === l.id);
          const pilihan = produk.filter((p) => p.langkah === l.id && bolehDiWaktu(p, waktu) && !daftar.includes(p.slug));
          return (
            <li key={l.id} className={`rounded-[14px] border p-3 ${malam ? 'border-malam-3 bg-malam-2' : 'border-garis bg-ubin'}`}>
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: l.warna }} />
                <p className="data text-[0.8rem]">
                  0{l.no} · {l.nama}
                </p>
              </div>
              {isi.length > 0 && (
                <ul className="mt-2 grid gap-2">
                  {isi.map((p) => (
                    <li key={p.slug} className="flex items-center gap-3">
                      <span className="block h-14 w-12 shrink-0 rounded-lg" style={{ background: l.muda }}>
                        <Kemasan slug={p.slug} varian={(varianBotol(p)[0] || p.varian[0]).id} bingkai="pas" className="h-full w-full" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <Link href={`/produk/${p.slug}`} className="block font-medium leading-snug hover:underline">
                          {p.nama}
                        </Link>
                        <span className={`flex flex-wrap items-center gap-x-2 text-[0.82rem] ${malam ? 'text-[#c9d3cd]' : 'text-tinta-2'}`}>
                          <Takaran takaran={p.takaran} />
                          {p.kaliSeminggu && p.kaliSeminggu < 7 && <span>· {p.frekuensi.toLowerCase()}</span>}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onHapus(p.slug)}
                        className={`min-h-10 rounded-full px-3 text-[0.85rem] underline underline-offset-4 ${malam ? 'hover:bg-malam-3' : 'hover:bg-kabut'}`}
                      >
                        Hapus<span className="sr-only"> {p.nama} dari rutinitas {waktu}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {pilihan.length > 0 && (
                <div className="mt-2">
                  <label htmlFor={`${id}-${l.id}`} className="sr-only">
                    Tambah {l.jenis.toLowerCase()} ke rutinitas {waktu}
                  </label>
                  <select
                    id={`${id}-${l.id}`}
                    className={`isian min-h-10 py-1.5 text-[0.92rem] ${malam ? 'border-malam-3 bg-malam text-[#e6ece8]' : ''}`}
                    value=""
                    onChange={(e) => e.target.value && onTambah(e.target.value)}
                  >
                    <option value="">{isi.length ? `+ Tambah ${l.jenis.toLowerCase()} lain` : `+ Pilih ${l.jenis.toLowerCase()}`}</option>
                    {pilihan.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </li>
          );
        })}
        {malam && (
          <li className="rounded-[14px] border border-dashed border-malam-3 p-3">
            <p className="data flex items-center gap-2 text-[0.8rem] text-[#b7c3bc]">
              <span aria-hidden="true" className="h-3 w-3 rounded-full opacity-50" style={{ background: cariLangkah('lindungi').warna }} />
              05 · Lindungi
            </p>
            <p className="mt-1.5 text-[0.88rem] text-[#c9d3cd]">Tabir surya tidak dipakai di malam hari. Langkah terakhirnya pelembap.</p>
          </li>
        )}
      </ol>
    </section>
  );
}

const TINGKAT = {
  penting: { label: 'Penting', kelas: 'border-awas bg-[#fdf3ef]', teks: 'text-awas' },
  saran: { label: 'Saran', kelas: 'border-kunyit bg-kunyit-muda/50', teks: 'text-kunyit-tua' },
  info: { label: 'Catatan', kelas: 'border-air bg-air-muda', teks: 'text-[#245a72]' },
};

export default function Rutinitas() {
  const terpasang = useTerpasang();
  const tersimpan = useRutinitas();
  const [bagian, setBagian] = useState(null); // rutinitas dari tautan bagikan
  const [pesan, setPesan] = useState('');
  const [dariCocok, setDariCocok] = useState(false);
  const [sekarang, setSekarang] = useState(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setDariCocok(sp.get('dari') === 'cocokkan');
    if (sp.has('pagi') || sp.has('malam')) {
      const ambil = (k) => (sp.get(k) || '').split(',').filter((s) => cariProduk(s));
      setBagian({ pagi: urutkanRutinitas(ambil('pagi')), malam: urutkanRutinitas(ambil('malam')) });
    }
    setSekarang(Date.now());
  }, []);

  if (!terpasang || !sekarang) {
    return (
      <div className="wadah pb-24">
        <p className="text-tinta-2" role="status">
          Memuat rutinitas di browser ini…
        </p>
      </div>
    );
  }

  const r = bagian || { pagi: tersimpan.pagi || [], malam: tersimpan.malam || [] };
  const kosong = !r.pagi.length && !r.malam.length;
  const cek = periksaRutinitas(r);
  const jadwal = jadwalMalam(r.malam, sekarang);
  const biaya = biayaRutinitas(r);

  const tambah = (waktu) => (slug) => {
    if (bagian) {
      setBagian({ ...bagian, [waktu]: urutkanRutinitas([...bagian[waktu], slug]) });
      return;
    }
    tambahKeRutinitas(slug, [waktu]);
    setPesan(`${cariProduk(slug).nama} masuk ke rutinitas ${waktu}.`);
  };
  const hapus = (waktu) => (slug) => {
    if (bagian) {
      setBagian({ ...bagian, [waktu]: bagian[waktu].filter((s) => s !== slug) });
      return;
    }
    hapusDariRutinitas(slug, waktu);
    setPesan(`${cariProduk(slug).nama} dihapus dari rutinitas ${waktu}.`);
  };

  const simpanBagian = () => {
    simpanRutinitas(bagian);
    setBagian(null);
    window.history.replaceState(null, '', '/rutinitas');
    setPesan('Rutinitas dari tautan tersimpan di browser ini.');
  };

  const bagikan = async () => {
    const url = `${window.location.origin}/rutinitas?pagi=${r.pagi.join(',')}&malam=${r.malam.join(',')}`;
    try {
      await navigator.clipboard.writeText(url);
      setPesan('Tautan rutinitas tersalin. Siapa pun yang membukanya melihat susunan yang sama.');
    } catch {
      setPesan(`Salin tautan ini: ${url}`);
    }
  };

  const keKeranjang = () => {
    const semua = [...new Set([...r.pagi, ...r.malam])];
    const hasil = tambahBanyak(semua.map((slug) => ({ slug, varian: (varianBotol(cariProduk(slug))[0] || cariProduk(slug).varian[0]).id, qty: 1 })));
    setPesan(hasil.gagal.length ? `${hasil.masuk} produk masuk keranjang. ${hasil.gagal.length} lainnya sudah ada di keranjang atau stoknya habis.` : `${hasil.masuk} produk masuk keranjang.`);
  };

  const hariIni = kunciHariWIB(sekarang);

  return (
    <div className="wadah grid gap-10 pb-20">
      {(dariCocok || bagian) && (
        <div className="rounded-[14px] border border-garis-tua bg-kertas p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <p className="text-[0.95rem]">
            {bagian ? 'Ini rutinitas dari tautan yang dibagikan. Belum tersimpan di browser ini.' : 'Usulan dari halaman Cocokkan sudah tersimpan. Ubah sesukamu.'}
          </p>
          {bagian && (
            <button type="button" className="tombol tombol-utama mt-3 sm:mt-0" onClick={simpanBagian}>
              Simpan sebagai rutinitasku
            </button>
          )}
        </div>
      )}

      {kosong && !bagian && (
        <div className="rounded-[14px] border border-dashed border-garis-tua bg-kertas p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl">Rutinitasmu masih kosong</h2>
          <p className="mt-2 max-w-xl text-tinta-2">
            Pilih produk per langkah di bawah, tambahkan dari halaman produk, atau jawab empat pertanyaan supaya kami usulkan susunan awalnya.
          </p>
          <Link href="/cocokkan" className="tombol tombol-utama mt-5">
            Cocokkan dengan kulitmu
          </Link>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <KolomWaktu waktu="pagi" daftar={r.pagi} onTambah={tambah('pagi')} onHapus={hapus('pagi')} />
        <KolomWaktu waktu="malam" daftar={r.malam} onTambah={tambah('malam')} onHapus={hapus('malam')} />
      </div>
      <p role="status" aria-live="polite" className="-mt-6 min-h-[1.25rem] text-[0.92rem] text-tinta-2">
        {pesan}
      </p>

      {!kosong && (
        <div className="grid gap-10 lg:grid-cols-12">
          <section aria-labelledby="judul-cek" className="lg:col-span-5">
            <h2 id="judul-cek" className="border-t-2 border-tinta pt-4 text-3xl">
              Pemeriksaan
            </h2>
            {cek.length ? (
              <ul className="mt-4 grid gap-2">
                {cek.map((c) => (
                  <li key={c.teks} className={`rounded-xl border-s-4 p-3.5 text-[0.95rem] ${TINGKAT[c.tingkat].kelas}`}>
                    <span className={`font-semibold ${TINGKAT[c.tingkat].teks}`}>{TINGKAT[c.tingkat].label}. </span>
                    {c.teks}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-xl bg-daun-muda p-3.5 text-[0.95rem]">Urutannya rapi dan tidak ada bahan yang bentrok.</p>
            )}
            <p className="mt-4 text-[0.88rem] text-tinta-3">
              Urutan otomatis mengikuti langkah, lalu dari yang paling encer. Tunggu sekitar satu menit di antara serum dan pelembap.
            </p>
          </section>

          <section aria-labelledby="judul-biaya" className="lg:col-span-7">
            <h2 id="judul-biaya" className="border-t-2 border-tinta pt-4 text-3xl">
              Biaya dan kapan habis
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-kabut p-3.5">
                <dt className="text-[0.9rem] text-tinta-3">Beli semua sekali</dt>
                <dd className="text-xl font-semibold">{rupiah(biaya.beli)}</dd>
              </div>
              <div className="rounded-xl bg-kabut p-3.5">
                <dt className="text-[0.9rem] text-tinta-3">Perkiraan per bulan</dt>
                <dd className="text-xl font-semibold">{rupiahRingkas(biaya.perBulan)}</dd>
              </div>
            </dl>
            <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Rincian biaya per produk">
              <table className="w-full min-w-[30rem] border-collapse text-left text-[0.9rem]">
                <thead>
                  <tr className="border-b border-tinta">
                    <th scope="col" className="py-2 pe-3 font-semibold">Produk</th>
                    <th scope="col" className="py-2 pe-3 text-end font-semibold">Pemakaian</th>
                    <th scope="col" className="py-2 pe-3 text-end font-semibold">Habis</th>
                    <th scope="col" className="py-2 text-end font-semibold">Per bulan</th>
                  </tr>
                </thead>
                <tbody>
                  {biaya.rinci.map((x) => (
                    <tr key={x.p.slug} className="border-b border-garis">
                      <th scope="row" className="py-2.5 pe-3 font-normal">
                        {x.p.nama}
                        <span className="data block text-[0.75rem] text-tinta-3">
                          {x.v.ukuran} {x.v.satuan} · {rupiah(x.v.harga)}
                        </span>
                      </th>
                      <td className="data py-2.5 pe-3 text-end">{x.kali}×/minggu</td>
                      <td className={`data py-2.5 pe-3 text-end ${x.hari && x.hari > x.p.pao * 30.4 ? 'text-awas' : ''}`}>{x.hari ? durasi(x.hari) : '–'}</td>
                      <td className="data py-2.5 text-end">{x.perBulan ? rupiahRingkas(x.perBulan) : '–'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[0.85rem] text-tinta-3">Dihitung dari botol terkecil dan takaran yang disarankan. Angka merah: lebih lama dari batas setelah dibuka.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="tombol tombol-utama" onClick={keKeranjang}>
                Masukkan semua ke keranjang
              </button>
              <button type="button" className="tombol tombol-garis" onClick={bagikan}>
                Salin tautan rutinitas
              </button>
              {!bagian && (
                <button
                  type="button"
                  className="tautan min-h-11 px-2 font-medium"
                  onClick={() => {
                    kosongkanRutinitas();
                    setPesan('Rutinitas dikosongkan.');
                  }}
                >
                  Kosongkan
                </button>
              )}
            </div>
          </section>
        </div>
      )}

      {jadwal && (
        <section aria-labelledby="judul-jadwal">
          <h2 id="judul-jadwal" className="border-t-2 border-tinta pt-4 text-3xl sm:text-4xl">
            Jadwal 7 malam
          </h2>
          <p className="mt-2 max-w-2xl text-tinta-2">
            Bahan kuat dipakai bergantian, diselingi malam pemulihan dengan pelembap saja. Ini jadwal awal yang umum dipakai; kurangi bila kulit
            terasa perih.
          </p>
          <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {jadwal.map((h) => {
              const p = h.slug ? cariProduk(h.slug) : null;
              const l = p ? cariLangkah(p.langkah) : null;
              const ini = kunciHariWIB(h.ms) === hariIni;
              return (
                <li key={h.ms} className={`rounded-[14px] p-3 ${p ? 'gelap bg-malam text-[#e6ece8]' : 'border border-garis bg-kertas'}`} aria-current={ini ? 'date' : undefined}>
                  <p className={`data text-[0.78rem] ${p ? 'text-kunyit' : 'text-tinta-3'}`}>
                    {ini ? 'Malam ini' : hariPendek(h.ms)} · {tanggalPendek(h.ms)}
                  </p>
                  {p ? (
                    <>
                      <p className="mt-2 flex items-center gap-1.5 font-medium text-kertas">
                        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: l.warna }} />
                        {p.label.nama.join(' ')} {p.label.angka}
                      </p>
                      <p className="text-[0.82rem] text-[#c9d3cd]">lalu pelembap</p>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 font-medium">Pemulihan</p>
                      <p className="text-[0.82rem] text-tinta-2">serum ringan dan pelembap</p>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}
