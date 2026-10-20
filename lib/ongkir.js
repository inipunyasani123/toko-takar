// Hitung ongkir dari tabel contoh tarif (zona × berat). Bukan tarif kurir sungguhan.
import { zonaOngkir, kemasanKirim } from './data';

export function zonaUntuk(namaProvinsi) {
  return zonaOngkir.find((z) => z.provinsi.includes(namaProvinsi)) || null;
}

export function beratKemasan(beratProduk) {
  if (!beratProduk) return 0;
  return Math.max(kemasanKirim.minimum, Math.round(beratProduk * kemasanKirim.persen));
}

export function hitungOngkir({ beratProduk, provinsi, layanan = 'reguler' }) {
  const kemas = beratKemasan(beratProduk);
  const total = beratProduk + kemas;
  if (layanan === 'ambil') {
    return { zona: null, beratProduk, beratKemasan: 0, beratTotal: beratProduk, kgTagih: 0, tersedia: true, perKg: 0, estimasi: 'Siap diambil di hari kerja berikutnya', ongkir: 0 };
  }
  const zona = zonaUntuk(provinsi);
  const kgTagih = Math.max(1, Math.ceil(total / 1000));
  const tarif = zona ? zona.layanan[layanan] : null;
  return {
    zona,
    beratProduk,
    beratKemasan: kemas,
    beratTotal: total,
    kgTagih,
    tersedia: Boolean(tarif),
    perKg: tarif ? tarif.perKg : 0,
    estimasi: tarif ? tarif.estimasi : '',
    ongkir: tarif ? kgTagih * tarif.perKg : 0,
  };
}
