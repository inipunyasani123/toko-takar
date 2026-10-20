import Link from 'next/link';
import Kemasan from '@/components/Kemasan';
import { produk, site, cariProduk } from '@/lib/data';
import { hematIsiUlang } from '@/lib/katalog';
import { rupiah } from '@/lib/format';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Produk Takar yang tersedia dalam kantong isi ulang, selisih harganya per ml, cara mengisi ulang yang aman, dan isi ulang curah di toko Bandung.';

export const metadata = {
  title: 'Isi ulang',
  description: deskripsi,
  alternates: { canonical: '/isi-ulang' },
  ...ogHalaman({ path: '/isi-ulang', judul: 'Isi ulang', deskripsi }),
};

const LANGKAH = [
  { t: 'Habiskan dulu isinya', j: 'Jangan menuang isi baru ke atas sisa lama. Sisa yang tertinggal di dasar bisa sudah lewat batas pakainya.' },
  { t: 'Cuci botol dan pompanya', j: 'Pakai sabun cuci piring dan air hangat. Pompa cukup dipompa berkali-kali di air sabun, lalu di air bersih.' },
  { t: 'Bilas dengan air matang', j: 'Bilasan terakhir pakai air yang sudah dididihkan lalu didinginkan, bukan air keran.' },
  { t: 'Keringkan sampai benar-benar kering', j: 'Biarkan terbalik semalaman. Tetes air yang tertinggal bisa menjadi tempat jamur tumbuh.' },
  { t: 'Tuang pelan, tulis tanggalnya', j: 'Gunting sudut kantong di garis putus-putus atau buka corongnya. Tulis tanggal isi ulang di stiker kecil di dasar botol.' },
];

const TIDAK = [
  { slug: 'serum-vitamin-c-10', alasan: 'Mudah teroksidasi oleh udara dan cahaya. Setiap kali dituang, formula terpapar udara lagi.' },
  { slug: 'serum-retinol-03', alasan: 'Retinol peka cahaya dan udara, jadi dijual dalam botol kaca cokelat kecil yang langsung dipakai.' },
  { slug: 'tabir-surya-spf50', alasan: 'Tabung tertutup menjaga filter UV dari kontaminasi. Tabung kosong tetap bisa disetor ke bank sampah.' },
];

// Harga curah di toko: contoh per 10 ml, sedikit di bawah harga kantong isi ulang.
const CURAH = ['gel-pembersih-pegagan', 'esens-air-beras', 'losion-tubuh-kelapa'];

