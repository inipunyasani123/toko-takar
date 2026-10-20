import Cocokkan from '@/components/Cocokkan';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Empat pertanyaan tentang jenis kulit, kepekaan, dan yang ingin dirawat. Hasilnya rutinitas pagi dan malam lengkap dengan alasannya.';

export const metadata = {
  title: 'Cocokkan dengan kulitmu',
  description: deskripsi,
  alternates: { canonical: '/cocokkan' },
  ...ogHalaman({ path: '/cocokkan', judul: 'Cocokkan dengan kulitmu', deskripsi }),
};

export default function HalamanCocokkan() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="max-w-3xl text-5xl sm:text-6xl">Cocokkan dengan kulitmu</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Empat pertanyaan, tanpa daftar akun. Aturan pemilihannya sederhana dan kami tulis apa adanya di setiap usulan. Ini bukan diagnosis:
          untuk jerawat yang meradang, eksim, atau kulit yang terus perih, temui dokter.
        </p>
      </div>
      <Cocokkan />
    </>
  );
}
