// Fungsi murni untuk pesanan: kode, status, ringkasan penjualan, dan pesanan contoh.
import { site, statusPesanan, cariProduk } from './data';
import { cariVarian, labelVarian } from './katalog';
import { hitungOngkir, zonaUntuk } from './ongkir';
import { bagianWIB, awalHariWIB, kunciHariWIB } from './format';

export function indeksStatus(id) {
  return statusPesanan.findIndex((s) => s.id === id);
}

// Label status mengikuti cara kirim: "Dikirim" menjadi "Siap diambil" untuk pesanan ambil di toko.
export function labelStatus(id, layanan) {
  const s = statusPesanan.find((x) => x.id === id);
  if (!s) return id;
  return layanan === 'ambil' && s.labelAmbil ? s.labelAmbil : s.label;
}

export function ketStatus(id, layanan) {
  const s = statusPesanan.find((x) => x.id === id);
  if (!s) return '';
  return layanan === 'ambil' && s.ketAmbil ? s.ketAmbil : s.ket;
}

export function buatKode(nomor, ms) {
  const { tahun, bulan } = bagianWIB(ms);
  const yy = String(tahun).slice(-2);
  const mm = String(bulan).padStart(2, '0');
  return `${site.kodePesanan}-${yy}${mm}-${String(nomor).padStart(4, '0')}`;
}

