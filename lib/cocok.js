// Penemu produk dan penyusun rutinitas. Aturannya sederhana dan terbuka: tiap usulan disertai alasannya.
import { produk, cariProduk, cariKulit, cariTujuan, cariLangkah } from './data';
import { urutPakai, cariVarian, varianBotol, biayaPerBulan, lamaHabisHari } from './katalog';
import { awalHariWIB } from './format';

export const WAJAH = produk.filter((p) => p.langkah !== 'tubuh');

// jawaban = { kulit: 'kering'|'normal'|'kombinasi'|'berminyak'|'', peka: 'sering'|'kadang'|'jarang'|'', tujuan: [], ringkas: boolean }
export function skorProduk(p, j) {
  let nilai = 0;
  const alasan = [];
  const catatan = [];
  const kulit = cariKulit(j.kulit);
  if (kulit && p.kulit.cocok.includes(kulit.id)) {
    nilai += 2;
    alasan.push(`cocok untuk kulit ${kulit.nama.toLowerCase()}`);
  }
  if (kulit && p.kulit.hatiHati.includes(kulit.id)) {
    nilai -= 3;
    catatan.push(`Untuk kulit ${kulit.nama.toLowerCase()}, pakai lebih jarang atau hanya di area yang perlu.`);
  }
  for (const t of j.tujuan || []) {
    if (p.tujuan.includes(t)) {
      nilai += 3;
      alasan.push(`untuk ${cariTujuan(t).nama.toLowerCase()}`);
    }
  }
  if (j.peka === 'sering') {
    if (p.ramahPeka) {
      nilai += 1;
      alasan.push('ramah untuk kulit peka');
    } else {
      nilai -= 5;
      catatan.push('Bahan aktifnya bisa terasa perih di kulit yang sering bereaksi. Tunda dulu sampai rutinitas dasarmu nyaman.');
    }
  } else if (j.peka === 'kadang' && !p.ramahPeka) {
    nilai -= 1;
    catatan.push('Mulai pelan: dua kali seminggu, lalu naikkan bila kulit nyaman.');
  }
  return { nilai, alasan, catatan };
}

// Daftar produk wajah, diurutkan dari yang paling cocok.
export function hasilCocok(j) {
  return WAJAH.map((p) => ({ p, ...skorProduk(p, j) }))
    .sort((a, b) => b.nilai - a.nilai || urutPakai(a.p, b.p));
}

function terbaik(kandidat, j, saring = () => true) {
  const daftar = kandidat.filter(saring).map((p) => ({ p, ...skorProduk(p, j) }));
  daftar.sort((a, b) => b.nilai - a.nilai || a.p.terbit - b.p.terbit);
  return daftar[0] || null;
}

const dari = (id) => WAJAH.filter((p) => p.langkah === id);

