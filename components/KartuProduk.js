import Link from 'next/link';
import Kemasan from './Kemasan';
import { cariLangkah } from '@/lib/data';
import { rentangHarga, totalStok, adaIsiUlang, varianBotol } from '@/lib/katalog';
import { cariBahan } from '@/lib/kandungan';
import { rupiah } from '@/lib/format';

export function ringkasAktif(p) {
  return p.aktif
    .filter((a) => a.kadar)
    .map((a) => `${cariBahan(a.bahan)?.nama} ${a.kadar}`)
    .join(' · ');
}

export function labelWaktu(p) {
  if (p.langkah === 'tubuh') return 'untuk badan';
  if (!p.kaliSeminggu) return 'kapan saja';
  if (p.waktu.length === 2) return 'pagi & malam';
  return p.waktu[0] === 'pagi' ? 'pagi' : 'malam';
}

// Kartu produk untuk katalog dan daftar terkait. `inventaris` opsional (dari browser).
export default function KartuProduk({ produk: p, inventaris, judulTag = 'h3', ringkas = false }) {
  const stok = inventaris ? totalStok(p, inventaris) : null;
  const { min, max } = rentangHarga(p);
  const Judul = judulTag;
  const l = cariLangkah(p.langkah);
  const aktif = ringkasAktif(p);
  const v = varianBotol(p).sort((a, b) => b.ukuran - a.ukuran)[0] || p.varian[0];
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[14px]" style={{ background: l.muda }}>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-transparent to-black/[0.035]" />
        <Kemasan slug={p.slug} varian={v.id} bingkai="pas" className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none" />
        <p className="data absolute left-3 top-3 flex items-center gap-1.5 text-[0.7rem] text-tinta-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: l.warna, boxShadow: `inset 0 0 0 1px ${l.tua}40` }} />
          {l.no ? `0${l.no} ${l.nama}` : l.nama}
        </p>
        {stok === 0 && <p className="data absolute right-3 top-3 rounded-full bg-tinta px-2 py-0.5 text-[0.68rem] text-kertas">Habis</p>}
        {stok !== null && stok > 0 && stok <= 5 && (
          <p className="data absolute right-3 top-3 rounded-full bg-kertas px-2 py-0.5 text-[0.68rem] text-awas">Sisa {stok}</p>
        )}
        {adaIsiUlang(p) && (
          <p className="data absolute bottom-3 left-3 rounded-full bg-kertas/90 px-2 py-0.5 text-[0.68rem] text-tinta">Ada isi ulang</p>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <p className="text-[0.82rem] text-tinta-3">
          {l.jenis} · {labelWaktu(p)}
        </p>
        <Judul className="mt-0.5 font-display text-[1.2rem] leading-snug">
          <Link
            href={`/produk/${p.slug}`}
            className="after:absolute after:inset-0 after:rounded-[14px] after:content-[''] hover:underline hover:decoration-1 hover:underline-offset-4"
          >
            {p.nama}
          </Link>
        </Judul>
        {!ringkas && aktif && <p className="data mt-1 text-[0.78rem] text-tinta-2">{aktif}</p>}
        <p className="mt-auto pt-2 font-semibold">
          {min === max ? (
            rupiah(min)
          ) : (
            <>
              <span className="text-[0.85rem] font-normal text-tinta-2">mulai </span>
              {rupiah(min)}
            </>
          )}
        </p>
      </div>
    </article>
  );
}
