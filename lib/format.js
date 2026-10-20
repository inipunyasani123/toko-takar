// Format angka, isi, berat, durasi, dan waktu. Semua waktu ditampilkan dalam WIB (Asia/Jakarta).

const angka = new Intl.NumberFormat('id-ID');
const desimal1 = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });
const desimal2 = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

export function rupiah(n) {
  return `Rp${angka.format(Math.round(n || 0))}`;
}

// "Rp27 rb", "Rp1,2 jt": untuk perkiraan, bukan harga.
export function rupiahRingkas(n) {
  const v = Math.round(n || 0);
  if (v >= 1000000) return `Rp${desimal1.format(v / 1000000)} jt`;
  if (v >= 1000) return `Rp${angka.format(Math.round(v / 1000))} rb`;
  return `Rp${v}`;
}

export function gram(g) {
  if (g >= 1000) return `${desimal2.format(g / 1000)} kg`;
  return `${angka.format(g)} g`;
}

export function isi(n, satuan = 'ml') {
  return `${desimal1.format(n)} ${satuan}`;
}

export function ml(n) {
  return `${desimal2.format(n)} ml`;
}

export function angkaId(n, maks = 1) {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: maks }).format(n);
}

// Durasi dari jumlah hari: "±3 minggu", "±4 bulan", "±1 tahun 2 bulan".
export function durasi(hari) {
  if (!Number.isFinite(hari) || hari <= 0) return '';
  if (hari < 13) return `±${Math.max(1, Math.round(hari))} hari`;
  if (hari < 119) return `±${Math.round(hari / 7)} minggu`;
  const bulan = Math.round(hari / 30.4);
  if (bulan < 12) return `±${bulan} bulan`;
  const th = Math.floor(bulan / 12);
  const sisa = bulan % 12;
  return sisa ? `±${th} tahun ${sisa} bulan` : `±${th} tahun`;
}

export const ZONA_WAKTU = 'Asia/Jakarta';

const fmtTanggalJam = new Intl.DateTimeFormat('id-ID', {
  timeZone: ZONA_WAKTU,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const fmtTanggal = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, weekday: 'long', day: 'numeric', month: 'long' });
const fmtTanggalTahun = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, day: 'numeric', month: 'long', year: 'numeric' });
const fmtTanggalPendek = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, day: 'numeric', month: 'short' });
const fmtHariPendek = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, weekday: 'short' });
const fmtHariPanjang = new Intl.DateTimeFormat('id-ID', { timeZone: ZONA_WAKTU, weekday: 'long' });
const fmtKunci = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_WAKTU, year: 'numeric', month: '2-digit', day: '2-digit' });

// "15 Okt 2026, 14.05 WIB"
export function waktuWIB(ms) {
  if (!ms) return '';
  return `${fmtTanggalJam.format(new Date(ms))} WIB`;
}

// "Kamis, 22 Oktober"
export function tanggalPanjang(ms) {
  return fmtTanggal.format(new Date(ms));
}

// "22 Oktober 2026"
export function tanggalTahun(ms) {
  return fmtTanggalTahun.format(new Date(ms));
}

export function tanggalPendek(ms) {
  return fmtTanggalPendek.format(new Date(ms));
}

export function hariPendek(ms) {
  return fmtHariPendek.format(new Date(ms));
}

export function hariPanjang(ms) {
  return fmtHariPanjang.format(new Date(ms));
}

// Kunci tanggal kalender WIB, mis. "2026-10-15".
export function kunciHariWIB(ms) {
  return fmtKunci.format(new Date(ms));
}

// Komponen tanggal WIB (tahun, bulan 1-12, hari, hari dalam minggu 0-6).
export function bagianWIB(ms) {
  const d = new Date(ms + 7 * 3600 * 1000);
  return { tahun: d.getUTCFullYear(), bulan: d.getUTCMonth() + 1, hari: d.getUTCDate(), hariMinggu: d.getUTCDay(), jam: d.getUTCHours() };
}

// Awal hari (00.00 WIB) untuk waktu tertentu, dalam milidetik UTC.
export function awalHariWIB(ms) {
  const { tahun, bulan, hari } = bagianWIB(ms);
  return Date.UTC(tahun, bulan - 1, hari) - 7 * 3600 * 1000;
}

export function sensorHP(hp) {
  const bersih = String(hp || '').replace(/\D/g, '');
  if (bersih.length < 6) return bersih;
  return `${bersih.slice(0, 4)}••••${bersih.slice(-4)}`;
}