// Usulan rutinitas dari jawaban penemu. Hasilnya { pagi: [slug], malam: [slug], ditunda: [slug] }.
export function usulRutinitas(j) {
  const peka = j.peka === 'sering';
  const tj = j.tujuan || [];
  const kering = j.kulit === 'kering';
  const pelembap = kering || peka || j.kulit === 'normal' ? cariProduk('krim-ceramide') : cariProduk('gel-pelembap-lidah-buaya');
  const pagi = ['gel-pembersih-pegagan'];
  const malam = [];

  if (!j.ringkas) pagi.push('esens-air-beras');
  // Serum pagi: vitamin C untuk kusam (kecuali kulit sering bereaksi), niasinamida untuk pori/komedo, hialuronat selain itu.
  let serumPagi = 'serum-hialuronat-2';
  if (tj.includes('kusam') && !peka) serumPagi = 'serum-vitamin-c-10';
  else if ((tj.includes('pori') || tj.includes('komedo')) && !kering) serumPagi = 'serum-niasinamida-5';
  if (!j.ringkas) pagi.push(serumPagi);
  pagi.push(pelembap.slug, 'tabir-surya-spf50');

  // Malam: balm pembersih dulu (karena pagi memakai tabir surya), lalu gel pembersih.
  if (!j.ringkas) malam.push('balm-pembersih-kelapa');
  malam.push('gel-pembersih-pegagan');
  const ditunda = [];
  let aktifMalam = null;
  if (tj.includes('garis-halus')) aktifMalam = 'serum-retinol-03';
  else if (tj.includes('komedo') || (tj.includes('pori') && j.kulit === 'berminyak')) aktifMalam = 'serum-bha-2';
  else if ((tj.includes('kusam') || tj.includes('kasar')) && !kering) aktifMalam = 'toner-aha-5';
  if (aktifMalam && peka) {
    ditunda.push(aktifMalam);
    aktifMalam = null;
  }
  if (aktifMalam === 'toner-aha-5') malam.push('toner-aha-5');
  else if (!j.ringkas) malam.push('esens-air-beras');
  if (aktifMalam && aktifMalam !== 'toner-aha-5') malam.push(aktifMalam);
  else {
    const serumMalam = (tj.includes('pori') || tj.includes('komedo') || tj.includes('kusam')) && !kering && !peka ? 'serum-niasinamida-5' : 'serum-hialuronat-2';
    malam.push(serumMalam);
  }
  malam.push(kering || peka ? 'krim-ceramide' : pelembap.slug);

  const urut = (arr) => [...new Set(arr)].map(cariProduk).filter(Boolean).sort(urutPakai).map((p) => p.slug);
  return { pagi: urut(pagi), malam: urut(malam), ditunda };
}

export function bolehDiWaktu(p, waktu) {
  return p.waktu.includes(waktu) && p.langkah !== 'tubuh';
}

export function urutkanRutinitas(daftar) {
  return [...new Set(daftar)].map(cariProduk).filter(Boolean).sort(urutPakai).map((p) => p.slug);
}

const kuat = (p) => p.eksfolian || p.retinoid;

// Pemeriksaan rutinitas: urutan, bahan yang bentrok, dan tabir surya.
export function periksaRutinitas(r, peka = false) {
  const pagi = (r.pagi || []).map(cariProduk).filter(Boolean);
  const malam = (r.malam || []).map(cariProduk).filter(Boolean);
  const pesan = [];
  const semua = [...pagi, ...malam];
  if (!semua.length) return pesan;

  const adaKuat = semua.some(kuat);
  if (pagi.length && !pagi.some((p) => p.langkah === 'lindungi')) {
    pesan.push({
      tingkat: 'penting',
      teks: adaKuat
        ? 'Pagi belum ada tabir surya, padahal rutinitas malammu berisi AHA, BHA, atau retinol yang membuat kulit lebih peka terhadap matahari.'
        : 'Pagi belum ada tabir surya. Tabir surya selalu jadi langkah terakhir di pagi hari.',
    });
  }
  if (!pagi.length && malam.some(kuat)) {
    pesan.push({ tingkat: 'penting', teks: 'Rutinitas pagi masih kosong. Dengan AHA, BHA, atau retinol di malam hari, setidaknya pakai tabir surya di pagi hari.' });
  }
  for (const [nama, daftar] of [['pagi', pagi], ['malam', malam]]) {
    if (daftar.length && !daftar.some((p) => p.langkah === 'bersihkan')) {
      pesan.push({ tingkat: 'saran', teks: `Rutinitas ${nama} belum diawali pembersih.` });
    }
    const serum = daftar.filter((p) => p.langkah === 'rawat');
    if (serum.length > 2) pesan.push({ tingkat: 'saran', teks: `Ada ${serum.length} serum di rutinitas ${nama}. Satu sampai dua sudah cukup; selebihnya jarang menambah manfaat.` });
    if (daftar.length && !daftar.some((p) => p.langkah === 'lembapkan')) pesan.push({ tingkat: 'saran', teks: `Rutinitas ${nama} belum ditutup pelembap.` });
  }
  const kuatMalam = malam.filter(kuat);
  if (kuatMalam.length > 1) {
    pesan.push({
      tingkat: 'info',
      teks: `${kuatMalam.map((p) => p.nama).join(' dan ')} sama-sama kuat. Keduanya tidak dipakai di malam yang sama: lihat jadwal 7 malam di bawah.`,
    });
  }
  if (peka && semua.some((p) => !p.ramahPeka)) {
    const nama = [...new Set(semua.filter((p) => !p.ramahPeka).map((p) => p.nama))];
    pesan.push({ tingkat: 'saran', teks: `Kulitmu mudah bereaksi. ${nama.join(', ')} sebaiknya dicoba belakangan, satu per satu, setelah uji tempel.` });
  }
  if (malam.some((p) => p.slug === 'balm-pembersih-kelapa') && !malam.some((p) => p.slug === 'gel-pembersih-pegagan')) {
    pesan.push({ tingkat: 'saran', teks: 'Balm pembersih paling baik dilanjutkan dengan gel pembersih supaya sisa minyaknya terangkat.' });
  }
  return pesan;
}

