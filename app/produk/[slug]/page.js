import Link from 'next/link';
import { notFound } from 'next/navigation';
import DetailProduk from '@/components/DetailProduk';
import KartuProduk from '@/components/KartuProduk';
import { produk, cariProduk, cariLangkah } from '@/lib/data';
import { cariBahan } from '@/lib/kandungan';
import { ogHalaman, jsonLdProduk } from '@/lib/seo';
import { produkTerkait, hargaTermurah, adaIsiUlang } from '@/lib/katalog';
import { rupiah } from '@/lib/format';

export const dynamicParams = false;

// Meta description dirakit dari kalimat utuh menurut prioritas dan berhenti sebelum lewat 155 karakter.
function deskripsiProduk(p) {
  const BATAS = 155;
  const aktif = p.aktif.filter((a) => a.kadar).map((a) => `${cariBahan(a.bahan).nama} ${a.kadar}`);
  const pilihan = [
    [`Mulai ${rupiah(hargaTermurah(p))}.`],
    [aktif.length ? `Berisi ${aktif.join(' dan ')}.` : ''],
    [adaIsiUlang(p) ? 'Tersedia isi ulang.' : `Takaran: ${p.takaran.label}.`],
  ];
  let teks = p.ringkas;
  for (const opsi of pilihan) {
    const muat = opsi.find((k) => k && `${teks} ${k}`.length <= BATAS);
    if (muat) teks = `${teks} ${muat}`;
  }
  return teks;
}

function judulProduk(p) {
  // Judul halaman ≤ 60 karakter termasuk " · Takar".
  return p.nama.length > 50 ? p.nama.replace(/ PA\+{4}$/, '') : p.nama;
}

export function generateStaticParams() {
  return produk.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = cariProduk(slug);
  if (!p) return {};
  const deskripsi = deskripsiProduk(p);
  return {
    title: judulProduk(p),
    description: deskripsi,
    alternates: { canonical: `/produk/${p.slug}` },
    ...ogHalaman({ path: `/produk/${p.slug}`, judul: judulProduk(p), deskripsi }),
  };
}

export default async function HalamanProduk({ params }) {
  const { slug } = await params;
  const p = cariProduk(slug);
  if (!p) notFound();
  const l = cariLangkah(p.langkah);
  const terkait = produkTerkait(p, 4);
  return (
    <>
      <nav aria-label="Jejak halaman" className="wadah pb-5 pt-6 text-[0.9rem]">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-tinta-2">
          <li>
            <Link href="/produk" className="hover:underline">
              Produk
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/produk?langkah=${l.id}`} className="hover:underline">
              {l.jenis}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-tinta">
            {p.nama}
          </li>
        </ol>
      </nav>
      <DetailProduk slug={p.slug} />
      <section aria-labelledby="judul-terkait" className="mt-6 border-t border-garis bg-kertas py-14">
        <div className="wadah">
          <h2 id="judul-terkait" className="text-3xl sm:text-4xl">
            {p.langkah === 'tubuh' ? 'Untuk dipakai bersama' : 'Langkah sebelum dan sesudahnya'}
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {terkait.map((t) => (
              <li key={t.slug}>
                <KartuProduk produk={t} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduk(p)) }} />
    </>
  );
}
