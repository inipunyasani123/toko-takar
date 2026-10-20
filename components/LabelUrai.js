import Link from 'next/link';
import { cariProduk, cariLangkah } from '@/lib/data';
import { bahanDariInci, fungsi } from '@/lib/kandungan';

function Nomor({ n, className = '' }) {
  return (
    <span aria-hidden="true" className={`data inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kunyit text-[0.75rem] font-medium text-tinta ${className}`}>
      {n}
    </span>
  );
}

const PENJELASAN = [
  { t: 'Langkah pakai', j: 'Nomor dan warna tutup menunjukkan urutan di rutinitas: 01 pembersih sampai 05 tabir surya.' },
  { t: 'Kadar bahan aktif', j: 'Berat bahan aktif dalam tiap 100 gram formula. Kami tulis di depan, bukan di balik botol.' },
  { t: 'Bahan pendamping', j: 'Bahan kedua yang kadarnya ikut kami sebut karena ikut menentukan fungsi formula.' },
  { t: 'Isi kemasan', j: 'Dipakai untuk menghitung perkiraan kapan isi kemasan habis dengan takaran yang disarankan.' },
  { t: 'Batas setelah dibuka', j: 'PAO: berapa bulan formula sebaiknya dihabiskan setelah segelnya dibuka.' },
];

// Label serum diurai: tiap bagian diberi nomor, lalu daftar kandungannya dijelaskan fungsi per fungsi.
export default function LabelUrai({ slug = 'serum-niasinamida-5' }) {
  const p = cariProduk(slug);
  const l = cariLangkah(p.langkah);
  const v = p.varian[0];
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <div className="mx-auto max-w-md">
          <div className="relative overflow-hidden rounded-[14px] border border-garis-tua bg-kertas shadow-[0_18px_40px_-28px_rgba(23,32,28,0.55)]">
            <div className="flex items-center justify-between px-5 py-2.5" style={{ background: l.warna }}>
              <span className="data text-[0.85rem] font-medium text-tinta">
                0{l.no} · {l.nama}
              </span>
              <Nomor n={1} />
            </div>
            <div className="px-6 pb-5 pt-6 text-center">
              <p className="font-display text-[1.15rem] tracking-[0.02em]">takar</p>
              <p className="mt-2 font-display text-[2.6rem] leading-none sm:text-5xl">{p.label.nama.join(' ')}</p>
              <p className="mt-4 flex items-center justify-center gap-3">
                <span className="data text-[3.4rem] font-medium leading-none sm:text-6xl">{p.label.angka}</span>
                <Nomor n={2} />
              </p>
              <p className="data mt-3 flex items-center justify-center gap-2 text-[0.95rem] text-tinta-2">
                {p.label.sub}
                <Nomor n={3} />
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-garis px-5 py-3">
              <span className="data flex items-center gap-2 text-[0.95rem]">
                {v.ukuran} {v.satuan}
                <Nomor n={4} />
              </span>
              <span className="data flex items-center gap-2 text-[0.95rem]">
                <Nomor n={5} />
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">
                  <path d="M5 9h14l-1.4 10.2a1.5 1.5 0 0 1-1.5 1.3H7.9a1.5 1.5 0 0 1-1.5-1.3L5 9Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5.4 9 7.6 4.2l9.6 2.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {p.pao}M
              </span>
            </div>
          </div>
          <ol className="mt-6 grid gap-3">
            {PENJELASAN.map((x, i) => (
              <li key={x.t} className="flex gap-3">
                <Nomor n={i + 1} className="mt-0.5" />
                <p className="text-[0.95rem] text-tinta-2">
                  <span className="font-semibold text-tinta">{x.t}.</span> {x.j}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="lg:col-span-6">
        <h3 className="font-display text-[1.6rem] leading-snug sm:text-3xl">Di balik label: {p.inci.length} bahan, semuanya punya tugas</h3>
        <p className="mt-2 text-[0.95rem] text-tinta-2">
          Daftar kandungan diurutkan dari kadar terbesar. Bahan yang kadarnya 1% atau kurang boleh ditulis dalam urutan apa pun, jadi
          urutan di bagian bawah daftar tidak selalu menunjukkan mana yang lebih banyak.
        </p>
        <ol className="mt-5 columns-2 gap-x-4 border-t border-garis sm:gap-x-6">
          {p.inci.map((nama, i) => {
            const b = bahanDariInci(nama);
            const kadar = p.aktif.find((a) => a.bahan === b?.id)?.kadar;
            return (
              <li key={nama} className="break-inside-avoid border-b border-garis">
                <Link href={`/kandungan#${b.id}`} className="group grid grid-cols-[1.5rem_1fr_auto] items-baseline gap-1.5 py-2 hover:bg-kabut/60 sm:grid-cols-[2rem_1fr_auto] sm:gap-2 sm:py-2.5">
                  <span className="data text-[0.78rem] text-tinta-3">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0">
                    <span className="data block text-[0.8rem] text-tinta [overflow-wrap:anywhere] group-hover:underline sm:text-[0.9rem]">{nama}</span>
                    <span className="block text-[0.78rem] leading-snug text-tinta-3 sm:text-[0.82rem]">{b.fungsi.map((f) => fungsi[f].nama).join(', ')}</span>
                  </span>
                  <span className="data text-[0.85rem] font-medium">{kadar || ''}</span>
                </Link>
              </li>
            );
          })}
        </ol>
        <Link href={`/produk/${p.slug}`} className="tautan mt-4 inline-block font-medium">
          Lihat {p.nama}
        </Link>
      </div>
    </div>
  );
}
