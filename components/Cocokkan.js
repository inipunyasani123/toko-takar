'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Kemasan from './Kemasan';
import { jenisKulit, tujuan, cariProduk, cariLangkah, cariKulit } from '@/lib/data';
import { usulRutinitas, skorProduk, hasilCocok, biayaRutinitas } from '@/lib/cocok';
import { varianBotol } from '@/lib/katalog';
import { rupiah, rupiahRingkas } from '@/lib/format';
import { simpanRutinitas, tambahBanyak } from '@/lib/store';

const PEKA = [
  { id: 'sering', nama: 'Sering', ket: 'Hampir tiap mencoba produk baru' },
  { id: 'kadang', nama: 'Kadang-kadang', ket: 'Dengan produk tertentu saja' },
  { id: 'jarang', nama: 'Jarang', ket: 'Hampir tidak pernah' },
];

const CIRI_KULIT = {
  kering: 'Kencang atau bersisik',
  normal: 'Nyaman saja',
  kombinasi: 'Mengilap di dahi, hidung, dan dagu',
  berminyak: 'Mengilap hampir di seluruh wajah',
};

function Baris({ slug, j, no }) {
  const p = cariProduk(slug);
  const l = cariLangkah(p.langkah);
  const s = skorProduk(p, j);
  const v = varianBotol(p)[0] || p.varian[0];
  return (
    <li className="grid grid-cols-[3.25rem_1fr] gap-3 border-b border-current/10 py-3 last:border-0">
      <span className="block h-16 w-[3.25rem] rounded-lg" style={{ background: l.muda }}>
        <Kemasan slug={slug} varian={v.id} bingkai="pas" className="h-full w-full" />
      </span>
      <span className="min-w-0">
        <span className="data block text-[0.75rem] opacity-80">
          {String(no).padStart(2, '0')} · {l.nama}
        </span>
        <Link href={`/produk/${slug}`} className="block font-medium leading-snug hover:underline">
          {p.nama}
        </Link>
        {s.alasan.length > 0 && <span className="block text-[0.82rem] opacity-80">{s.alasan.slice(0, 2).join(', ').replace(/^./, (c) => c.toUpperCase())}</span>}
        {s.catatan[0] && <span className="mt-1 block text-[0.82rem] opacity-90">{s.catatan[0]}</span>}
      </span>
    </li>
  );
}

