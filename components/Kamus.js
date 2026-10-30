'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { kandungan, fungsi, asal } from '@/lib/kandungan';
import { produk } from '@/lib/data';

function normal(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

const URUT = [...kandungan].sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
const DI_PRODUK = Object.fromEntries(kandungan.map((k) => [k.id, produk.filter((p) => p.inci.some((n) => k.inci.includes(n)))]));
const HITUNG_FUNGSI = Object.fromEntries(Object.keys(fungsi).map((f) => [f, kandungan.filter((k) => k.fungsi.includes(f)).length]));

export default function Kamus() {
  const [q, setQ] = useState('');
  const [f, setF] = useState('');
  const kata = normal(q).split(/\s+/).filter(Boolean);
  const tampil = useMemo(
    () =>
      URUT.filter((k) => {
        if (f && !k.fungsi.includes(f)) return false;
        if (!kata.length) return true;
        const teks = normal([k.nama, ...k.inci, k.ringkas, ...k.fungsi.map((x) => fungsi[x].nama)].join(' '));
        return kata.every((w) => teks.includes(w));
      }),
    [f, kata.join(' ')], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const huruf = [...new Set(tampil.map((k) => k.nama[0].toUpperCase()))];

  // Entri yang ditaut lewat #id (dari halaman produk) dibuka otomatis.
  useEffect(() => {
    const buka = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const el = id && document.getElementById(id);
      if (el && el.tagName === 'DETAILS') {
        el.open = true;
        el.scrollIntoView({ block: 'start' });
      }
    };
    buka();
    window.addEventListener('hashchange', buka);
    return () => window.removeEventListener('hashchange', buka);
  }, []);

  return (
    <div className="wadah grid gap-10 pb-20 lg:grid-cols-12">
      <aside aria-label="Saring kamus" className="lg:sticky lg:top-28 lg:col-span-4 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:pe-2">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="border-t-2 border-tinta pt-4">
          <label htmlFor="cari-bahan" className="font-semibold">
            Cari bahan
          </label>
          <input id="cari-bahan" type="search" className="isian mt-2" placeholder="nama Indonesia atau INCI" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
        </form>
        <fieldset className="mt-6 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Fungsi</legend>
          <ul className="clear-both flex flex-wrap gap-1.5 pt-3">
            {[['', { nama: 'Semua' }], ...Object.entries(fungsi)].map(([id, x]) => (
              <li key={id || 'semua'}>
                <label className="pilihan flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[0.88rem]">
                  <input type="radio" name="fungsi" className="sr-only" checked={f === id} onChange={() => setF(id)} />
                  {x.nama}
                  <span className="data text-[0.75rem] text-tinta-3">{id ? HITUNG_FUNGSI[id] : kandungan.length}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        {f && <p className="mt-4 rounded-xl bg-kabut p-3 text-[0.9rem] text-tinta-2">{fungsi[f].arti}</p>}
      </aside>

      <div className="lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-tinta pt-4">
          <p aria-live="polite" className="font-medium">
            {tampil.length === kandungan.length ? `${kandungan.length} bahan` : `${tampil.length} dari ${kandungan.length} bahan`}
          </p>
          {huruf.length > 1 && (
            <nav aria-label="Lompat ke huruf">
              <ul className="flex flex-wrap gap-0.5">
                {huruf.map((h) => (
                  <li key={h}>
                    <a href={`#huruf-${h}`} className="data flex h-8 min-w-8 items-center justify-center rounded-md text-[0.85rem] hover:bg-kabut">
                      {h}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {tampil.length === 0 && (
          <p className="mt-6 rounded-[14px] border border-dashed border-garis-tua bg-kertas p-6 text-tinta-2">
            Tidak ada bahan yang cocok. Coba nama INCI-nya, misalnya &ldquo;Niacinamide&rdquo;.
          </p>
        )}

        <div className="mt-2">
          {huruf.map((h) => (
            <section key={h} aria-labelledby={`huruf-${h}`} className="scroll-mt-28">
              <h2 id={`huruf-${h}`} className="data mt-6 border-b border-garis pb-1 text-[1rem] font-medium text-kunyit-tua">
                {h}
              </h2>
              <ul>
                {tampil
                  .filter((k) => k.nama[0].toUpperCase() === h)
                  .map((k) => (
                    <li key={k.id} className="border-b border-garis">
                      <details id={k.id} className="group scroll-mt-28 target:bg-kunyit-muda/40 open:pb-5">
                        <summary className="flex cursor-pointer list-none items-start gap-3 py-3.5 [&::-webkit-details-marker]:hidden">
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                              <h3 className="font-display text-[1.35rem] leading-tight">{k.nama}</h3>
                              <span className="flex flex-wrap gap-1">
                                {k.fungsi.map((x) => (
                                  <span key={x} className="data rounded-full bg-kabut px-2 py-0.5 text-[0.75rem] text-tinta-2">
                                    {fungsi[x].nama}
                                  </span>
                                ))}
                              </span>
                            </span>
                            <span className="data mt-1 block text-[0.8rem] text-tinta-3">{k.inci.join(' · ')}</span>
                            <span className="mt-1 hidden text-[0.92rem] text-tinta-2 group-open:hidden sm:line-clamp-1">{k.ringkas}</span>
                          </span>
                          <span aria-hidden="true" className="data mt-1 text-lg leading-none text-kunyit-tua transition-transform group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <div className={`grid gap-4 ${k.foto ? 'sm:grid-cols-[1fr_9rem]' : ''}`}>
                          <div>
                            <p className="text-tinta-2">{k.ringkas}</p>
                            <dl className="mt-2 grid gap-x-6 gap-y-1 text-[0.9rem] sm:grid-cols-2">
                              <div>
                                <dt className="inline text-tinta-3">Asal: </dt>
                                <dd className="inline">{asal[k.asal]}</dd>
                              </div>
                              {k.kadar && (
                                <div>
                                  <dt className="inline text-tinta-3">Kadar umum: </dt>
                                  <dd className="inline">{k.kadar}</dd>
                                </div>
                              )}
                            </dl>
                            {k.catatan?.length > 0 && (
                              <ul className="mt-3 grid gap-1.5">
                                {k.catatan.map((c) => (
                                  <li key={c} className="border-s-2 border-kunyit ps-3 text-[0.92rem] text-tinta-2">
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            )}
                            <p className="mt-3 text-[0.9rem]">
                              <span className="text-tinta-3">Ada di: </span>
                              {DI_PRODUK[k.id].map((p, i) => (
                                <span key={p.slug}>
                                  <Link href={`/produk/${p.slug}`} className="tautan">
                                    {p.nama}
                                  </Link>
                                  {i < DI_PRODUK[k.id].length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </p>
                          </div>
                          {k.foto && (
                            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-kabut sm:aspect-square">
                              <Image src={k.foto.src} alt={k.foto.alt} fill sizes="(min-width: 640px) 144px, 100vw" className="object-cover" />
                            </div>
                          )}
                        </div>
                      </details>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
