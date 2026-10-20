import Link from 'next/link';
import FormKontak from '@/components/FormKontak';
import { site } from '@/lib/data';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Tanya soal produk, rutinitas, pesanan, atau isi ulang di toko demo Takar. Formulir contoh yang menyimpan pesan di browser.';

export const metadata = {
  title: 'Kontak',
  description: deskripsi,
  alternates: { canonical: '/kontak' },
  ...ogHalaman({ path: '/kontak', judul: 'Kontak', deskripsi }),
};

export default function HalamanKontak() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-5xl sm:text-6xl">Kontak</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Ceritakan jenis kulitmu dan produk yang sedang kamu pakai, supaya jawabannya tepat. Untuk keluhan kulit yang serius, temui tenaga
          kesehatan.
        </p>
      </div>
      <div className="wadah grid gap-10 pb-20 lg:grid-cols-12">
        <section aria-labelledby="judul-form" className="lg:col-span-7">
          <h2 id="judul-form" className="border-t-2 border-tinta pt-4 text-3xl">
            Tulis pesan
          </h2>
          <div className="mt-6">
            <FormKontak />
          </div>
        </section>
        <aside className="grid content-start gap-5 lg:col-span-5">
          <section aria-labelledby="judul-jam" className="rounded-[18px] border border-garis bg-kertas p-5">
            <h2 id="judul-jam" className="font-sans text-lg font-semibold tracking-normal">
              Jam dan alamat
            </h2>
            <dl className="mt-3 grid gap-3 text-[0.95rem]">
              <div>
                <dt className="text-tinta-3">Layanan pesanan</dt>
                <dd>{site.jamLayanan}</dd>
              </div>
              <div>
                <dt className="text-tinta-3">Toko dan isi ulang curah</dt>
                <dd>{site.jamToko}</dd>
              </div>
              <div>
                <dt className="text-tinta-3">Alamat</dt>
                <dd>{site.alamatToko}</dd>
              </div>
            </dl>
          </section>
          <section aria-labelledby="judul-wa" className="rounded-[18px] border border-dashed border-garis-tua bg-ubin p-5">
            <h2 id="judul-wa" className="font-sans text-lg font-semibold tracking-normal">
              WhatsApp dan email
            </h2>
            <p className="mt-2 text-[0.95rem] text-tinta-2">
              Di toko sungguhan, nomor WhatsApp dan email penjual tercantum di sini. {site.nama} toko fiktif, jadi sengaja tidak ada nomor atau alamat
              email yang bisa dihubungi.
            </p>
          </section>
          <section aria-labelledby="judul-cepat" className="rounded-[18px] border border-garis bg-kertas p-5">
            <h2 id="judul-cepat" className="font-sans text-lg font-semibold tracking-normal">
              Mungkin sudah terjawab
            </h2>
            <ul className="mt-2 grid gap-2 text-[0.95rem]">
              <li>
                <Link href="/bantuan#memilih" className="tautan">
                  Memilih produk dan uji tempel
                </Link>
              </li>
              <li>
                <Link href="/bantuan#isi-ulang" className="tautan">
                  Cara mengisi ulang
                </Link>
              </li>
              <li>
                <Link href="/lacak" className="tautan">
                  Status pesanan
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}