export default function HalamanIsiUlang() {
  const daftar = produk.map((p) => hematIsiUlang(p) && { p, ...hematIsiUlang(p) }).filter(Boolean);
  return (
    <>
      <div className="wadah grid items-end gap-8 pb-10 pt-10 sm:pt-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="text-5xl sm:text-6xl">Isi ulang</h1>
          <p className="mt-3 max-w-2xl text-tinta-2">
            {daftar.length} produk yang paling cepat habis kami jual juga dalam kantong atau wadah dalam. Botolnya kamu simpan, isinya diganti,
            dan harganya lebih murah per ml. Kantongnya dari satu jenis plastik supaya lebih mudah didaur ulang.
          </p>
        </div>
        <div className="ubin-dinding relative mx-auto flex w-full max-w-md items-end justify-center gap-1 overflow-hidden rounded-[22px] border border-garis px-4 pb-[14px] pt-4 lg:col-span-5">
          <Kemasan slug="krim-ceramide" varian="50-jar" bingkai="rak-rendah" className="-mb-[2%] w-[36%]" judul="Jar kaca Krim Ceramide 50 ml" />
          <Kemasan slug="krim-ceramide" varian="50-isi-ulang" bingkai="rak-rendah" className="-mb-[2%] w-[36%]" judul="Wadah dalam isi ulang Krim Ceramide 50 ml" />
          <Kemasan slug="losion-tubuh-kelapa" varian="500-isi-ulang" bingkai="rak-rendah" className="-mb-[2%] w-[30%]" judul="Kantong isi ulang Losion Tubuh Kelapa 500 ml" />
          <div aria-hidden="true" className="pita absolute inset-x-0 bottom-0 h-[14px]" />
        </div>
      </div>

      <div className="wadah grid gap-14 pb-20">
        <section aria-labelledby="judul-tersedia">
          <h2 id="judul-tersedia" className="border-t-2 border-tinta pt-4 text-3xl sm:text-4xl">
            Yang tersedia
          </h2>
          <div className="mt-5 overflow-x-auto" tabIndex={0} role="region" aria-label="Tabel produk isi ulang, gulir ke samping">
            <table className="w-full min-w-[40rem] border-collapse text-left text-[0.95rem]">
              <thead>
                <tr className="border-b border-tinta">
                  <th scope="col" className="py-2.5 pe-4 font-semibold">Produk</th>
                  <th scope="col" className="py-2.5 pe-4 text-end font-semibold">Botol</th>
                  <th scope="col" className="py-2.5 pe-4 text-end font-semibold">Isi ulang</th>
                  <th scope="col" className="py-2.5 pe-4 text-end font-semibold">Per ml</th>
                  <th scope="col" className="py-2.5 text-end font-semibold">Lebih hemat</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map(({ p, botol, ulang, perMlBotol, perMlUlang, hemat, persen }) => (
                  <tr key={p.slug} className="border-b border-garis">
                    <th scope="row" className="py-3 pe-4 font-normal">
                      <Link href={`/produk/${p.slug}?varian=${ulang.id}`} className="font-medium hover:underline">
                        {p.nama}
                      </Link>
                      <span className="block text-[0.85rem] text-tinta-3">{ulang.kemasan === 'pod' ? 'Wadah dalam untuk jar' : 'Kantong untuk dituang'}</span>
                    </th>
                    <td className="data py-3 pe-4 text-end text-[0.88rem]">
                      {botol.ukuran} {botol.satuan} · {rupiah(botol.harga)}
                    </td>
                    <td className="data py-3 pe-4 text-end text-[0.88rem]">
                      {ulang.ukuran} {ulang.satuan} · {rupiah(ulang.harga)}
                    </td>
                    <td className="data py-3 pe-4 text-end text-[0.88rem]">
                      {rupiah(perMlBotol)} → {rupiah(perMlUlang)}
                    </td>
                    <td className="data py-3 text-end font-medium">
                      {persen}%<span className="block text-[0.78rem] font-normal text-tinta-3">{rupiah(hemat)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[0.85rem] text-tinta-3">Selisih dihitung terhadap harga per ml botol terkecil, untuk isi yang sama dengan kemasan isi ulangnya.</p>
          <Link href="/produk?isi-ulang=1" className="tombol tombol-utama mt-5">
            Lihat produk yang ada isi ulangnya
          </Link>
        </section>

        <section aria-labelledby="judul-cara" className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="judul-cara" className="border-t-2 border-tinta pt-4 text-3xl sm:text-4xl">
              Cara mengisi ulang yang aman
            </h2>
            <p className="mt-3 text-tinta-2">Lima langkah, lima belas menit. Yang paling sering terlewat adalah langkah keempat.</p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {LANGKAH.map((x, i) => (
              <li key={x.t} className={`rounded-[14px] border border-garis bg-kertas p-4 ${i === 4 ? 'sm:col-span-2' : ''}`}>
                <p className="data text-[0.85rem] text-kunyit-tua">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 font-sans text-[1.05rem] font-semibold tracking-normal">{x.t}</h3>
                <p className="mt-1 text-[0.95rem] text-tinta-2">{x.j}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="judul-tidak" className="gelap rounded-[20px] bg-malam p-5 text-[#dfe6e1] sm:p-8">
          <h2 id="judul-tidak" className="text-3xl text-kertas sm:text-4xl">
            Kenapa tidak semua produk
          </h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {TIDAK.map((x) => {
              const p = cariProduk(x.slug);
              return (
                <li key={x.slug} className="border-t border-white/15 pt-4">
                  <Link href={`/produk/${p.slug}`} className="font-medium text-kertas underline decoration-kunyit underline-offset-4">
                    {p.nama}
                  </Link>
                  <p className="mt-2 text-[0.95rem] text-[#c9d3cd]">{x.alasan}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="judul-curah" className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="judul-curah" className="border-t-2 border-tinta pt-4 text-3xl sm:text-4xl">
              Isi ulang curah di toko
            </h2>
            <p className="mt-3 text-tinta-2">
              Bawa botolmu yang sudah bersih dan kering ke toko kami di {site.kota}. Kami timbang dan isi di depanmu, dibayar per 10 ml. Jam toko{' '}
              {site.jamToko}.
            </p>
            <p className="mt-3 text-[0.9rem] text-tinta-3">{site.alamatToko}</p>
          </div>
          <div className="lg:col-span-7">
            <table className="w-full border-collapse text-left text-[0.95rem]">
              <caption className="sr-only">Contoh harga isi ulang curah per 10 ml</caption>
              <thead>
                <tr className="border-b border-tinta">
                  <th scope="col" className="py-2.5 pe-4 font-semibold">Produk curah</th>
                  <th scope="col" className="py-2.5 text-end font-semibold">Per 10 ml</th>
                </tr>
              </thead>
              <tbody>
                {CURAH.map((slug) => {
                  const h = hematIsiUlang(cariProduk(slug));
                  const per10 = Math.round((h.perMlUlang * 10 * 0.95) / 100) * 100;
                  return (
                    <tr key={slug} className="border-b border-garis">
                      <th scope="row" className="py-3 pe-4 font-normal">
                        {cariProduk(slug).nama}
                      </th>
                      <td className="data py-3 text-end">{rupiah(per10)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-2 text-[0.85rem] text-tinta-3">Contoh harga untuk toko demo. Curah hanya tersedia untuk tiga produk di tabel ini.</p>
          </div>
        </section>
      </div>
    </>
  );
}
