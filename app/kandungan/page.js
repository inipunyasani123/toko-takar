import Kamus from '@/components/Kamus';
import { kandungan } from '@/lib/kandungan';
import { ogHalaman } from '@/lib/seo';

const deskripsi = `Fungsi ${kandungan.length} bahan di produk Takar, dari niasinamida dan retinol sampai pengawet dan pengatur pH. Apa adanya, tanpa janji medis.`;

export const metadata = {
  title: 'Kamus kandungan',
  description: deskripsi,
  alternates: { canonical: '/kandungan' },
  ...ogHalaman({ path: '/kandungan', judul: 'Kamus kandungan', deskripsi }),
};

export default function HalamanKandungan() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Kamus kandungan Takar',
    inLanguage: 'id-ID',
    hasDefinedTerm: kandungan.map((k) => ({ '@type': 'DefinedTerm', name: k.nama, alternateName: k.inci, description: k.ringkas, url: `https://toko-takar.pintuweb.id/kandungan#${k.id}` })),
  };
  return (
    <>
      <div className="wadah grid gap-6 pb-8 pt-10 sm:pt-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="text-5xl sm:text-6xl">Kamus kandungan</h1>
          <p className="mt-3 max-w-2xl text-tinta-2">
            Semua bahan yang ada di produk kami, termasuk yang biasanya dilewati: pengawet, pengental, dan pengatur pH. Yang kami tulis adalah
            fungsinya di dalam formula, bukan janji hasil.
          </p>
        </div>
        <div className="rounded-[14px] border border-garis bg-kertas p-4 text-[0.92rem] text-tinta-2 lg:col-span-5">
          <p className="font-semibold text-tinta">Cara membaca daftar kandungan</p>
          <p className="mt-1">
            Bahan ditulis dengan nama INCI dan diurutkan dari kadar terbesar. Bahan yang kadarnya 1% atau kurang boleh ditulis dalam urutan apa
            pun. Asal bahan, nabati atau sintetis, tidak menentukan aman atau tidaknya.
          </p>
        </div>
      </div>
      <Kamus />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