export function normalKode(kode) {
  return String(kode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function waktuStatus(pesanan, statusId) {
  return pesanan.riwayat.find((r) => r.status === statusId)?.waktu || null;
}

// Pindah status. Maju beberapa langkah sekaligus: langkah yang dilewati ikut dicatat dengan waktu yang sama.
// Mundur: catatan sesudahnya dihapus.
export function terapkanStatus(pesanan, statusBaru, waktu) {
  const target = indeksStatus(statusBaru);
  if (target < 0) return pesanan;
  const riwayat = [];
  for (let i = 0; i <= target; i++) {
    const id = statusPesanan[i].id;
    const lama = pesanan.riwayat.find((r) => r.status === id);
    riwayat.push(lama || { status: id, waktu });
  }
  let resi = pesanan.resi;
  if (target >= indeksStatus('dikirim') && !resi && pesanan.kirim.layanan !== 'ambil') {
    resi = `CONTOH-${normalKode(pesanan.kode).slice(-8)}${pesanan.kirim.layanan === 'kilat' ? 'K' : 'R'}`;
  }
  if (target < indeksStatus('dikirim')) resi = null;
  return { ...pesanan, status: statusBaru, riwayat, resi };
}

export function hitungItem(slug, varianId, qty) {
  const p = cariProduk(slug);
  const v = cariVarian(p, varianId);
  return {
    slug,
    nama: p.nama,
    varian: v.id,
    label: labelVarian(p, v.id),
    isiUlang: Boolean(v.isiUlang),
    harga: v.harga,
    berat: v.berat,
    qty,
  };
}

export function rakitPesanan({ kode, dibuat, pembeli, items, layanan, metode, contoh = false }) {
  const subtotal = items.reduce((n, it) => n + it.harga * it.qty, 0);
  const beratProduk = items.reduce((n, it) => n + it.berat * it.qty, 0);
  const o = hitungOngkir({ beratProduk, provinsi: pembeli.provinsi, layanan });
  return {
    kode,
    dibuat,
    status: 'menunggu',
    riwayat: [{ status: 'menunggu', waktu: dibuat }],
    pembeli,
    items,
    kirim: {
      layanan,
      zona: o.zona?.id || null,
      zonaNama: o.zona ? `${o.zona.nama} · ${o.zona.cakupan}` : '',
      estimasi: o.estimasi,
      perKg: o.perKg,
      kgTagih: o.kgTagih,
      beratProduk,
      beratKemasan: o.beratKemasan,
      beratTotal: o.beratTotal,
      ongkir: o.ongkir,
    },
    bayar: { metode },
    subtotal,
    total: subtotal + o.ongkir,
    resi: null,
    contoh,
  };
}

// Penjualan dihitung dari pesanan yang sudah dibayar, per hari kalender WIB.
export function ringkasPenjualan(daftar, sekarang) {
  const iDibayar = indeksStatus('dibayar');
  const hariIni = awalHariWIB(sekarang);
  const hari = [];
  for (let i = 6; i >= 0; i--) {
    const awal = hariIni - i * 86400000;
    hari.push({ kunci: kunciHariWIB(awal + 3600000), awal, total: 0, jumlah: 0 });
  }
  const peta = Object.fromEntries(hari.map((h) => [h.kunci, h]));
  let menunggu = 0;
  let isiUlang = 0;
  for (const p of daftar) {
    if (indeksStatus(p.status) < iDibayar) {
      menunggu += 1;
      continue;
    }
    const t = waktuStatus(p, 'dibayar') || p.dibuat;
    const h = peta[kunciHariWIB(t)];
    if (h) {
      h.total += p.total;
      h.jumlah += 1;
      isiUlang += p.items.filter((it) => it.isiUlang).reduce((n, it) => n + it.qty, 0);
    }
  }
  const hariIniData = hari[hari.length - 1];
  return {
    hari,
    hariIni: { total: hariIniData.total, jumlah: hariIniData.jumlah },
    tujuhHari: { total: hari.reduce((n, h) => n + h.total, 0), jumlah: hari.reduce((n, h) => n + h.jumlah, 0) },
    menunggu,
    isiUlang,
  };
}

// Pesanan contoh, dibuat relatif terhadap waktu kunjungan pertama.
export const NOMOR_AWAL_CONTOH = 112;

export function pesananContoh(sekarang) {
  const hari = (n, jam, menit) => awalHariWIB(sekarang) - n * 86400000 + (jam * 60 + menit) * 60000;
  const menitLalu = (m) => sekarang - m * 60000;
  const rencana = [
    {
      dibuat: hari(8, 9, 41),
      pembeli: { nama: 'Laras Anjani', hp: '081200000217', provinsi: 'DKI Jakarta', kota: 'Jakarta Selatan', alamat: 'Jl. Kemuning No. 4 (alamat contoh)', kodePos: '12160' },
      items: [hitungItem('serum-niasinamida-5', '30-pipet', 1), hitungItem('gel-pembersih-pegagan', '200-isi-ulang', 1), hitungItem('tabir-surya-spf50', '50-tabung', 1)],
      layanan: 'reguler', metode: 'transfer',
      langkah: [['dibayar', hari(8, 10, 12)], ['dikemas', hari(8, 13, 30)], ['dikirim', hari(7, 10, 5)], ['selesai', hari(6, 15, 40)]],
    },
    {
      dibuat: hari(5, 20, 3),
      pembeli: { nama: 'Dimas Prasetyo', hp: '081300000328', provinsi: 'Jawa Timur', kota: 'Kota Malang', alamat: 'Jl. Teratai Barat No. 19 (alamat contoh)', kodePos: '65141' },
      items: [hitungItem('serum-bha-2', '30-pipet', 1), hitungItem('gel-pelembap-lidah-buaya', '50-jar', 1)],
      layanan: 'kilat', metode: 'qris',
      langkah: [['dibayar', hari(5, 20, 9)], ['dikemas', hari(4, 9, 50)], ['dikirim', hari(4, 15, 15)]],
    },
    {
      dibuat: hari(3, 11, 26),
      pembeli: { nama: 'Sekar Mayang', hp: '085700000439', provinsi: 'Jawa Barat', kota: 'Kota Bandung', alamat: 'Diambil di toko', kodePos: '40132' },
      items: [hitungItem('krim-ceramide', '50-isi-ulang', 1), hitungItem('esens-air-beras', '300-isi-ulang', 1)],
      layanan: 'ambil', metode: 'ewallet',
      langkah: [['dibayar', hari(3, 11, 40)], ['dikemas', hari(3, 14, 0)], ['dikirim', hari(2, 10, 0)]],
    },
    {
      dibuat: menitLalu(205),
      pembeli: { nama: 'Yohana Siregar', hp: '081100000540', provinsi: 'Sumatera Utara', kota: 'Kota Medan', alamat: 'Jl. Melur No. 27 (alamat contoh)', kodePos: '20112' },
      items: [hitungItem('serum-retinol-03', '15-pipet', 1), hitungItem('krim-ceramide', '50-jar', 1), hitungItem('balm-bibir-kemiri', '5-stik', 2)],
      layanan: 'reguler', metode: 'transfer',
      langkah: [['dibayar', menitLalu(170)]],
    },
    {
      dibuat: menitLalu(34),
      pembeli: { nama: 'Raka Wiratama', hp: '087800000651', provinsi: 'Bali', kota: 'Kota Denpasar', alamat: 'Jl. Kenari No. 8 (alamat contoh)', kodePos: '80225' },
      items: [hitungItem('sabun-batang-sereh', '3x100-batang', 1), hitungItem('losion-tubuh-kelapa', '500-isi-ulang', 1)],
      layanan: 'reguler', metode: 'qris',
      langkah: [],
    },
  ];
  return rencana.map((r, i) => {
    let p = rakitPesanan({
      kode: buatKode(NOMOR_AWAL_CONTOH + i, r.dibuat),
      dibuat: r.dibuat,
      pembeli: r.pembeli,
      items: r.items,
      layanan: r.layanan,
      metode: r.metode,
      contoh: true,
    });
    for (const [status, waktu] of r.langkah) p = terapkanStatus(p, status, waktu);
    return p;
  });
}

export function cocokkanHP(pesanan, empatDigit) {
  const hp = String(pesanan.pembeli.hp || '').replace(/\D/g, '');
  return hp.slice(-4) === String(empatDigit || '').replace(/\D/g, '');
}

export { zonaUntuk };