export default function Cocokkan() {
  const router = useRouter();
  const [kulit, setKulit] = useState('');
  const [peka, setPeka] = useState('');
  const [tj, setTj] = useState([]);
  const [ringkas, setRingkas] = useState(false);
  const [pesan, setPesan] = useState('');

  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get('kulit');
    if (k && jenisKulit.some((x) => x.id === k)) setKulit(k);
  }, []);

  const balikTujuan = (id) => setTj((x) => (x.includes(id) ? x.filter((y) => y !== id) : x.length >= 2 ? x : [...x, id]));
  const j = { kulit, peka, tujuan: tj, ringkas };
  const siap = Boolean(kulit);
  const usul = siap ? usulRutinitas(j) : null;
  const biaya = usul ? biayaRutinitas(usul) : null;
  const lain = siap
    ? hasilCocok(j)
        .filter((x) => !usul.pagi.includes(x.p.slug) && !usul.malam.includes(x.p.slug) && !usul.ditunda.includes(x.p.slug) && x.nilai > 0)
        .slice(0, 4)
    : [];

  const simpan = () => {
    simpanRutinitas({ pagi: usul.pagi, malam: usul.malam });
    router.push('/rutinitas?dari=cocokkan');
  };

  const keKeranjang = () => {
    const semua = [...new Set([...usul.pagi, ...usul.malam])];
    const r = tambahBanyak(semua.map((slug) => ({ slug, varian: (varianBotol(cariProduk(slug))[0] || cariProduk(slug).varian[0]).id, qty: 1 })));
    setPesan(r.gagal.length ? `${r.masuk} produk masuk keranjang. ${r.gagal.length} lainnya sudah ada di keranjang atau stoknya habis.` : `${r.masuk} produk masuk keranjang.`);
  };

  return (
    <div className="wadah grid gap-10 pb-20 lg:grid-cols-12">
      <form className="grid content-start gap-9 lg:col-span-6" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className="font-display text-[1.6rem] leading-snug sm:text-3xl">
            <span className="data me-2 text-[1rem] text-kunyit-tua">01</span>
            Dua jam setelah cuci muka tanpa memakai apa pun, kulitmu terasa…
          </legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {jenisKulit.map((k) => (
              <label key={k.id} className="pilihan flex items-start gap-3 p-3.5">
                <input type="radio" name="kulit" value={k.id} checked={kulit === k.id} onChange={() => setKulit(k.id)} className="mt-1 h-[1.25rem] w-[1.25rem] shrink-0 accent-[#17201c]" />
                <span>
                  <span className="block font-medium">{CIRI_KULIT[k.id]}</span>
                  <span className="block text-[0.85rem] text-tinta-3">Kulit {k.nama.toLowerCase()}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-[1.6rem] leading-snug sm:text-3xl">
            <span className="data me-2 text-[1rem] text-kunyit-tua">02</span>
            Seberapa sering kulitmu perih, gatal, atau memerah saat mencoba produk baru?
          </legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {PEKA.map((x) => (
              <label key={x.id} className="pilihan flex items-start gap-3 p-3.5">
                <input type="radio" name="peka" value={x.id} checked={peka === x.id} onChange={() => setPeka(x.id)} className="mt-1 h-[1.25rem] w-[1.25rem] shrink-0 accent-[#17201c]" />
                <span>
                  <span className="block font-medium">{x.nama}</span>
                  <span className="block text-[0.85rem] text-tinta-3">{x.ket}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-[1.6rem] leading-snug sm:text-3xl">
            <span className="data me-2 text-[1rem] text-kunyit-tua">03</span>
            Apa yang paling ingin kamu rawat?
          </legend>
          <p className="mt-2 text-[0.9rem] text-tinta-3" id="petunjuk-tujuan">
            Pilih paling banyak dua. Boleh dikosongkan.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {tujuan.map((t) => {
              const dipilih = tj.includes(t.id);
              return (
                <label key={t.id} className="pilihan flex min-h-12 items-center gap-2.5 px-3 py-2 text-[0.95rem] leading-snug">
                  <input
                    type="checkbox"
                    checked={dipilih}
                    disabled={!dipilih && tj.length >= 2}
                    onChange={() => balikTujuan(t.id)}
                    aria-describedby="petunjuk-tujuan"
                    className="h-[1.25rem] w-[1.25rem] shrink-0 accent-[#17201c]"
                  />
                  {t.nama}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-[1.6rem] leading-snug sm:text-3xl">
            <span className="data me-2 text-[1rem] text-kunyit-tua">04</span>
            Berapa langkah yang sanggup kamu jalani?
          </legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { id: false, nama: 'Lengkap', ket: 'Lima langkah pagi, lima malam' },
              { id: true, nama: 'Ringkas', ket: 'Tiga sampai empat langkah' },
            ].map((x) => (
              <label key={x.nama} className="pilihan flex items-start gap-3 p-3.5">
                <input type="radio" name="ringkas" checked={ringkas === x.id} onChange={() => setRingkas(x.id)} className="mt-1 h-[1.25rem] w-[1.25rem] shrink-0 accent-[#17201c]" />
                <span>
                  <span className="block font-medium">{x.nama}</span>
                  <span className="block text-[0.85rem] text-tinta-3">{x.ket}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <section aria-labelledby="judul-hasil" className="lg:col-span-6">
        <div className="lg:sticky lg:top-28">
          <h2 id="judul-hasil" className="border-t-2 border-tinta pt-4 text-3xl sm:text-4xl">
            Rutinitas usulan
          </h2>
          <div aria-live="polite">
            {!siap ? (
              <div className="mt-5 overflow-hidden rounded-[18px] border border-garis">
                <div className="ubin-dinding relative flex items-end justify-center gap-1 px-6 pt-6">
                  {['gel-pembersih-pegagan', 'serum-hialuronat-2', 'krim-ceramide', 'tabir-surya-spf50'].map((s) => (
                    <Kemasan key={s} slug={s} varian={cariProduk(s).varian[0].id} bingkai="rak-dekat" className="-mb-[2%] w-[22%] opacity-60 grayscale-[35%]" />
                  ))}
                  <div aria-hidden="true" className="pita absolute inset-x-0 bottom-0 h-[12px]" />
                </div>
                <p className="bg-kertas p-5 text-tinta-2">Jawab pertanyaan pertama dulu. Usulan pagi dan malam muncul di sini, lengkap dengan alasannya.</p>
              </div>
            ) : (
              <>
                <p className="mt-2 text-[0.95rem] text-tinta-2">
                  Untuk kulit {cariKulit(kulit).nama.toLowerCase()}
                  {peka === 'sering' ? ' yang mudah bereaksi' : ''}
                  {tj.length ? `, fokus ${tj.map((t) => tujuan.find((x) => x.id === t).nama.toLowerCase()).join(' dan ')}` : ''}.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[14px] border border-garis bg-kertas p-4">
                    <h3 className="font-sans text-[1rem] font-semibold tracking-normal">Pagi</h3>
                    <ol className="mt-1">
                      {usul.pagi.map((s, i) => (
                        <Baris key={s} slug={s} j={j} no={i + 1} />
                      ))}
                    </ol>
                  </div>
                  <div className="gelap rounded-[14px] bg-malam p-4 text-[#e6ece8]">
                    <h3 className="font-sans text-[1rem] font-semibold tracking-normal text-kertas">Malam</h3>
                    <ol className="mt-1">
                      {usul.malam.map((s, i) => (
                        <Baris key={s} slug={s} j={j} no={i + 1} />
                      ))}
                    </ol>
                  </div>
                </div>
                {usul.ditunda.length > 0 && (
                  <p className="mt-3 rounded-xl border-s-4 border-kunyit bg-kunyit-muda/50 p-3.5 text-[0.92rem]">
                    <span className="font-semibold">Ditunda dulu: </span>
                    {usul.ditunda.map((s) => cariProduk(s).nama).join(', ')}. Bahan kuat sebaiknya dicoba setelah rutinitas dasarmu nyaman selama dua
                    sampai empat minggu, satu per satu, dengan uji tempel.
                  </p>
                )}
                <dl className="mt-4 grid grid-cols-2 gap-3 text-[0.92rem]">
                  <div className="rounded-xl bg-kabut p-3">
                    <dt className="text-tinta-3">Beli semua sekali</dt>
                    <dd className="text-lg font-semibold">{rupiah(biaya.beli)}</dd>
                  </div>
                  <div className="rounded-xl bg-kabut p-3">
                    <dt className="text-tinta-3">Perkiraan per bulan</dt>
                    <dd className="text-lg font-semibold">{rupiahRingkas(biaya.perBulan)}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" className="tombol tombol-utama" onClick={simpan}>
                    Buka di penyusun rutinitas
                  </button>
                  <button type="button" className="tombol tombol-garis" onClick={keKeranjang}>
                    Masukkan semua ke keranjang
                  </button>
                </div>
                <p role="status" className="mt-2 min-h-[1.25rem] text-[0.92rem] text-tinta-2">
                  {pesan}{' '}
                  {pesan && (
                    <Link href="/keranjang" className="tautan">
                      Lihat keranjang
                    </Link>
                  )}
                </p>
                {lain.length > 0 && (
                  <div className="mt-4 border-t border-garis pt-4">
                    <h3 className="font-sans text-[1rem] font-semibold tracking-normal">Juga cocok, untuk nanti</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {lain.map(({ p }) => (
                        <li key={p.slug}>
                          <Link href={`/produk/${p.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-garis-tua bg-kertas px-3.5 text-[0.9rem] hover:border-tinta">
                            {p.nama}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
