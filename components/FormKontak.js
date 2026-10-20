'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { jenisKulit } from '@/lib/data';
import { simpanPesanKontak } from '@/lib/store';

export const TOPIK = [
  { id: 'produk', nama: 'Pertanyaan produk atau rutinitas' },
  { id: 'pesanan', nama: 'Pesanan dan pengiriman' },
  { id: 'isi-ulang', nama: 'Isi ulang dan kemasan' },
  { id: 'reaksi', nama: 'Kulit bereaksi setelah memakai produk' },
  { id: 'lain', nama: 'Lainnya' },
];

function periksa(f) {
  const e = {};
  if (f.nama.trim().length < 2) e.nama = 'Tulis namamu.';
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Alamat email belum benar. Boleh dikosongkan.';
  if (!f.topik) e.topik = 'Pilih topik pesan.';
  if (f.pesan.trim().length < 15) e.pesan = 'Ceritakan sedikit lebih lengkap, minimal 15 huruf.';
  return e;
}

const URUT = ['nama', 'email', 'topik', 'pesan'];

export default function FormKontak() {
  const [f, setF] = useState({ nama: '', email: '', topik: '', kulit: '', pesan: '' });
  const [dicoba, setDicoba] = useState(false);
  const [terkirim, setTerkirim] = useState(null);
  const hasilRef = useRef(null);
  const galat = dicoba ? periksa(f) : {};
  const ubah = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const aria = (k) => ({ 'aria-invalid': galat[k] ? 'true' : undefined, 'aria-describedby': galat[k] ? `${k}-galat` : undefined });

  const kirim = (e) => {
    e.preventDefault();
    setDicoba(true);
    const g = periksa(f);
    const pertama = URUT.find((k) => g[k]);
    if (pertama) {
      requestAnimationFrame(() => document.getElementById(`kontak-${pertama}`)?.focus());
      return;
    }
    const id = simpanPesanKontak({ nama: f.nama.trim(), email: f.email.trim(), topik: f.topik, kulit: f.kulit, pesan: f.pesan.trim() });
    setTerkirim(id);
    setF({ nama: '', email: '', topik: '', kulit: '', pesan: '' });
    setDicoba(false);
    requestAnimationFrame(() => hasilRef.current?.focus());
  };

  return (
    <div>
      <div ref={hasilRef} tabIndex={-1} className="outline-none" role="status" aria-live="polite">
        {terkirim && (
          <div className="mb-6 rounded-[14px] bg-daun-muda p-4">
            <p className="font-semibold">Pesan {terkirim} tersimpan.</p>
            <p className="mt-1 text-[0.95rem] text-tinta-2">
              Ini toko demo, jadi pesan tidak terkirim ke mana pun. Pesanmu tersimpan di browser ini dan bisa dilihat di{' '}
              <Link href="/admin#pesan" className="tautan">
                dasbor demo penjual
              </Link>
              .
            </p>
          </div>
        )}
      </div>
      <form noValidate onSubmit={kirim} className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="kontak-nama" className="font-medium">
            Nama
          </label>
          <input id="kontak-nama" className="isian mt-1.5" autoComplete="name" aria-required="true" value={f.nama} onChange={ubah('nama')} {...aria('nama')} />
          {galat.nama && (
            <p id="nama-galat" className="mt-1.5 text-[0.88rem] font-medium text-awas">
              {galat.nama}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="kontak-email" className="font-medium">
            Email <span className="font-normal text-tinta-3">(boleh dikosongkan)</span>
          </label>
          <input id="kontak-email" type="email" className="isian mt-1.5" autoComplete="email" value={f.email} onChange={ubah('email')} {...aria('email')} />
          {galat.email && (
            <p id="email-galat" className="mt-1.5 text-[0.88rem] font-medium text-awas">
              {galat.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="kontak-topik" className="font-medium">
            Topik
          </label>
          <select id="kontak-topik" className="isian mt-1.5" aria-required="true" value={f.topik} onChange={ubah('topik')} {...aria('topik')}>
            <option value="">Pilih topik</option>
            {TOPIK.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nama}
              </option>
            ))}
          </select>
          {galat.topik && (
            <p id="topik-galat" className="mt-1.5 text-[0.88rem] font-medium text-awas">
              {galat.topik}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="kontak-kulit" className="font-medium">
            Jenis kulit <span className="font-normal text-tinta-3">(boleh dikosongkan)</span>
          </label>
          <select id="kontak-kulit" className="isian mt-1.5" value={f.kulit} onChange={ubah('kulit')}>
            <option value="">Tidak yakin</option>
            {jenisKulit.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>
        {f.topik === 'reaksi' && (
          <p className="rounded-xl border-s-4 border-awas bg-[#fdf3ef] p-3.5 text-[0.92rem] sm:col-span-2">
            Hentikan pemakaian dan bilas dengan air. Bila bengkak, sesak, atau reaksinya tidak membaik, segera temui tenaga kesehatan. Pesan ini tidak
            menggantikan pemeriksaan.
          </p>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="kontak-pesan" className="font-medium">
            Pesan
          </label>
          <textarea id="kontak-pesan" rows={5} className="isian mt-1.5" aria-required="true" value={f.pesan} onChange={ubah('pesan')} {...aria('pesan')} />
          {galat.pesan && (
            <p id="pesan-galat" className="mt-1.5 text-[0.88rem] font-medium text-awas">
              {galat.pesan}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="tombol tombol-utama w-full sm:w-auto">
            Simpan pesan
          </button>
          <p className="mt-2 text-[0.85rem] text-tinta-3">Formulir demo: pesan disimpan di browser ini, tidak dikirim ke server.</p>
        </div>
      </form>
    </div>
  );
}
