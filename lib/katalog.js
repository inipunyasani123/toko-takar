// Logika katalog: varian, harga, stok (data dasar + perubahan admin), isi ulang, perkiraan habis, dan saringan.
import { produk, langkah, namaKemasan, cariProduk, cariLangkah, jenisKulit, tujuan as daftarTujuan } from './data';
import { isi } from './format';

export function cariVarian(p, id) {
  return p.varian.find((v) => v.id === id) || p.varian[0];
}

export function namaWadah(v) {
  if (v.jumlahIsi) return `isi ${v.jumlahIsi} batang`;
  return namaKemasan[v.kemasan] || v.kemasan;
}

// "30 ml · botol pipet kaca"
export function labelVarian(p, id) {
  const v = cariVarian(p, id);
  const ukuran = v.jumlahIsi ? `${v.jumlahIsi} × ${isi(v.ukuran / v.jumlahIsi, v.satuan)}` : isi(v.ukuran, v.satuan);
  return `${ukuran} · ${namaWadah(v)}`;
}

export function stokDasar(p, id) {
  return cariVarian(p, id)?.stok ?? 0;
}

// inventaris = { [slug]: { aktif?: boolean, stok?: { [idVarian]: number } } }
export function stokVarian(p, id, inventaris) {
  const ubah = inventaris?.[p.slug]?.stok?.[id];
  return typeof ubah === 'number' ? ubah : stokDasar(p, id);
}

export function produkAktif(p, inventaris) {
  const a = inventaris?.[p.slug]?.aktif;
  return a === undefined ? true : a;
}

export function totalStok(p, inventaris) {
  return p.varian.reduce((n, v) => n + stokVarian(p, v.id, inventaris), 0);
}

export function rentangHarga(p) {
  const h = p.varian.map((v) => v.harga);
  return { min: Math.min(...h), max: Math.max(...h) };
}

export function hargaTermurah(p) {
  return rentangHarga(p).min;
}

// Varian pertama yang masih ada stoknya. Botol didahulukan karena isi ulang butuh wadah.
export function varianAwal(p, inventaris) {
  const urut = [...p.varian].sort((a, b) => Number(Boolean(a.isiUlang)) - Number(Boolean(b.isiUlang)));
  return (urut.find((v) => stokVarian(p, v.id, inventaris) > 0) || urut[0]).id;
}

export function adaIsiUlang(p) {
  return p.varian.some((v) => v.isiUlang);
}

export function varianBotol(p) {
  return p.varian.filter((v) => !v.isiUlang);
}

// Selisih harga isi ulang dibanding membeli isi yang sama dalam botol baru (dihitung per ml dari botol terkecil).
export function hematIsiUlang(p) {
  const ulang = p.varian.find((v) => v.isiUlang);
  if (!ulang) return null;
  const botol = varianBotol(p).sort((a, b) => a.ukuran - b.ukuran)[0];
  const setara = (botol.harga / botol.ukuran) * ulang.ukuran;
  const hemat = Math.round(setara - ulang.harga);
  return {
    botol,
    ulang,
    perMlBotol: botol.harga / botol.ukuran,
    perMlUlang: ulang.harga / ulang.ukuran,
    hemat,
    persen: Math.round((hemat / setara) * 100),
  };
}

// Perkiraan berapa hari satu kemasan habis bila dipakai sesuai takaran.
export function lamaHabisHari(p, v, kaliSeminggu = p.kaliSeminggu) {
  if (!p.takaran?.ml || !kaliSeminggu) return null;
  const perHari = (p.takaran.ml * kaliSeminggu) / 7;
  return v.ukuran / perHari;
}

// Bandingkan perkiraan habis dengan PAO (batas pakai setelah dibuka).
export function cekPao(p, v, kaliSeminggu = p.kaliSeminggu) {
  const hari = lamaHabisHari(p, v, kaliSeminggu);
  if (hari === null) return null;
  const batas = p.pao * 30.4;
  return { hari, batas, lewat: hari > batas };
}

// Biaya per bulan untuk satu produk dengan varian tertentu.
export function biayaPerBulan(p, v, kaliSeminggu = p.kaliSeminggu) {
  const hari = lamaHabisHari(p, v, kaliSeminggu);
  if (!hari) return null;
  return (v.harga / hari) * 30.4;
}

