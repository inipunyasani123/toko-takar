import Link from 'next/link';
import { faq, zonaOngkir, site } from '@/lib/data';
import { rupiah } from '@/lib/format';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Jawaban soal memilih produk, kadar dan kandungan, isi ulang, pengiriman, retur, dan cara kerja toko demo Takar.';

export const metadata = {
  title: 'Bantuan',
  description: deskripsi,
  alternates: { canonical: '/bantuan' },
  ...ogHalaman({ path: '/bantuan', judul: 'Bantuan', deskripsi }),
};

export default function HalamanBantuan() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.flatMap((g) => g.isi.map((t) => ({ '@type': 'Question', name: t.t, acceptedAnswer: { '@type': 'Answer', text: t.j } }))),
  };
  return (
    <>
      <div className="wadah pb-10 pt-10 sm:pt-14">
        <h1 className="text-5xl sm:text-6xl">Bantuan</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Jawaban soal memilih produk, kandungan, isi ulang, dan pengiriman. Kebijakan di bawah ini milik toko fiktif, dibuat untuk contoh.
        </p>
        <nav aria-label="Topik bantuan" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {faq.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="inline-flex min-h-10 items-center rounded-full border border-garis-tua bg-kertas px-4 py-2 text-[0.92rem] hover:border-tinta">
                  {g.grup}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="wadah grid gap-12 pb-20 lg:grid-cols-12">
        <div className="grid gap-12 lg:col-span-8">
          {faq.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`judul-${g.id}`} className="scroll-mt-28">
              <h2 id={`judul-${g.id}`} className="border-t-2 border-tinta pt-4 text-3xl sm:text-4xl">
                {g.grup}
              </h2>
              <div className="mt-4">
                {g.isi.map((t, i) => (
                  <details key={t.t} className="group border-b border-garis" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-[1.05rem] font-semibold [&::-webkit-details-marker]:hidden">
                      <span>{t.t}</span>
                      <span aria-hidden="true" className="data mt-0.5 text-lg leading-none text-kunyit-tua transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-5 text-tinta-2">{t.j}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="lg:col-span-4">
          <div className="grid gap-6 lg:sticky lg:top-28">
            <section aria-labelledby="judul-tarif" className="rounded-[18px] border border-garis-tua bg-kertas p-5">
              <h2 id="judul-tarif" className="font-sans text-lg font-semibold tracking-normal">
                Contoh tarif per kg
              </h2>
              <p className="mt-1 text-[0.85rem] text-tinta-3">Dari {site.kota}. Bukan tarif kurir sungguhan.</p>
              <table className="mt-3 w-full border-collapse text-left text-[0.9rem]">
                <thead>
                  <tr className="border-b border-tinta">
                    <th scope="col" className="py-1.5 pe-2 font-semibold">Zona</th>
                    <th scope="col" className="py-1.5 pe-2 text-end font-semibold">Reguler</th>
                    <th scope="col" className="py-1.5 text-end font-semibold">Kilat</th>
                  </tr>
                </thead>
                <tbody>
                  {zonaOngkir.map((z) => (
                    <tr key={z.id} className="border-b border-garis">
                      <th scope="row" className="py-2 pe-2 font-normal">
                        {z.nama}
                        <span className="block text-[0.8rem] text-tinta-3">{z.cakupan}</span>
                      </th>
                      <td className="py-2 pe-2 text-end tabular-nums">{rupiah(z.layanan.reguler.perKg)}</td>
                      <td className="py-2 text-end tabular-nums">{z.layanan.kilat ? rupiah(z.layanan.kilat.perKg) : '–'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[0.85rem] text-tinta-2">Kemasan kirim menambah 20% dari berat barang, minimal 150 g. Berat dibulatkan ke atas per kg.</p>
            </section>
            <section aria-labelledby="judul-tanya" className="rounded-[18px] border border-garis bg-ubin p-5">
              <h2 id="judul-tanya" className="font-sans text-lg font-semibold tracking-normal">
                Masih ada pertanyaan?
              </h2>
              <p className="mt-1 text-[0.92rem] text-tinta-2">
                Tulis lewat formulir kontak. Di toko demo ini, pesanmu tersimpan di browser dan muncul di dasbor penjual. Jam layanan contoh:{' '}
                {site.jamLayanan}.
              </p>
              <Link href="/kontak" className="tautan mt-3 inline-block font-medium">
                Buka formulir kontak
              </Link>
            </section>
          </div>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
