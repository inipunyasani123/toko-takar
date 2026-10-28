# Sumber foto

Semua foto berlisensi CC0 1.0 (domain publik), dicari lewat [Openverse](https://openverse.org), dipotong 4:3, nadanya diseragamkan
sedikit (saturasi dan gamma), lalu dikonversi ke WebP. Tidak ada wajah yang dikenali dan tidak ada merek yang terbaca.
Olesan tekstur, logo, dan `public/og.jpg` digambar sendiri (SVG). Foto kemasan di `public/images/kemasan/` (tanpa merek atau label nyata, tanpa wajah) dipotong 4:5; label Takar ditempel di atasnya lewat CSS di `components/Kemasan.js`.

| Berkas | Judul / keterangan asli | Pembuat | Sumber | Lisensi |
| --- | --- | --- | --- | --- |
| `bahan-pegagan.webp` | Centella asiatica | 葉子 | [iNaturalist 177020556](https://www.inaturalist.org/photos/177020556) | CC0 1.0 |
| `bahan-teh.webp` | A top-down close-up of bright green tea leaves | Diganta Sarkar | [WordPress Photo Directory](https://wordpress.org/photos/photo/70669bba3d/) | CC0 1.0 |
| `bahan-beras.webp` | Short white rice grains are displayed in bulk | Bigul Malayi | [WordPress Photo Directory](https://wordpress.org/photos/photo/37069274da/) | CC0 1.0 |
| `bahan-lidah-buaya.webp` | Top view of an aloe vera plant with thick, pointed leaves | Jhilian Rosario Seja | [WordPress Photo Directory](https://wordpress.org/photos/photo/9406a1d8e6/) | CC0 1.0 |
| `bahan-kelapa.webp` | A person's hand holding two halves of a freshly cracked coconut | Midhun P | [WordPress Photo Directory](https://wordpress.org/photos/photo/88867aa350/) | CC0 1.0 |
| `bahan-kemiri.webp` | Candlenuts (Aleurites moluccana) shelled & unshelled | David E Mead | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Candlenuts_(Aleurites_moluccana)_shelled_%26_unshelled.jpg) | CC0 1.0 |

## Foto kemasan (`public/images/kemasan/`)

Satu foto per produk (per varian bila wadahnya beda; pemetaan di `FOTO` pada `components/Kemasan.js`). Tidak ada merek atau label nyata dan tidak ada wajah; label Takar ditempel di atasnya lewat HTML. Enam foto asli CC0/PD dari Wikimedia Commons (foto pendekatan, bukan botol Takar persis), sisanya gambar AI (Google Gemini) karena foto CC0 polos untuk kantong isi ulang, pod, stik, dan botol sejenis tidak ditemukan.

### Foto asli (CC0 1.0 / domain publik)

| Berkas | Dipakai untuk | Judul / keterangan asli | Pembuat | Sumber | Lisensi |
| --- | --- | --- | --- | --- | --- |
| `pipet-1.jpg` | Serum Niasinamida 5% | A serum made (botol pipet kosong bertutup hitam) | Jahra Tasfia Reza | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:A_serum_made.jpg) | CC0 1.0 |
| `pipet-2.jpg` | Serum Hialuronat 2% | A dropper sucking serum | Jahra Tasfia Reza | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:A_dropper_sucking_serum.jpg) | CC0 1.0 |
| `pompa.jpg` | Gel Pembersih Pegagan (botol pompa) | Pexels-pixabay-433624 | congerdesign | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pexels-pixabay-433624.jpg) | CC0 1.0 |
| `tabung.jpg` | Tabir Surya SPF 50 | Woman applying cream to hand (tabung krim biru polos, hanya tangan) | Moose Photos (Pexels) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Woman_applying_cream_to_hand.jpg) | CC0 1.0 |
| `jar.jpg` | Balm Pembersih Kelapa | Crème (toples krim putih polos, hanya tangan) | tidak dicantumkan | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cr%C3%A8me.jpg) | CC0 1.0 |
| `sabun.jpg` | Sabun Batang Sereh | Pexels-pixabay-206299 | Couleur | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pexels-pixabay-206299.jpg) | CC0 1.0 |

### Gambar AI (Google Gemini)

Dibuat 28 Okt 2026 dengan perintah foto produk realistis, kemasan polos tanpa tulisan atau merek, latar netral, cahaya lembut. Dipotong 4:5. Bukan foto sungguhan.

| Berkas | Dipakai untuk |
| --- | --- |
| `ai-pouch-gel.jpg` | Gel Pembersih Pegagan 200 ml isi ulang (kantong) |
| `ai-botol-esens.jpg`, `ai-pouch-esens.jpg` | Esens Air Beras: botol 150 ml dan kantong 300 ml |
| `ai-botol-toner.jpg`, `ai-pouch-toner.jpg` | Toner AHA 5%: botol 100 ml dan kantong 200 ml |
| `ai-pipet-vitc.jpg` | Serum Vitamin C 10% |
| `ai-pipet-bha.jpg` | Serum BHA 2% |
| `ai-pipet-retinol.jpg` | Serum Retinol 0,3% |
| `ai-jar-aloe.jpg`, `ai-pouch-aloe.jpg` | Gel Pelembap Lidah Buaya: toples dan kantong |
| `ai-jar-ceramide.jpg`, `ai-pod.jpg` | Krim Ceramide: toples dan pod isi ulang |
| `ai-jar-kaolin.jpg` | Masker Lempung Kaolin |
| `ai-balm-bibir.jpg` | Balm Bibir Kemiri (stik) |
| `ai-pompa-losion.jpg`, `ai-pouch-losion.jpg` | Losion Tubuh Kelapa: botol pompa dan kantong 500 ml |