export function urutPakai(a, b) {
  const na = langkah.findIndex((l) => l.id === a.langkah);
  const nb = langkah.findIndex((l) => l.id === b.langkah);
  if (na !== nb) return na - nb;
  // Dalam satu langkah: balm pembersih sebelum gel pembersih, lalu dari yang paling encer.
  if (a.langkah === 'bersihkan' && b.langkah === 'bersihkan') return (b.tekstur.kental || 0) - (a.tekstur.kental || 0);
  return (a.tekstur.kental || 0) - (b.tekstur.kental || 0);
}

export function hitungPerLangkah() {
  const hasil = {};
  for (const l of langkah) hasil[l.id] = produk.filter((p) => p.langkah === l.id).length;
  return hasil;
}

export function produkPerLangkah(id) {
  return produk.filter((p) => p.langkah === id).sort(urutPakai);
}

// Produk yang masuk akal dipakai sebelum dan sesudahnya di rutinitas.
export function produkTerkait(p, n = 4) {
  const wajah = p.langkah !== 'tubuh';
  const kandidat = produk.filter((x) => x.slug !== p.slug && (wajah ? x.langkah !== 'tubuh' : x.langkah === 'tubuh' || x.langkah === 'sesekali'));
  const skor = (x) => {
    let s = 0;
    if (x.langkah !== p.langkah) s += 3;
    if (x.waktu.some((w) => p.waktu.includes(w))) s += 2;
    if (x.kulit.cocok.some((k) => p.kulit.cocok.includes(k))) s += 1;
    if (x.tujuan.some((t) => p.tujuan.includes(t))) s += 1;
    if ((p.eksfolian || p.retinoid) && (x.eksfolian || x.retinoid)) s -= 6;
    if ((p.eksfolian || p.retinoid) && x.langkah === 'lindungi') s += 3;
    if ((p.eksfolian || p.retinoid) && x.ramahPeka && x.langkah === 'lembapkan') s += 2;
    return s;
  };
  return [...kandidat].sort((a, b) => skor(b) - skor(a) || urutPakai(a, b)).slice(0, n).sort(urutPakai);
}

export const rentangFilter = [
  { id: 'bawah-75', label: 'Di bawah Rp75.000', min: 0, max: 74999 },
  { id: '75-100', label: 'Rp75.000–Rp100.000', min: 75000, max: 100000 },
  { id: 'atas-100', label: 'Di atas Rp100.000', min: 100001, max: Infinity },
];

export const urutan = [
  { id: 'langkah', label: 'Urutan pakai' },
  { id: 'termurah', label: 'Harga terendah' },
  { id: 'termahal', label: 'Harga tertinggi' },
  { id: 'terbaru', label: 'Paling baru' },
  { id: 'nama', label: 'Nama A–Z' },
];

function normal(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// filter = { q, langkah: [], kulit: '', tujuan: [], waktu: '', isiUlang: false, peka: false, harga: '', urut: '' }
export function saringProduk(daftar, filter, inventaris) {
  const kata = normal(filter.q).split(/\s+/).filter(Boolean);
  const rentang = rentangFilter.find((r) => r.id === filter.harga);
  let hasil = daftar.filter((p) => {
    if (!produkAktif(p, inventaris)) return false;
    if (filter.langkah?.length && !filter.langkah.includes(p.langkah)) return false;
    if (filter.kulit && !p.kulit.cocok.includes(filter.kulit)) return false;
    if (filter.tujuan?.length && !filter.tujuan.some((t) => p.tujuan.includes(t))) return false;
    if (filter.waktu && !p.waktu.includes(filter.waktu)) return false;
    if (filter.isiUlang && !adaIsiUlang(p)) return false;
    if (filter.peka && !p.ramahPeka) return false;
    if (rentang) {
      const { min, max } = rentangHarga(p);
      if (max < rentang.min || min > rentang.max) return false;
    }
    if (kata.length) {
      const l = cariLangkah(p.langkah);
      const teks = normal([p.nama, p.ringkas, l?.jenis, l?.nama, ...p.inci, ...p.aktif.map((a) => a.bahan.replace(/-/g, ' '))].join(' '));
      if (!kata.every((k) => teks.includes(k))) return false;
    }
    return true;
  });
  const urut = filter.urut || 'langkah';
  hasil = [...hasil].sort((a, b) => {
    if (urut === 'termurah') return hargaTermurah(a) - hargaTermurah(b);
    if (urut === 'termahal') return rentangHarga(b).max - rentangHarga(a).max;
    if (urut === 'terbaru') return b.terbit - a.terbit;
    if (urut === 'nama') return a.nama.localeCompare(b.nama, 'id');
    return urutPakai(a, b);
  });
  return hasil;
}

export const opsiKulit = jenisKulit;
export const opsiTujuan = daftarTujuan;
export { cariProduk };