// Pola malam: bahan kuat bergantian dengan malam pemulihan (null). Eksfolian dulu, retinol sesudahnya.
function polaMalam(malam) {
  const aktif = malam
    .map(cariProduk)
    .filter(Boolean)
    .filter(kuat)
    .sort((a, b) => Number(Boolean(a.retinoid)) - Number(Boolean(b.retinoid)));
  if (!aktif.length) return null;
  return aktif.length === 1 ? [aktif[0].slug, null, null] : aktif.flatMap((p) => [p.slug, null]);
}

// Jadwal 7 malam mulai hari ini (WIB).
export function jadwalMalam(malam, sekarang) {
  const pola = polaMalam(malam);
  if (!pola) return null;
  const awal = awalHariWIB(sekarang) + 12 * 3600 * 1000;
  return Array.from({ length: 7 }, (_, i) => ({ ms: awal + i * 86400000, slug: pola[i % pola.length] }));
}

// Untuk tiap produk di rutinitas: berapa kali seminggu dipakai (pagi dan malam dijumlahkan).
export function pemakaianSeminggu(r) {
  const hasil = {};
  const tambah = (slug, n) => {
    hasil[slug] = (hasil[slug] || 0) + n;
  };
  for (const slug of r.pagi || []) {
    const p = cariProduk(slug);
    if (p) tambah(slug, p.kaliSeminggu && p.kaliSeminggu < 7 ? p.kaliSeminggu : 7);
  }
  const pola = polaMalam(r.malam || []);
  for (const slug of r.malam || []) {
    const p = cariProduk(slug);
    if (!p) continue;
    if (kuat(p) && pola) {
      let n = 0;
      for (let i = 0; i < 7; i++) if (pola[i % pola.length] === slug) n += 1;
      tambah(slug, n);
    } else tambah(slug, p.kaliSeminggu && p.kaliSeminggu < 7 ? p.kaliSeminggu : 7);
  }
  return hasil;
}

// Biaya rutinitas: harga beli semua produk sekali (botol terkecil), dan perkiraan biaya per bulan.
export function biayaRutinitas(r) {
  const kali = pemakaianSeminggu(r);
  let beli = 0;
  let perBulan = 0;
  const rinci = [];
  for (const slug of Object.keys(kali)) {
    const p = cariProduk(slug);
    const v = varianBotol(p).sort((a, b) => a.harga - b.harga)[0] || cariVarian(p);
    beli += v.harga;
    const b = biayaPerBulan(p, v, kali[slug]);
    if (b) perBulan += b;
    rinci.push({ p, v, kali: kali[slug], hari: lamaHabisHari(p, v, kali[slug]), perBulan: b });
  }
  return { beli, perBulan, rinci };
}

export function namaLangkah(p) {
  return cariLangkah(p.langkah)?.nama || '';
}
