import Link from 'next/link';
import Logo from './Logo';
import { site } from '@/lib/data';

const kolom = [
  {
    judul: 'Belanja',
    tautan: [
      { href: '/produk', label: 'Semua produk' },
      { href: '/cocokkan', label: 'Cocokkan dengan kulitmu' },
      { href: '/rutinitas', label: 'Penyusun rutinitas' },
      { href: '/isi-ulang', label: 'Isi ulang' },
      { href: '/keranjang', label: 'Keranjang' },
    ],
  },
  {
    judul: 'Pelajari',
    tautan: [
      { href: '/kandungan', label: 'Kamus kandungan' },
      { href: '/bantuan', label: 'Bantuan' },
      { href: '/tentang', label: 'Tentang Takar' },
      { href: '/kontak', label: 'Kontak' },
      { href: '/lacak', label: 'Lacak pesanan' },
    ],
  },
];

export default function Footer() {
  return (
    <footer data-situs className="gelap bg-malam text-[#dfe6e1]">
      <div aria-hidden="true" className="pita h-[10px]" />
      <div className="wadah grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex rounded-md" aria-label="Takar, ke beranda">
            <Logo ukuranTanda="h-10 w-10" teks="text-[2.4rem] text-kertas" />
          </Link>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-[#c9d3cd]">
            Perawatan kulit dengan kadar bahan tertulis, takaran pakai yang jelas, dan kantong isi ulang. Diracik dan dikirim dari {site.kota}.
          </p>
          <p className="mt-5 max-w-sm border-s-2 border-kunyit ps-3 text-[0.9rem] text-[#eef3ef]">{`${site.nama} adalah toko fiktif untuk demo.`}</p>
        </div>

        {kolom.map((k) => (
          <nav key={k.judul} aria-label={k.judul} className="md:col-span-2">
            <h2 className="font-sans text-[0.8rem] font-semibold tracking-[0.06em] text-kunyit uppercase">{k.judul}</h2>
            <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
              {k.tautan.map((t) => (
                <li key={t.href}>
                  <Link className="hover:underline hover:decoration-kunyit hover:underline-offset-4" href={t.href}>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="md:col-span-3">
          <h2 className="font-sans text-[0.8rem] font-semibold tracking-[0.06em] text-kunyit uppercase">Toko</h2>
          <dl className="mt-4 grid gap-3 text-[0.95rem]">
            <div>
              <dt className="text-[#a9b6af]">Layanan pesanan</dt>
              <dd>{site.jamLayanan}</dd>
            </div>
            <div>
              <dt className="text-[#a9b6af]">Toko dan isi ulang</dt>
              <dd>{site.jamToko}</dd>
            </div>
          </dl>
          <Link href="/admin" className="mt-5 inline-flex min-h-11 items-center text-[0.95rem] underline decoration-kunyit underline-offset-4 hover:decoration-2">
            Dasbor demo penjual
          </Link>
        </div>
      </div>
      <div className="wadah">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 py-5 text-[0.82rem] text-[#b7c3bc]">
          <p>Semua produk, kadar, harga, stok, dan pesanan di situs ini contoh.</p>
          <p className="data">Racikan kecil · {site.kota}</p>
        </div>
      </div>
    </footer>
  );
}
