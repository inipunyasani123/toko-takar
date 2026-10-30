'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import KartuProduk from './KartuProduk';
import { produk, langkah, jenisKulit, tujuan } from '@/lib/data';
import { saringProduk, rentangFilter, urutan, produkAktif } from '@/lib/katalog';
import { useInventaris, useTerpasang } from '@/lib/store';

function bacaFilter(sp) {
  const daftar = (k) => (sp.get(k) || '').split(',').map((x) => x.trim()).filter(Boolean);
  return {
    q: sp.get('q') || '',
    langkah: daftar('langkah').filter((x) => langkah.some((l) => l.id === x)),
    kulit: jenisKulit.some((k) => k.id === sp.get('kulit')) ? sp.get('kulit') : '',
    tujuan: daftar('tujuan').filter((x) => tujuan.some((t) => t.id === x)),
    waktu: ['pagi', 'malam'].includes(sp.get('waktu')) ? sp.get('waktu') : '',
    isiUlang: sp.get('isi-ulang') === '1',
    peka: sp.get('peka') === '1',
    harga: rentangFilter.some((r) => r.id === sp.get('harga')) ? sp.get('harga') : '',
    urut: urutan.some((u) => u.id === sp.get('urut')) ? sp.get('urut') : 'langkah',
  };
}

function keQuery(f) {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q);
  if (f.langkah.length) p.set('langkah', f.langkah.join(','));
  if (f.kulit) p.set('kulit', f.kulit);
  if (f.tujuan.length) p.set('tujuan', f.tujuan.join(','));
  if (f.waktu) p.set('waktu', f.waktu);
  if (f.isiUlang) p.set('isi-ulang', '1');
  if (f.peka) p.set('peka', '1');
  if (f.harga) p.set('harga', f.harga);
  if (f.urut && f.urut !== 'langkah') p.set('urut', f.urut);
  const s = p.toString();
  return s ? `?${s}` : '';
}

export function GridStatis() {
  return (
    <div className="wadah pb-20">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {produk.map((p) => (
          <li key={p.slug}>
            <KartuProduk produk={p} judulTag="h2" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Kotak({ checked, onChange, children, jumlah }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg py-1 hover:bg-kabut/70">
      <input type="checkbox" className="h-[1.1rem] w-[1.1rem] accent-[#17201c]" checked={checked} onChange={onChange} />
      <span className="flex-1">{children}</span>
      {jumlah !== undefined && <span className="data text-[0.75rem] text-tinta-3">{jumlah}</span>}
    </label>
  );
}

function Bulat({ name, checked, onChange, children }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg py-1 hover:bg-kabut/70">
      <input type="radio" name={name} className="h-[1.1rem] w-[1.1rem] accent-[#17201c]" checked={checked} onChange={onChange} />
      <span>{children}</span>
    </label>
  );
}

export default function Katalog() {
  const sp = useSearchParams();
  const path = usePathname();
  const inventaris = useInventaris();
  const terpasang = useTerpasang();
  const [filter, setFilter] = useState(() => bacaFilter(sp));
  const [panel, setPanel] = useState(false);
  const idPanel = useId();

  // Sinkron bila URL berubah dari luar (tautan, tombol kembali).
  const kunciSp = sp.toString();
  useEffect(() => {
    setFilter(bacaFilter(new URLSearchParams(kunciSp)));
  }, [kunciSp]);

  const ubah = (patch) => {
    const baru = { ...filter, ...patch };
    setFilter(baru);
    window.history.replaceState(null, '', `${path}${keQuery(baru)}`);
  };

  const balik = (kunci, id) => {
    const ada = filter[kunci].includes(id);
    ubah({ [kunci]: ada ? filter[kunci].filter((x) => x !== id) : [...filter[kunci], id] });
  };

  const inv = terpasang ? inventaris : undefined;
  const hasil = useMemo(() => saringProduk(produk, filter, inv), [filter, inv]);
  const aktifSemua = produk.filter((p) => produkAktif(p, inv));
  const jumlahFilter =
    filter.langkah.length + filter.tujuan.length + (filter.kulit ? 1 : 0) + (filter.waktu ? 1 : 0) + (filter.isiUlang ? 1 : 0) + (filter.peka ? 1 : 0) + (filter.harga ? 1 : 0) + (filter.q.trim() ? 1 : 0);

  const chip = [
    ...(filter.q.trim() ? [{ label: `“${filter.q.trim()}”`, hapus: () => ubah({ q: '' }) }] : []),
    ...filter.langkah.map((id) => ({ label: langkah.find((l) => l.id === id).jenis, hapus: () => balik('langkah', id) })),
    ...(filter.kulit ? [{ label: `Kulit ${jenisKulit.find((k) => k.id === filter.kulit).nama.toLowerCase()}`, hapus: () => ubah({ kulit: '' }) }] : []),
    ...filter.tujuan.map((id) => ({ label: tujuan.find((t) => t.id === id).nama, hapus: () => balik('tujuan', id) })),
    ...(filter.waktu ? [{ label: filter.waktu === 'pagi' ? 'Dipakai pagi' : 'Dipakai malam', hapus: () => ubah({ waktu: '' }) }] : []),
    ...(filter.isiUlang ? [{ label: 'Ada isi ulang', hapus: () => ubah({ isiUlang: false }) }] : []),
    ...(filter.peka ? [{ label: 'Ramah kulit peka', hapus: () => ubah({ peka: false }) }] : []),
    ...(filter.harga ? [{ label: rentangFilter.find((r) => r.id === filter.harga).label, hapus: () => ubah({ harga: '' }) }] : []),
  ];

  const kosongkan = () => ubah({ q: '', langkah: [], kulit: '', tujuan: [], waktu: '', isiUlang: false, peka: false, harga: '' });

  const pilihUrut = (
    <select aria-label="Urutkan" className="isian min-h-10 w-auto py-1.5" value={filter.urut} onChange={(e) => ubah({ urut: e.target.value })}>
      {urutan.map((u) => (
        <option key={u.id} value={u.id}>
          {u.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="wadah grid gap-8 pb-20 lg:grid-cols-12">
      <div className="flex flex-wrap items-center gap-3 lg:hidden">
        <button type="button" className="tombol tombol-garis min-h-11 py-2" aria-expanded={panel} aria-controls={idPanel} onClick={() => setPanel((v) => !v)}>
          {panel ? 'Tutup saringan' : 'Saring'}
          {jumlahFilter > 0 && <span className="data rounded-full bg-kunyit px-2 py-0.5 text-[0.75rem] text-tinta">{jumlahFilter}</span>}
        </button>
        <span className="ms-auto flex items-center gap-2 text-[0.9rem]">
          <span className="text-tinta-2" aria-hidden="true">
            Urutkan
          </span>
          {pilihUrut}
        </span>
      </div>

      <aside id={idPanel} aria-label="Saringan produk" className={`${panel ? 'block' : 'hidden'} lg:sticky lg:top-28 lg:col-span-3 lg:block lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:pe-2`}>
        <form role="search" onSubmit={(e) => e.preventDefault()} className="border-t-2 border-tinta pt-4">
          <label htmlFor="cari-produk" className="font-semibold">
            Cari produk atau bahan
          </label>
          <input id="cari-produk" type="search" className="isian mt-2" placeholder="mis. niasinamida, isi ulang" value={filter.q} onChange={(e) => ubah({ q: e.target.value })} autoComplete="off" />
        </form>

        <fieldset className="mt-6 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Langkah</legend>
          <ul className="clear-both grid gap-0.5 pt-2">
            {langkah.map((l) => (
              <li key={l.id}>
                <Kotak checked={filter.langkah.includes(l.id)} onChange={() => balik('langkah', l.id)} jumlah={aktifSemua.filter((p) => p.langkah === l.id).length}>
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: l.warna }} />
                    {l.jenis}
                  </span>
                </Kotak>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="mt-5 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Jenis kulit</legend>
          <ul className="clear-both grid gap-0.5 pt-2">
            {[{ id: '', nama: 'Semua jenis' }, ...jenisKulit].map((k) => (
              <li key={k.id || 'semua'}>
                <Bulat name="kulit" checked={filter.kulit === k.id} onChange={() => ubah({ kulit: k.id })}>
                  {k.nama}
                </Bulat>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="mt-5 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Yang ingin dirawat</legend>
          <ul className="clear-both grid gap-0.5 pt-2">
            {tujuan.map((t) => (
              <li key={t.id}>
                <Kotak checked={filter.tujuan.includes(t.id)} onChange={() => balik('tujuan', t.id)}>
                  {t.nama}
                </Kotak>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="mt-5 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Waktu pakai</legend>
          <ul className="clear-both grid grid-cols-3 gap-2 pt-3">
            {[
              { id: '', nama: 'Semua' },
              { id: 'pagi', nama: 'Pagi' },
              { id: 'malam', nama: 'Malam' },
            ].map((w) => (
              <li key={w.id || 'semua'}>
                <label className="pilihan flex min-h-10 items-center justify-center px-2 text-[0.92rem]">
                  <input type="radio" name="waktu" className="sr-only" checked={filter.waktu === w.id} onChange={() => ubah({ waktu: w.id })} />
                  {w.nama}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="mt-5 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Lainnya</legend>
          <ul className="clear-both grid gap-0.5 pt-2">
            <li>
              <Kotak checked={filter.isiUlang} onChange={() => ubah({ isiUlang: !filter.isiUlang })}>
                Ada kemasan isi ulang
              </Kotak>
            </li>
            <li>
              <Kotak checked={filter.peka} onChange={() => ubah({ peka: !filter.peka })}>
                Ramah kulit peka
              </Kotak>
            </li>
          </ul>
        </fieldset>

        <fieldset className="mt-5 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Harga</legend>
          <ul className="clear-both grid gap-0.5 pt-2">
            {[{ id: '', label: 'Semua harga' }, ...rentangFilter].map((r) => (
              <li key={r.id || 'semua'}>
                <Bulat name="harga" checked={filter.harga === r.id} onChange={() => ubah({ harga: r.id })}>
                  {r.label}
                </Bulat>
              </li>
            ))}
          </ul>
        </fieldset>

        {jumlahFilter > 0 && (
          <button type="button" className="tautan mt-6 font-medium" onClick={kosongkan}>
            Hapus semua saringan
          </button>
        )}
      </aside>

      <div className="lg:col-span-9">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t-2 border-tinta pt-4">
          <p aria-live="polite" className="font-medium">
            {hasil.length === aktifSemua.length && jumlahFilter === 0 ? `${hasil.length} produk` : `Menampilkan ${hasil.length} dari ${aktifSemua.length} produk`}
          </p>
          <span className="ms-auto hidden items-center gap-2 text-[0.9rem] lg:flex">
            <span className="text-tinta-2" aria-hidden="true">
              Urutkan
            </span>
            {pilihUrut}
          </span>
          {chip.length > 0 && (
            <ul className="flex w-full flex-wrap gap-2" aria-label="Saringan aktif">
              {chip.map((c) => (
                <li key={c.label}>
                  <button type="button" onClick={c.hapus} className="inline-flex min-h-9 items-center gap-2 rounded-full bg-kabut px-3 py-1.5 text-[0.88rem] hover:bg-kabut-2">
                    {c.label}
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">, hapus saringan ini</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasil.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3">
            {hasil.map((p) => (
              <li key={p.slug}>
                <KartuProduk produk={p} inventaris={inv} judulTag="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-[14px] border border-dashed border-garis-tua bg-kertas p-6 sm:p-8">
            <h2 className="text-2xl">Rak ini kosong</h2>
            <p className="mt-2 max-w-lg text-tinta-2">
              Tidak ada produk yang cocok dengan semua saringanmu. Coba kurangi saringan tujuan atau harga, atau cari dengan nama bahan.
            </p>
            <button type="button" className="tombol tombol-utama mt-5" onClick={kosongkan}>
              Hapus semua saringan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
