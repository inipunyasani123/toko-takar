// Semua isi toko demo Takar ada di sini. Takar adalah toko fiktif.
// Produk, kadar, harga, stok, tarif ongkir, dan kebijakan di bawah ini contoh untuk demo.
// Kandungan (INCI) disusun menyerupai formula sungguhan, tetapi tidak pernah diuji laboratorium.

export const site = {
  nama: 'Takar',
  slug: 'takar',
  url: 'https://toko-takar.pintuweb.id',
  judul: 'Takar · Perawatan kulit berkadar jelas',
  tagline: 'Perawatan kulit berkadar jelas, takaran pakainya jujur',
  deskripsi:
    'Serum, pelembap, dan tabir surya dengan kadar bahan tertulis, takaran pakai yang jelas, dan kemasan isi ulang. Toko online demo buatan PintuWeb.',
  kota: 'Bandung',
  kodePesanan: 'TKR',
  jamLayanan: 'Senin–Jumat, 09.00–17.00 WIB',
  jamToko: 'Senin–Sabtu, 10.00–18.00 WIB',
  alamatToko: 'Jl. Contoh Takaran No. 7, Coblong, Bandung (alamat contoh)',
  batasKemas: '13.00 WIB',
  batasBayarJam: 24,
};

export const nav = [
  { href: '/produk', label: 'Produk' },
  { href: '/cocokkan', label: 'Cocokkan' },
  { href: '/rutinitas', label: 'Rutinitas' },
  { href: '/kandungan', label: 'Kamus kandungan' },
  { href: '/isi-ulang', label: 'Isi ulang' },
];

// Langkah pakai. `no` = urutan di rutinitas harian; warna dipakai di tutup kemasan dan penanda langkah.
export const langkah = [
  { id: 'bersihkan', no: 1, nama: 'Bersihkan', jenis: 'Pembersih', ringkas: 'Mengangkat minyak, keringat, dan tabir surya.', warna: '#9fcde2', muda: '#e2eff5', tua: '#2c6680' },
  { id: 'seimbangkan', no: 2, nama: 'Seimbangkan', jenis: 'Toner & esens', ringkas: 'Lapisan cair pertama setelah cuci muka.', warna: '#b3dcc6', muda: '#e2f0e7', tua: '#2f6b4c' },
  { id: 'rawat', no: 3, nama: 'Rawat', jenis: 'Serum', ringkas: 'Bahan aktif dengan kadar yang tertulis.', warna: '#f3bf3a', muda: '#fbf0cd', tua: '#7a5300' },
  { id: 'lembapkan', no: 4, nama: 'Lembapkan', jenis: 'Pelembap', ringkas: 'Menahan air supaya tidak cepat menguap.', warna: '#f2b2a6', muda: '#fbe8e3', tua: '#93402f' },
  { id: 'lindungi', no: 5, nama: 'Lindungi', jenis: 'Tabir surya', ringkas: 'Langkah terakhir setiap pagi.', warna: '#f39a5e', muda: '#fde8da', tua: '#8f3d0c' },
  { id: 'sesekali', no: null, nama: 'Sesekali', jenis: 'Masker & bibir', ringkas: 'Di luar rutinitas harian.', warna: '#c9bce3', muda: '#ede8f6', tua: '#55457d' },
  { id: 'tubuh', no: null, nama: 'Tubuh', jenis: 'Sabun & losion', ringkas: 'Untuk badan, bukan wajah.', warna: '#d3da8f', muda: '#eff2d8', tua: '#56601b' },
];

export const jenisKulit = [
  { id: 'kering', nama: 'Kering', ciri: 'Terasa kencang atau bersisik beberapa jam setelah cuci muka.' },
  { id: 'normal', nama: 'Normal', ciri: 'Nyaman: tidak terasa kering dan tidak mengilap berlebihan.' },
  { id: 'kombinasi', nama: 'Kombinasi', ciri: 'Mengilap di dahi, hidung, dan dagu, tetapi pipi normal atau kering.' },
  { id: 'berminyak', nama: 'Berminyak', ciri: 'Mengilap di hampir seluruh wajah menjelang siang.' },
];

export const tujuan = [
  { id: 'kusam', nama: 'Kusam & warna tak rata' },
  { id: 'pori', nama: 'Pori & minyak' },
  { id: 'komedo', nama: 'Komedo' },
  { id: 'kasar', nama: 'Kering & kasar' },
  { id: 'kemerahan', nama: 'Mudah kemerahan' },
  { id: 'garis-halus', nama: 'Garis halus' },
];

export const waktuPakai = [
  { id: 'pagi', nama: 'Pagi' },
  { id: 'malam', nama: 'Malam' },
];

// Skala kekentalan 1–6, dipakai untuk urutan pakai: dari yang paling encer ke yang paling kental.
export const skalaKental = [
  { n: 1, nama: 'Cair', contoh: 'seperti air' },
  { n: 2, nama: 'Serum', contoh: 'sedikit licin' },
  { n: 3, nama: 'Gel', contoh: 'bening, bisa dicolek' },
  { n: 4, nama: 'Losion & minyak', contoh: 'mudah diratakan' },
  { n: 5, nama: 'Krim', contoh: 'kental, tidak menetes' },
  { n: 6, nama: 'Balm & pasta', contoh: 'padat atau sangat kental' },
];

export const namaKemasan = {
  pipet: 'botol pipet kaca',
  'pipet-amber': 'botol pipet kaca cokelat',
  pompa: 'botol pompa',
  botol: 'botol kaca bertutup',
  tabung: 'tabung',
  jar: 'jar kaca',
  stik: 'tabung kertas',
  batang: 'batang berbungkus kertas',
  kantong: 'kantong isi ulang',
  pod: 'wadah dalam isi ulang',
};

// takaran.ml = isi yang dipakai sekali oles; kaliSeminggu = pemakaian wajar per minggu (untuk perkiraan habis).
// varian[].kemasan: bentuk wadah (lihat namaKemasan). isiUlang: true untuk kantong/wadah dalam.
export const produk = [
  {
    slug: 'gel-pembersih-pegagan',
    nama: 'Gel Pembersih Pegagan',
    langkah: 'bersihkan',
    label: { nama: ['Gel', 'Pembersih'], sub: 'Pegagan' },
    ringkas: 'Gel pembersih berbusa tipis untuk pagi dan malam, ramah untuk kulit yang mudah kemerahan.',
    deskripsi:
      'Memakai surfaktan dari asam amino dan kelapa yang lembut, ditambah ekstrak pegagan dan pantenol. pH-nya sekitar 5,5, dekat dengan pH permukaan kulit, jadi wajah terasa bersih tanpa rasa ketarik.',
    aktif: [{ bahan: 'pegagan', kadar: null }, { bahan: 'pantenol', kadar: '1%' }],
    inci: ['Aqua', 'Sodium Cocoyl Glycinate', 'Cocamidopropyl Betaine', 'Glycerin', 'Coco-Glucoside', 'Centella Asiatica Extract', 'Panthenol', 'Allantoin', 'Xanthan Gum', 'Citric Acid', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '5,5',
    pao: 12,
    tekstur: { jenis: 'Gel bening', kental: 3, warna: '#d6eadb', bening: 0.75, kilap: 0.7, rasa: 'Gel bening kehijauan yang berbusa tipis saat diusap dengan air.' },
    aroma: 'Tanpa pewangi tambahan. Bau samar bahan dasarnya.',
    waktu: ['pagi', 'malam'],
    frekuensi: 'Pagi dan malam',
    kaliSeminggu: 14,
    takaran: { ml: 1, label: '1 pompa', ikon: 'pompa', n: 1 },
    caraPakai: [
      'Basahi wajah dengan air biasa.',
      'Usap satu pompa di telapak tangan sampai berbusa tipis, lalu pijat ke wajah selama 30–60 detik.',
      'Bilas sampai bersih dan keringkan dengan menepuk handuk.',
    ],
    perhatian: ['Hindari area mata. Bila masuk ke mata, bilas dengan air.'],
    kulit: { cocok: ['kering', 'normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: true,
    tanpaPewangi: true,
    tujuan: ['kemerahan'],
    varian: [
      { id: '100-pompa', ukuran: 100, satuan: 'ml', kemasan: 'pompa', harga: 69000, berat: 210, stok: 26 },
      { id: '200-isi-ulang', ukuran: 200, satuan: 'ml', kemasan: 'kantong', isiUlang: true, harga: 99000, berat: 225, stok: 14 },
    ],
    terbit: 3,
  },
  {
    slug: 'balm-pembersih-kelapa',
    nama: 'Balm Pembersih Kelapa',
    langkah: 'bersihkan',
    label: { nama: ['Balm', 'Pembersih'], sub: 'Kelapa' },
    ringkas: 'Balm yang mencair jadi minyak untuk melarutkan tabir surya di malam hari, sebelum gel pembersih.',
    deskripsi:
      'Padat di dalam jar, meleleh saat digosok di telapak, lalu berubah menjadi cairan seperti susu ketika terkena air sehingga mudah dibilas. Tidak mengandung air, jadi tidak memerlukan pengawet. Sendok kecil disertakan supaya isi jar tetap kering.',
    aktif: [{ bahan: 'trigliserida', kadar: null }, { bahan: 'minyak-kelapa', kadar: null }],
    inci: ['Caprylic/Capric Triglyceride', 'Helianthus Annuus Seed Oil', 'Polyglyceryl-4 Oleate', 'Butyrospermum Parkii Butter', 'Euphorbia Cerifera Wax', 'Cocos Nucifera Oil', 'Tocopherol'],
    ph: null,
    pao: 12,
    tekstur: { jenis: 'Balm', kental: 6, warna: '#f2e6c6', bening: 0.12, kilap: 0.45, rasa: 'Padat seperti mentega saat dingin, mencair jadi minyak di telapak, lalu menjadi susu saat dibilas.' },
    aroma: 'Tanpa pewangi tambahan. Bau samar minyak kelapa.',
    waktu: ['malam'],
    frekuensi: 'Malam, sebagai pembersih pertama',
    kaliSeminggu: 7,
    takaran: { ml: 1.5, label: 'seukuran kacang almond', ikon: 'almond', n: 1 },
    caraPakai: [
      'Ambil seukuran kacang almond dengan sendok kecil, gosok di telapak tangan yang kering.',
      'Pijat ke wajah yang kering selama satu menit sampai tabir surya dan riasan larut.',
      'Basahi tangan, pijat lagi sampai berubah seperti susu, lalu bilas. Lanjutkan dengan gel pembersih.',
    ],
    perhatian: ['Jangan memasukkan jari yang basah ke dalam jar.'],
    kulit: { cocok: ['kering', 'normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: true,
    tanpaPewangi: true,
    tujuan: [],
    varian: [
      { id: '50-jar', ukuran: 50, satuan: 'g', kemasan: 'jar', harga: 89000, berat: 190, stok: 12 },
      { id: '100-jar', ukuran: 100, satuan: 'g', kemasan: 'jar', harga: 149000, berat: 290, stok: 5 },
    ],
    terbit: 9,
  },
  {
    slug: 'esens-air-beras',
    nama: 'Esens Air Beras',
    langkah: 'seimbangkan',
    label: { nama: ['Esens', 'Air Beras'], sub: null },
    ringkas: 'Esens cair dari filtrat fermentasi beras untuk lapisan pertama yang melembapkan.',
    deskripsi:
      'Lebih dari separuh isinya filtrat fermentasi beras, ditambah gliserin, pantenol, dan natrium hialuronat. Cair seperti air dan sedikit keruh. Cocok jadi lapisan pertama sebelum serum, terutama kalau kulitmu terasa kering setelah cuci muka.',
    aktif: [{ bahan: 'fermentasi-beras', kadar: '60%' }, { bahan: 'asam-hialuronat', kadar: null }],
    inci: ['Saccharomyces/Rice Ferment Filtrate', 'Aqua', 'Glycerin', 'Butylene Glycol', 'Panthenol', 'Sodium Hyaluronate', 'Allantoin', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '5,0',
    pao: 12,
    tekstur: { jenis: 'Cair', kental: 1, warna: '#efece2', bening: 0.55, kilap: 0.4, rasa: 'Cair seperti air, sedikit keruh seperti air cucian beras.' },
    aroma: 'Tanpa pewangi tambahan. Bau samar seperti tapai, dari hasil fermentasinya.',
    waktu: ['pagi', 'malam'],
    frekuensi: 'Pagi dan malam',
    kaliSeminggu: 14,
    takaran: { ml: 1, label: '±1 ml di telapak', ikon: 'telapak', n: 1 },
    caraPakai: [
      'Setelah cuci muka, tuang sekitar 1 ml ke telapak tangan.',
      'Tepuk-tepuk ke wajah sampai terserap. Boleh diulang sekali lagi kalau kulit terasa kering.',
      'Lanjutkan dengan serum selagi kulit masih sedikit lembap.',
    ],
    perhatian: [],
    kulit: { cocok: ['kering', 'normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: true,
    tanpaPewangi: true,
    tujuan: ['kasar', 'kusam'],
    varian: [
      { id: '150-botol', ukuran: 150, satuan: 'ml', kemasan: 'botol', harga: 79000, berat: 290, stok: 18 },
      { id: '300-isi-ulang', ukuran: 300, satuan: 'ml', kemasan: 'kantong', isiUlang: true, harga: 119000, berat: 320, stok: 9 },
    ],
    terbit: 6,
  },
  {
    slug: 'toner-aha-5',
    nama: 'Toner AHA 5%',
    langkah: 'seimbangkan',
    label: { nama: ['Toner AHA'], sub: 'Glikolat + laktat', angka: '5%' },
    ringkas: 'Toner eksfoliasi asam glikolat 4% dan asam laktat 1% untuk dipakai dua sampai tiga malam seminggu.',
    deskripsi:
      'Dua asam alfa hidroksi (AHA) dengan total kadar 5% pada pH sekitar 3,8. Melonggarkan ikatan sel kulit mati di permukaan sehingga lebih mudah luruh. Bukan untuk dipakai setiap hari, dan bukan untuk kulit yang sedang iritasi.',
    aktif: [{ bahan: 'asam-glikolat', kadar: '4%' }, { bahan: 'asam-laktat', kadar: '1%' }],
    inci: ['Aqua', 'Glycolic Acid', 'Glycerin', 'Lactic Acid', 'Aloe Barbadensis Leaf Juice', 'Sodium Hydroxide', 'Panthenol', 'Allantoin', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '3,8',
    pao: 12,
    tekstur: { jenis: 'Cair', kental: 1, warna: '#f5e4e8', bening: 0.9, kilap: 0.5, rasa: 'Bening dan cair. Bisa terasa geli atau hangat sebentar di menit pertama.' },
    aroma: 'Tanpa pewangi tambahan.',
    waktu: ['malam'],
    frekuensi: '2–3 malam seminggu',
    kaliSeminggu: 3,
    takaran: { ml: 1, label: '±1 ml di kapas', ikon: 'kapas', n: 1 },
    caraPakai: [
      'Pakai di malam hari setelah cuci muka, pada kulit yang kering.',
      'Basahi kapas dengan sekitar 1 ml, usap ke wajah. Hindari area mata dan sudut hidung.',
      'Jangan dibilas. Tunggu dua menit, lalu lanjutkan dengan serum yang menenangkan dan pelembap.',
    ],
    perhatian: [
      'Membuat kulit lebih peka terhadap sinar matahari. Pakai tabir surya setiap pagi, termasuk seminggu setelah berhenti memakai.',
      'Jangan dipakai di malam yang sama dengan retinol atau BHA bila kamu baru mulai.',
      'Hentikan bila perih tidak hilang setelah beberapa menit.',
    ],
    kulit: { cocok: ['normal', 'kombinasi', 'berminyak'], hatiHati: ['kering'] },
    ramahPeka: false,
    tanpaPewangi: true,
    tujuan: ['kusam', 'kasar'],
    eksfolian: true,
    varian: [
      { id: '100-botol', ukuran: 100, satuan: 'ml', kemasan: 'botol', harga: 85000, berat: 220, stok: 15 },
      { id: '200-isi-ulang', ukuran: 200, satuan: 'ml', kemasan: 'kantong', isiUlang: true, harga: 125000, berat: 225, stok: 6 },
    ],
    terbit: 11,
  },
  {
    slug: 'serum-niasinamida-5',
    nama: 'Serum Niasinamida 5%',
    langkah: 'rawat',
    label: { nama: ['Niasinamida'], sub: '+ zinc PCA 1%', angka: '5%' },
    ringkas: 'Serum niasinamida 5% dan zinc PCA 1% yang ringan, untuk pagi dan malam.',
    deskripsi:
      'Niasinamida adalah bentuk vitamin B3 yang larut air dan sering dipilih untuk kulit berminyak dan warna kulit yang tidak rata. Kami memakai kadar 5%, bukan 10%, karena kadar yang lebih tinggi lebih sering membuat kulit terasa hangat atau kemerahan.',
    aktif: [{ bahan: 'niasinamida', kadar: '5%' }, { bahan: 'zinc-pca', kadar: '1%' }],
    inci: ['Aqua', 'Niacinamide', 'Glycerin', 'Zinc PCA', 'Butylene Glycol', 'Sodium Hyaluronate', 'Panthenol', 'Xanthan Gum', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '6,0',
    pao: 12,
    tekstur: { jenis: 'Serum cair', kental: 2, warna: '#e4edf3', bening: 0.85, kilap: 0.6, rasa: 'Bening, sedikit licin, meresap dalam sekitar satu menit.' },
    aroma: 'Tanpa pewangi tambahan.',
    waktu: ['pagi', 'malam'],
    frekuensi: 'Pagi dan malam',
    kaliSeminggu: 14,
    takaran: { ml: 0.15, label: '3 tetes', ikon: 'tetes', n: 3 },
    caraPakai: [
      'Pakai setelah toner atau esens, pada kulit yang masih sedikit lembap.',
      'Teteskan 3 tetes ke telapak tangan, lalu tepuk merata ke seluruh wajah.',
      'Tunggu sekitar satu menit sebelum pelembap.',
    ],
    perhatian: ['Bila kulit terasa hangat atau kemerahan, pakai sekali sehari dulu.'],
    kulit: { cocok: ['normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: true,
    tanpaPewangi: true,
    tujuan: ['pori', 'kusam', 'komedo'],
    varian: [
      { id: '30-pipet', ukuran: 30, satuan: 'ml', kemasan: 'pipet', harga: 89000, berat: 130, stok: 31 },
      { id: '50-pipet', ukuran: 50, satuan: 'ml', kemasan: 'pipet', harga: 129000, berat: 175, stok: 8 },
    ],
    terbit: 1,
  },
  {
    slug: 'serum-vitamin-c-10',
    nama: 'Serum Vitamin C 10%',
    langkah: 'rawat',
    label: { nama: ['Vitamin C'], sub: 'Etil askorbat', angka: '10%' },
    ringkas: 'Serum antioksidan dengan 10% etil asam askorbat dan ekstrak teh hijau, untuk pagi hari sebelum tabir surya.',
    deskripsi:
      'Memakai 3-O-etil asam askorbat, turunan vitamin C yang lebih stabil daripada asam askorbat murni. Tetap saja vitamin C mudah teroksidasi setelah botol dibuka, jadi kami menjualnya dalam botol kaca cokelat berukuran kecil dan tidak menyediakan isi ulang.',
    aktif: [{ bahan: 'etil-askorbat', kadar: '10%' }, { bahan: 'teh-hijau', kadar: null }],
    inci: ['Aqua', '3-O-Ethyl Ascorbic Acid', 'Propanediol', 'Glycerin', 'Camellia Sinensis Leaf Extract', 'Sodium Hyaluronate', 'Xanthan Gum', 'Citric Acid', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '5,0',
    pao: 3,
    tekstur: { jenis: 'Serum cair', kental: 2, warna: '#f6e9b6', bening: 0.8, kilap: 0.6, rasa: 'Bening kekuningan dan ringan. Bisa terasa geli sebentar.' },
    aroma: 'Tanpa pewangi tambahan.',
    waktu: ['pagi'],
    frekuensi: 'Setiap pagi',
    kaliSeminggu: 7,
    takaran: { ml: 0.25, label: '5 tetes', ikon: 'tetes', n: 5 },
    caraPakai: [
      'Pakai di pagi hari setelah toner atau esens.',
      'Teteskan 5 tetes ke ujung jari, ratakan ke wajah dan leher.',
      'Tunggu satu menit, lanjutkan dengan pelembap lalu tabir surya.',
    ],
    perhatian: [
      'Simpan tertutup rapat di tempat sejuk. Warna yang berubah menjadi cokelat tua tanda formula sudah teroksidasi.',
      'Habiskan dalam 3 bulan setelah dibuka.',
    ],
    kulit: { cocok: ['kering', 'normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: false,
    tanpaPewangi: true,
    tujuan: ['kusam'],
    varian: [
      { id: '20-pipet', ukuran: 20, satuan: 'ml', kemasan: 'pipet-amber', harga: 99000, berat: 110, stok: 14 },
      { id: '30-pipet', ukuran: 30, satuan: 'ml', kemasan: 'pipet-amber', harga: 139000, berat: 130, stok: 3 },
    ],
    terbit: 7,
  },
  {
    slug: 'serum-hialuronat-2',
    nama: 'Serum Hialuronat 2%',
    langkah: 'rawat',
    label: { nama: ['Hialuronat'], sub: '+ pantenol', angka: '2%' },
    ringkas: 'Serum pelembap dengan kompleks hialuronat 2% dan pantenol, ramah untuk kulit peka.',
    deskripsi:
      'Angka 2% adalah kadar larutan kompleks hialuronat dengan dua ukuran molekul, bukan 2% bubuk hialuronat murni. Molekul besar terasa licin di permukaan, yang terhidrolisis lebih ringan. Paling terasa bedanya bila dipakai di kulit yang masih lembap lalu ditutup pelembap.',
    aktif: [{ bahan: 'asam-hialuronat', kadar: '2%' }, { bahan: 'pantenol', kadar: '1%' }],
    inci: ['Aqua', 'Glycerin', 'Sodium Hyaluronate', 'Panthenol', 'Hydrolyzed Hyaluronic Acid', 'Allantoin', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '6,0',
    pao: 12,
    tekstur: { jenis: 'Serum gel', kental: 2, warna: '#e0ecf2', bening: 0.92, kilap: 0.85, rasa: 'Licin seperti gel encer dan terasa sejuk.' },
    aroma: 'Tanpa pewangi tambahan.',
    waktu: ['pagi', 'malam'],
    frekuensi: 'Pagi dan malam',
    kaliSeminggu: 14,
    takaran: { ml: 0.15, label: '3 tetes', ikon: 'tetes', n: 3 },
    caraPakai: [
      'Pakai pada kulit yang masih lembap, setelah esens atau setelah membasuh wajah dengan air.',
      'Tepuk 3 tetes ke wajah.',
      'Langsung tutup dengan pelembap supaya air yang ditahannya tidak menguap.',
    ],
    perhatian: [],
    kulit: { cocok: ['kering', 'normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: true,
    tanpaPewangi: true,
    tujuan: ['kasar', 'kemerahan'],
    varian: [
      { id: '30-pipet', ukuran: 30, satuan: 'ml', kemasan: 'pipet', harga: 79000, berat: 130, stok: 22 },
      { id: '50-pipet', ukuran: 50, satuan: 'ml', kemasan: 'pipet', harga: 115000, berat: 175, stok: 10 },
    ],
    terbit: 2,
  },
  {
    slug: 'serum-bha-2',
    nama: 'Serum BHA 2%',
    langkah: 'rawat',
    label: { nama: ['BHA'], sub: 'Asam salisilat', angka: '2%' },
    ringkas: 'Serum asam salisilat 2% untuk kulit berminyak dan berkomedo, dipakai di malam hari.',
    deskripsi:
      'Asam salisilat larut dalam minyak, jadi bisa masuk ke pori yang berminyak dan membantu meluruhkan sel kulit mati di sana. Kadar 2% adalah batas atas untuk produk yang tidak dibilas. Mulai dua sampai tiga malam seminggu, lalu naikkan pelan-pelan bila kulitmu nyaman.',
    aktif: [{ bahan: 'asam-salisilat', kadar: '2%' }, { bahan: 'teh-hijau', kadar: null }],
    inci: ['Aqua', 'Propanediol', 'Salicylic Acid', 'Glycerin', 'Polysorbate 20', 'Camellia Sinensis Leaf Extract', 'Sodium Hydroxide', 'Allantoin', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '3,7',
    pao: 12,
    tekstur: { jenis: 'Serum cair', kental: 2, warna: '#eceff0', bening: 0.9, kilap: 0.5, rasa: 'Bening, ringan, dan cepat kering.' },
    aroma: 'Tanpa pewangi tambahan.',
    waktu: ['malam'],
    frekuensi: '2–3 malam seminggu untuk awal',
    kaliSeminggu: 3,
    takaran: { ml: 0.2, label: '4 tetes', ikon: 'tetes', n: 4 },
    caraPakai: [
      'Pakai di malam hari setelah cuci muka, pada kulit yang kering.',
      'Teteskan 4 tetes, ratakan terutama di area yang berminyak.',
      'Tunggu dua menit sebelum pelembap.',
    ],
    perhatian: [
      'Tidak untuk anak di bawah tiga tahun.',
      'Bila kamu alergi aspirin, tanyakan dulu ke dokter atau apoteker.',
      'Jangan dipakai di malam yang sama dengan toner AHA atau retinol bila kamu baru mulai.',
      'Pakai tabir surya setiap pagi.',
    ],
    kulit: { cocok: ['kombinasi', 'berminyak'], hatiHati: ['kering'] },
    ramahPeka: false,
    tanpaPewangi: true,
    tujuan: ['komedo', 'pori'],
    eksfolian: true,
    varian: [{ id: '30-pipet', ukuran: 30, satuan: 'ml', kemasan: 'pipet', harga: 95000, berat: 130, stok: 17 }],
    terbit: 8,
  },
  {
    slug: 'serum-retinol-03',
    nama: 'Serum Retinol 0,3%',
    langkah: 'rawat',
    label: { nama: ['Retinol'], sub: 'dalam skualana', angka: '0,3%' },
    ringkas: 'Retinol 0,3% dalam skualana untuk malam hari, mulai dua sampai tiga malam seminggu.',
    deskripsi:
      'Retinol adalah turunan vitamin A yang di kulit diubah bertahap menjadi bentuk aktifnya, jadi hasilnya pun bertahap. Kadar 0,3% adalah batas atas yang umum untuk produk wajah. Dilarutkan dalam skualana tanpa air, sehingga tidak memerlukan pengawet. Botol kaca cokelat melindunginya dari cahaya.',
    aktif: [{ bahan: 'retinol', kadar: '0,3%' }, { bahan: 'skualana', kadar: null }],
    inci: ['Squalane', 'Caprylic/Capric Triglyceride', 'Simmondsia Chinensis Seed Oil', 'Tocopherol', 'Retinol', 'Bisabolol'],
    ph: null,
    pao: 6,
    tekstur: { jenis: 'Minyak ringan', kental: 4, warna: '#f3dc9c', bening: 0.72, kilap: 0.95, rasa: 'Minyak ringan berwarna kuning pucat, meresap dalam beberapa menit.' },
    aroma: 'Tanpa pewangi tambahan.',
    waktu: ['malam'],
    frekuensi: '2–3 malam seminggu untuk awal',
    kaliSeminggu: 3,
    takaran: { ml: 0.15, label: '3 tetes', ikon: 'tetes', n: 3 },
    caraPakai: [
      'Pakai di malam hari pada kulit yang benar-benar kering, sekitar 10 menit setelah cuci muka.',
      'Ratakan 3 tetes ke wajah, hindari sudut mata, sudut hidung, dan sudut bibir.',
      'Tutup dengan pelembap. Pagi harinya, wajib tabir surya.',
    ],
    perhatian: [
      'Di minggu-minggu awal kulit bisa terasa kering atau mengelupas. Kurangi frekuensinya bila terlalu tidak nyaman.',
      'Jangan dipakai di malam yang sama dengan toner AHA atau BHA bila kamu baru mulai.',
      'Bila sedang hamil, merencanakan kehamilan, atau menyusui, tanyakan dulu ke dokter.',
    ],
    kulit: { cocok: ['kering', 'normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: false,
    tanpaPewangi: true,
    tujuan: ['garis-halus', 'kusam'],
    retinoid: true,
    varian: [{ id: '15-pipet', ukuran: 15, satuan: 'ml', kemasan: 'pipet-amber', harga: 109000, berat: 100, stok: 11 }],
    terbit: 12,
  },
  {
    slug: 'gel-pelembap-lidah-buaya',
    nama: 'Gel Pelembap Lidah Buaya',
    langkah: 'lembapkan',
    label: { nama: ['Gel', 'Pelembap'], sub: 'Lidah buaya' },
    ringkas: 'Pelembap gel yang ringan untuk kulit berminyak dan kombinasi, tidak meninggalkan lapisan berminyak.',
    deskripsi:
      'Dasarnya cairan daun lidah buaya, ditambah gliserin, skualana sedikit, dan ekstrak pegagan. Cukup untuk menahan air di kulit yang cenderung berminyak, tanpa rasa berat di siang hari yang lembap.',
    aktif: [{ bahan: 'lidah-buaya', kadar: null }, { bahan: 'pegagan', kadar: null }],
    inci: ['Aloe Barbadensis Leaf Juice', 'Aqua', 'Glycerin', 'Squalane', 'Butylene Glycol', 'Panthenol', 'Centella Asiatica Extract', 'Carbomer', 'Sodium Hydroxide', 'Xanthan Gum', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '5,8',
    pao: 6,
    tekstur: { jenis: 'Gel-krim', kental: 3, warna: '#d9ebcf', bening: 0.6, kilap: 0.6, rasa: 'Gel lembut yang terasa sejuk dan cepat meresap.' },
    aroma: 'Tanpa pewangi tambahan.',
    waktu: ['pagi', 'malam'],
    frekuensi: 'Pagi dan malam',
    kaliSeminggu: 14,
    takaran: { ml: 0.6, label: 'seukuran kacang polong', ikon: 'kacang', n: 1 },
    caraPakai: [
      'Pakai setelah serum.',
      'Ambil seukuran kacang polong, totol di dahi, pipi, dan dagu, lalu ratakan.',
      'Di pagi hari, tunggu satu menit sebelum tabir surya.',
    ],
    perhatian: [],
    kulit: { cocok: ['normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: true,
    tanpaPewangi: true,
    tujuan: ['pori', 'kemerahan'],
    varian: [
      { id: '50-jar', ukuran: 50, satuan: 'ml', kemasan: 'jar', harga: 85000, berat: 200, stok: 20 },
      { id: '50-isi-ulang', ukuran: 50, satuan: 'ml', kemasan: 'kantong', isiUlang: true, harga: 62000, berat: 70, stok: 12 },
    ],
    terbit: 4,
  },
  {
    slug: 'krim-ceramide',
    nama: 'Krim Ceramide',
    langkah: 'lembapkan',
    label: { nama: ['Krim', 'Ceramide'], sub: '3 ceramide + kolesterol' },
    ringkas: 'Krim pelembap dengan tiga jenis ceramide, kolesterol, dan shea butter untuk kulit kering dan peka.',
    deskripsi:
      'Ceramide, kolesterol, dan asam lemak adalah lemak yang menyusun lapisan pelindung kulit. Krim ini memasangkan ketiganya dengan shea butter dan skualana. Kental di jar, tetapi mudah diratakan dan tidak terasa licin berminyak setelah beberapa menit.',
    aktif: [{ bahan: 'ceramide', kadar: null }, { bahan: 'kolesterol', kadar: null }, { bahan: 'shea-butter', kadar: null }],
    inci: ['Aqua', 'Glycerin', 'Caprylic/Capric Triglyceride', 'Cetearyl Alcohol', 'Butyrospermum Parkii Butter', 'Squalane', 'Glyceryl Stearate', 'Panthenol', 'Ceramide NP', 'Ceramide AP', 'Ceramide EOP', 'Phytosphingosine', 'Cholesterol', 'Sodium Lauroyl Lactylate', 'Carbomer', 'Xanthan Gum', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '5,5',
    pao: 12,
    tekstur: { jenis: 'Krim', kental: 5, warna: '#faf6ee', bening: 0.05, kilap: 0.35, rasa: 'Krim putih yang kental tetapi mudah diratakan.' },
    aroma: 'Tanpa pewangi tambahan.',
    waktu: ['pagi', 'malam'],
    frekuensi: 'Pagi dan malam',
    kaliSeminggu: 14,
    takaran: { ml: 0.6, label: 'seukuran kacang polong', ikon: 'kacang', n: 1 },
    caraPakai: [
      'Pakai sebagai langkah terakhir di malam hari, atau sebelum tabir surya di pagi hari.',
      'Hangatkan seukuran kacang polong di ujung jari, lalu tekan-tekan ke wajah.',
      'Untuk area yang sangat kering, boleh ditambah sedikit lagi.',
    ],
    perhatian: [],
    kulit: { cocok: ['kering', 'normal'], hatiHati: ['berminyak'] },
    ramahPeka: true,
    tanpaPewangi: true,
    tujuan: ['kasar', 'kemerahan'],
    varian: [
      { id: '50-jar', ukuran: 50, satuan: 'ml', kemasan: 'jar', harga: 119000, berat: 210, stok: 16 },
      { id: '50-isi-ulang', ukuran: 50, satuan: 'ml', kemasan: 'pod', isiUlang: true, harga: 94000, berat: 70, stok: 7 },
    ],
    terbit: 5,
  },
  {
    slug: 'tabir-surya-spf50',
    nama: 'Tabir Surya SPF 50 PA++++',
    langkah: 'lindungi',
    label: { nama: ['Tabir Surya'], sub: 'PA++++', angka: 'SPF 50' },
    ringkas: 'Tabir surya gel yang encer dan cepat kering, dengan filter UV generasi baru dan tanpa bekas putih.',
    deskripsi:
      'Memakai tiga filter UV yang stabil terhadap cahaya untuk UVA dan UVB. Teksturnya encer seperti gel-krim, cepat kering, dan nyaman di bawah masker atau helm. Angka SPF di toko demo ini contoh: di toko sungguhan, angka SPF berasal dari hasil uji laboratorium.',
    aktif: [{ bahan: 'filter-uva', kadar: null }, { bahan: 'filter-uvb', kadar: null }, { bahan: 'filter-spektrum', kadar: null }],
    inci: ['Aqua', 'Dibutyl Adipate', 'Propanediol', 'Diethylamino Hydroxybenzoyl Hexyl Benzoate', 'Ethylhexyl Triazone', 'Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine', 'Glycerin', 'Niacinamide', 'Acrylates/C10-30 Alkyl Acrylate Crosspolymer', 'Tromethamine', 'Tocopherol', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '6,5',
    pao: 12,
    tekstur: { jenis: 'Gel-krim encer', kental: 3, warna: '#f7f2ea', bening: 0.25, kilap: 0.5, rasa: 'Encer dan cepat kering, tanpa bekas putih.' },
    aroma: 'Tanpa pewangi tambahan.',
    waktu: ['pagi'],
    frekuensi: 'Setiap pagi, diulang tiap 2–3 jam di luar ruangan',
    kaliSeminggu: 7,
    takaran: { ml: 1.2, label: 'dua ruas jari', ikon: 'jari', n: 2 },
    caraPakai: [
      'Pakai sebagai langkah terakhir di pagi hari, setelah pelembap.',
      'Oleskan dua garis sepanjang jari telunjuk dan jari tengah (sekitar 1,2 ml) untuk wajah dan leher.',
      'Ulangi setiap dua sampai tiga jam bila berada di luar ruangan atau setelah berkeringat.',
    ],
    perhatian: [
      'Takaran yang terlalu sedikit membuat perlindungannya jauh di bawah angka di label. Satu tabung 50 ml yang dipakai sesuai takaran habis dalam sekitar enam minggu.',
    ],
    kulit: { cocok: ['kering', 'normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: true,
    tanpaPewangi: true,
    tujuan: ['kusam', 'garis-halus'],
    varian: [
      { id: '30-tabung', ukuran: 30, satuan: 'ml', kemasan: 'tabung', harga: 65000, berat: 50, stok: 12 },
      { id: '50-tabung', ukuran: 50, satuan: 'ml', kemasan: 'tabung', harga: 95000, berat: 75, stok: 28 },
    ],
    terbit: 10,
  },
  {
    slug: 'masker-lempung-kaolin',
    nama: 'Masker Lempung Kaolin',
    langkah: 'sesekali',
    label: { nama: ['Masker', 'Kaolin'], sub: '+ teh hijau' },
    ringkas: 'Masker lempung kaolin dan bentonit untuk menyerap minyak di permukaan, satu sampai dua kali seminggu.',
    deskripsi:
      'Kaolin yang halus dipadukan dengan sedikit bentonit, ekstrak teh hijau, dan pegagan. Menyerap minyak di permukaan kulit dan membuat wajah terasa lebih segar. Bilas sebelum benar-benar kering supaya kulit tidak terasa ketarik.',
    aktif: [{ bahan: 'kaolin', kadar: '20%' }, { bahan: 'bentonit', kadar: null }],
    inci: ['Aqua', 'Kaolin', 'Bentonite', 'Glycerin', 'Butylene Glycol', 'Camellia Sinensis Leaf Extract', 'Centella Asiatica Extract', 'Xanthan Gum', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '6,0',
    pao: 12,
    tekstur: { jenis: 'Pasta', kental: 6, warna: '#c4cbb7', bening: 0, kilap: 0.1, rasa: 'Pasta lempung abu kehijauan yang mudah dioles tipis.' },
    aroma: 'Tanpa pewangi tambahan. Bau tanah yang samar.',
    waktu: ['malam'],
    frekuensi: '1–2 kali seminggu',
    kaliSeminggu: 2,
    takaran: { ml: 3, label: 'lapisan tipis', ikon: 'oles', n: 1 },
    caraPakai: [
      'Setelah cuci muka, oleskan lapisan tipis yang rata. Hindari area mata dan bibir.',
      'Diamkan 8–10 menit, sampai sebagian mulai mengering.',
      'Bilas dengan air hangat, lalu lanjutkan rutinitas seperti biasa.',
    ],
    perhatian: ['Untuk kulit kering, cukup pakai di area yang berminyak saja.'],
    kulit: { cocok: ['kombinasi', 'berminyak'], hatiHati: ['kering'] },
    ramahPeka: false,
    tanpaPewangi: true,
    tujuan: ['pori', 'komedo'],
    varian: [{ id: '60-jar', ukuran: 60, satuan: 'g', kemasan: 'jar', harga: 79000, berat: 190, stok: 9 }],
    terbit: 13,
  },
  {
    slug: 'balm-bibir-kemiri',
    nama: 'Balm Bibir Kemiri',
    langkah: 'sesekali',
    label: { nama: ['Balm Bibir'], sub: 'Kemiri' },
    ringkas: 'Balm bibir dari shea butter, minyak jarak, dan minyak kemiri dalam tabung kertas.',
    deskripsi:
      'Tiga minyak dan satu lilin nabati, tanpa air dan tanpa pewangi. Minyak kemiri yang lama dipakai di dapur dan perawatan rambut di Indonesia memberi rasa lembut, minyak jarak membuatnya mengilap. Tabungnya dari karton tebal, bukan plastik.',
    aktif: [{ bahan: 'shea-butter', kadar: null }, { bahan: 'minyak-kemiri', kadar: null }],
    inci: ['Butyrospermum Parkii Butter', 'Ricinus Communis Seed Oil', 'Euphorbia Cerifera Wax', 'Aleurites Moluccanus Seed Oil', 'Tocopherol'],
    ph: null,
    pao: 12,
    tekstur: { jenis: 'Balm padat', kental: 6, warna: '#eed7bf', bening: 0.2, kilap: 0.6, rasa: 'Padat, meleleh tipis saat dioles.' },
    aroma: 'Tanpa pewangi tambahan.',
    waktu: ['pagi', 'malam'],
    frekuensi: 'Kapan saja dibutuhkan',
    kaliSeminggu: null,
    takaran: { ml: null, label: 'oles tipis', ikon: 'oles', n: 1 },
    caraPakai: ['Dorong balm dari bawah tabung, oleskan tipis ke bibir kapan saja terasa kering.', 'Simpan di tempat sejuk. Di dalam mobil yang panas, balm bisa melunak.'],
    perhatian: [],
    kulit: { cocok: ['kering', 'normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: true,
    tanpaPewangi: true,
    tujuan: [],
    varian: [{ id: '5-stik', ukuran: 5, satuan: 'g', kemasan: 'stik', harga: 39000, berat: 25, stok: 40 }],
    terbit: 14,
  },
  {
    slug: 'sabun-batang-sereh',
    nama: 'Sabun Batang Sereh',
    langkah: 'tubuh',
    label: { nama: ['Sabun', 'Sereh'], sub: 'Batang 100 g' },
    ringkas: 'Sabun batang untuk badan dari minyak zaitun dan kelapa, beraroma minyak sereh, dibungkus kertas.',
    deskripsi:
      'Sabun sesungguhnya: minyak zaitun dan minyak kelapa yang direaksikan dengan basa, lalu dikeringkan selama empat minggu. pH sabun batang sekitar 9–10, jadi kami sarankan untuk badan saja. Wanginya dari minyak sereh, dan alergen pewanginya kami tulis lengkap.',
    aktif: [{ bahan: 'sabun-nabati', kadar: null }, { bahan: 'minyak-sereh', kadar: '1%' }],
    inci: ['Sodium Olivate', 'Sodium Cocoate', 'Aqua', 'Glycerin', 'Cymbopogon Citratus Leaf Oil', 'Citral', 'Geraniol', 'Limonene'],
    ph: '9–10',
    pao: 24,
    tekstur: { jenis: 'Batang padat', kental: null, warna: '#e9e3b8', bening: 0, kilap: 0.2, rasa: 'Busa lembut dan rapat.' },
    aroma: 'Sereh yang segar dari minyak atsiri sereh.',
    waktu: ['pagi', 'malam'],
    frekuensi: 'Saat mandi',
    kaliSeminggu: null,
    takaran: { ml: null, label: 'usap ke badan basah', ikon: 'oles', n: 1 },
    caraPakai: ['Basahi sabun dan badan, usap sampai berbusa, lalu bilas.', 'Simpan di tempat sabun yang berlubang supaya cepat kering dan tidak lembek.'],
    perhatian: ['Mengandung pewangi alami (minyak sereh). Kurang cocok untuk kulit yang peka terhadap pewangi.', 'Tidak untuk wajah.'],
    kulit: { cocok: ['kering', 'normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: false,
    tanpaPewangi: false,
    tujuan: [],
    varian: [
      { id: '100-batang', ukuran: 100, satuan: 'g', kemasan: 'batang', harga: 35000, berat: 115, stok: 30 },
      { id: '3x100-batang', ukuran: 300, satuan: 'g', kemasan: 'batang', jumlahIsi: 3, harga: 95000, berat: 340, stok: 8 },
    ],
    terbit: 15,
  },
  {
    slug: 'losion-tubuh-kelapa',
    nama: 'Losion Tubuh Kelapa',
    langkah: 'tubuh',
    label: { nama: ['Losion', 'Tubuh'], sub: 'Kelapa + urea 3%' },
    ringkas: 'Losion tubuh dengan minyak kelapa dan urea 3% untuk siku, lutut, dan tumit yang kasar.',
    deskripsi:
      'Losion yang cukup ringan untuk iklim lembap, tetapi tetap terasa di kulit badan yang kering. Urea 3% membantu kulit yang kasar terasa lebih halus. Pompanya mengeluarkan sekitar 1 ml sekali tekan, jadi takarannya mudah diatur.',
    aktif: [{ bahan: 'urea', kadar: '3%' }, { bahan: 'minyak-kelapa', kadar: null }],
    inci: ['Aqua', 'Glycerin', 'Cocos Nucifera Oil', 'Caprylic/Capric Triglyceride', 'Cetearyl Alcohol', 'Urea', 'Glyceryl Stearate', 'Butyrospermum Parkii Butter', 'Panthenol', 'Allantoin', 'Xanthan Gum', 'Phenoxyethanol', 'Ethylhexylglycerin'],
    ph: '5,5',
    pao: 12,
    tekstur: { jenis: 'Losion', kental: 4, warna: '#faf5eb', bening: 0.05, kilap: 0.4, rasa: 'Losion putih yang cepat meresap.' },
    aroma: 'Tanpa pewangi tambahan. Bau samar kelapa.',
    waktu: ['pagi', 'malam'],
    frekuensi: 'Setelah mandi',
    kaliSeminggu: 7,
    takaran: { ml: 4, label: '4 pompa', ikon: 'pompa', n: 4 },
    caraPakai: ['Pakai setelah mandi selagi kulit masih sedikit lembap.', 'Sekitar satu pompa untuk tiap lengan dan tiap kaki.'],
    perhatian: ['Urea bisa terasa perih di kulit yang lecet. Hindari luka terbuka.'],
    kulit: { cocok: ['kering', 'normal', 'kombinasi', 'berminyak'], hatiHati: [] },
    ramahPeka: true,
    tanpaPewangi: true,
    tujuan: ['kasar'],
    varian: [
      { id: '250-pompa', ukuran: 250, satuan: 'ml', kemasan: 'pompa', harga: 79000, berat: 330, stok: 14 },
      { id: '500-isi-ulang', ukuran: 500, satuan: 'ml', kemasan: 'kantong', isiUlang: true, harga: 119000, berat: 530, stok: 6 },
    ],
    terbit: 16,
  },
];

// Contoh tarif ongkir dari Bandung. Bukan tarif kurir sungguhan.
export const zonaOngkir = [
  {
    id: 'z1',
    nama: 'Zona 1',
    cakupan: 'Jawa Barat, DKI Jakarta, Banten',
    provinsi: ['Jawa Barat', 'DKI Jakarta', 'Banten'],
    layanan: { reguler: { perKg: 9000, estimasi: '1–2 hari' }, kilat: { perKg: 16000, estimasi: '1 hari' } },
  },
  {
    id: 'z2',
    nama: 'Zona 2',
    cakupan: 'Jawa lainnya dan Bali',
    provinsi: ['Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Bali'],
    layanan: { reguler: { perKg: 13000, estimasi: '2–3 hari' }, kilat: { perKg: 23000, estimasi: '1–2 hari' } },
  },
  {
    id: 'z3',
    nama: 'Zona 3',
    cakupan: 'Sumatra, Kalimantan, Sulawesi, NTB',
    provinsi: [
      'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan',
      'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung', 'Nusa Tenggara Barat', 'Kalimantan Barat',
      'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
      'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara',
    ],
    layanan: { reguler: { perKg: 25000, estimasi: '3–5 hari' }, kilat: { perKg: 42000, estimasi: '2–3 hari' } },
  },
  {
    id: 'z4',
    nama: 'Zona 4',
    cakupan: 'NTT, Maluku, Papua',
    provinsi: ['Nusa Tenggara Timur', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Tengah', 'Papua Pegunungan', 'Papua Selatan'],
    layanan: { reguler: { perKg: 40000, estimasi: '5–8 hari' }, kilat: null },
  },
];

export const layananKirim = [
  { id: 'reguler', nama: 'Reguler', ket: 'Lebih hemat' },
  { id: 'kilat', nama: 'Kilat', ket: 'Lebih cepat' },
  { id: 'ambil', nama: 'Ambil di toko', ket: 'Di Bandung, tanpa ongkir' },
];

// Bantalan + kardus: 20% dari berat barang, minimal 150 g.
export const kemasanKirim = { persen: 0.2, minimum: 150 };

export const metodeBayar = [
  {
    id: 'transfer',
    nama: 'Transfer bank',
    ket: 'Nomor rekening contoh muncul setelah pesanan dibuat.',
    instruksi: 'Transfer ke rekening contoh 000-0000-000 a.n. Takar Demo. Nomor ini tidak aktif, jadi jangan benar-benar mentransfer.',
  },
  {
    id: 'qris',
    nama: 'QRIS',
    ket: 'Kode QR contoh muncul setelah pesanan dibuat.',
    instruksi: 'Di toko sungguhan, kode QR muncul di sini untuk dipindai dari aplikasi bank atau dompet digital. Di demo ini tidak ada kode yang bisa dipindai.',
  },
  {
    id: 'ewallet',
    nama: 'Dompet digital',
    ket: 'Tautan bayar contoh, tidak menarik saldo apa pun.',
    instruksi: 'Di toko sungguhan, tombol bayar membuka aplikasi dompet digital. Di demo ini tidak ada saldo yang ditarik.',
  },
];

export const statusPesanan = [
  { id: 'menunggu', label: 'Menunggu pembayaran', ket: 'Pesanan dibuat dan menunggu dibayar.' },
  { id: 'dibayar', label: 'Dibayar', ket: 'Pembayaran diterima.' },
  { id: 'dikemas', label: 'Dikemas', ket: 'Botol kaca dibungkus kertas sarang lebah dan disekat.' },
  { id: 'dikirim', label: 'Dikirim', labelAmbil: 'Siap diambil', ket: 'Paket sudah di tangan kurir.', ketAmbil: 'Pesanan menunggu di toko. Tunjukkan kode pesanan saat mengambil.' },
  { id: 'selesai', label: 'Selesai', ket: 'Paket diterima.', ketAmbil: 'Pesanan sudah diambil.' },
];

export const provinsi = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan',
  'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah',
  'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
  'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
  'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku',
  'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Tengah', 'Papua Pegunungan', 'Papua Selatan',
];

// Hal yang sengaja tidak kami janjikan (dipakai di beranda dan halaman tentang).
export const tidakDijanjikan = [
  { t: 'Kulit putih', j: 'Warna kulit ditentukan oleh genetik. Yang bisa dirawat adalah kulit yang tampak kusam atau warnanya tidak rata.' },
  { t: 'Bebas jerawat selamanya', j: 'Jerawat dipengaruhi hormon, genetik, dan banyak hal lain. Untuk jerawat yang meradang atau meninggalkan bekas, temui dokter.' },
  { t: 'Hasil dalam tiga hari', j: 'Lapisan luar kulit berganti dalam hitungan minggu. Beri satu produk baru waktu enam sampai delapan minggu sebelum menilainya.' },
  { t: '100% alami', j: 'Sebagian bahan kami nabati, sebagian dibuat di pabrik. Asal bahan tidak menentukan aman atau tidaknya; kadarnya yang menentukan.' },
];

export const faq = [
  {
    grup: 'Memilih produk',
    id: 'memilih',
    isi: [
      {
        t: 'Bagaimana mengetahui jenis kulitku?',
        j: 'Cuci muka dengan pembersih yang lembut, keringkan, lalu jangan pakai apa pun selama dua jam. Kalau terasa kencang atau bersisik, kulitmu cenderung kering. Mengilap di dahi, hidung, dan dagu saja berarti kombinasi. Mengilap di hampir seluruh wajah berarti berminyak. Halaman Cocokkan memakai pertanyaan yang sama.',
      },
      {
        t: 'Bolehkah memakai beberapa serum sekaligus?',
        j: 'Boleh, tetapi satu sampai dua serum per waktu pakai sudah cukup. Urutkan dari yang paling encer. Untuk bahan yang kuat seperti AHA, BHA, dan retinol, pakai di malam yang berbeda bila kamu baru mulai.',
      },
      {
        t: 'Apa itu uji tempel dan bagaimana caranya?',
        j: 'Oleskan sedikit produk di belakang telinga atau di bawah rahang, sekali sehari selama tiga hari. Kalau tidak muncul gatal, perih, atau kemerahan, lanjutkan ke seluruh wajah. Uji tempel tidak menjamin tidak ada reaksi, tetapi mengurangi kemungkinan kaget.',
      },
      {
        t: 'Apakah produk Takar bisa dipakai saat hamil?',
        j: 'Untuk produk yang berisi retinol, tanyakan dulu ke dokter. Untuk produk lain, kami tetap menyarankan bertanya ke dokter kandungan karena tiap kehamilan berbeda. Kami tidak memberi saran medis.',
      },
    ],
  },
  {
    grup: 'Kandungan dan kadar',
    id: 'kandungan',
    isi: [
      {
        t: 'Apa arti angka persen di nama produk?',
        j: 'Kadar bahan aktif utama dalam formula, misalnya 5 gram niasinamida dalam tiap 100 gram serum. Untuk hialuronat, angkanya kadar larutan kompleks yang kami pakai. Semua keterangan ini ada di halaman produknya.',
      },
      {
        t: 'Kenapa produk kalian memakai pengawet?',
        j: 'Produk berbahan air bisa ditumbuhi jamur dan bakteri setelah kemasan dibuka. Kami memakai fenoksietanol di bawah 1% bersama etilheksilgliserin. Produk tanpa air, seperti balm dan serum retinol, tidak memerlukannya.',
      },
      {
        t: 'Apa arti simbol wadah terbuka bertuliskan 6M atau 12M?',
        j: 'Itu PAO (period after opening): batas pemakaian setelah kemasan dibuka, dalam bulan. Serum vitamin C kami 3 bulan, retinol 6 bulan, sebagian besar lainnya 12 bulan. Di halaman produk, kami membandingkannya dengan perkiraan kapan isi kemasan habis.',
      },
      {
        t: 'Nomor notifikasi BPOM-nya berapa?',
        j: 'Takar adalah toko fiktif, jadi tidak ada nomor notifikasi. Di toko sungguhan, nomor notifikasi BPOM tercantum di kemasan dan di halaman setiap produk, dan bisa dicek di situs resmi BPOM.',
      },
    ],
  },
  {
    grup: 'Isi ulang',
    id: 'isi-ulang',
    isi: [
      {
        t: 'Bagaimana cara mengisi ulang?',
        j: 'Pakai sampai botol kosong, cuci dengan sabun, bilas dengan air matang, lalu keringkan sampai benar-benar kering. Gunting sudut kantong di garis putus-putus atau buka tutup corongnya, tuang perlahan. Jangan mencampur sisa isi lama dengan isi baru.',
      },
      {
        t: 'Kenapa serum vitamin C, retinol, dan tabir surya tidak ada isi ulangnya?',
        j: 'Vitamin C dan retinol mudah rusak oleh udara dan cahaya, jadi lebih aman dijual dalam botol kecil yang langsung dipakai. Tabir surya dijual dalam tabung tertutup supaya filter UV-nya tidak terkontaminasi.',
      },
      {
        t: 'Kantong isi ulang dibuang ke mana?',
        j: 'Kantong kami terbuat dari satu jenis plastik (PE), bukan lapisan campuran, jadi lebih mudah diterima pendaur ulang. Bilas, keringkan, dan setor ke bank sampah terdekat. Kamu juga bisa membawanya ke toko kami di Bandung.',
      },
    ],
  },
  {
    grup: 'Pengiriman',
    id: 'pengiriman',
    isi: [
      {
        t: 'Dari mana pesanan dikirim?',
        j: 'Dari toko kami di Bandung. Ongkir dihitung otomatis di checkout dari provinsi tujuan dan berat kiriman. Angka di toko demo ini contoh tarif, bukan tarif kurir sungguhan.',
      },
      {
        t: 'Kapan pesanan dikemas?',
        j: 'Pesanan yang dibayar sebelum pukul 13.00 WIB dikemas hari itu juga. Selebihnya dikemas pada hari kerja berikutnya.',
      },
      {
        t: 'Bisa ambil sendiri di toko?',
        j: 'Bisa. Pilih "Ambil di toko" di checkout, tanpa ongkir. Pesanan bisa diambil setelah statusnya berubah menjadi Siap diambil, pada jam toko.',
      },
      {
        t: 'Apakah aman dikirim saat cuaca panas?',
        j: 'Botol kaca dibungkus kertas sarang lebah dan disekat. Begitu paket tiba, simpan serum vitamin C dan retinol di tempat sejuk, jangan di dekat jendela atau di dalam kendaraan.',
      },
    ],
  },
  {
    grup: 'Retur dan keluhan',
    id: 'retur',
    isi: [
      {
        t: 'Bagaimana kalau kulitku bereaksi?',
        j: 'Hentikan pemakaian dan bilas dengan air. Bila reaksinya berat atau tidak membaik, temui tenaga kesehatan. Hubungi kami dalam 14 hari setelah paket diterima: produk yang baru terpakai sedikit kami kembalikan dananya.',
      },
      {
        t: 'Botol pecah atau bocor saat tiba?',
        j: 'Rekam video saat membuka paket tanpa jeda, lalu kirim bersama foto kemasannya dalam 2 × 24 jam. Kami kirim pengganti tanpa biaya, termasuk ongkirnya.',
      },
    ],
  },
  {
    grup: 'Tentang toko demo ini',
    id: 'demo',
    isi: [
      {
        t: 'Apakah pembayaran di situs ini sungguhan?',
        j: 'Tidak. Takar adalah toko fiktif. Transfer bank, QRIS, dan dompet digital hanya contoh alur. Tidak ada uang yang ditarik, dan tombol "Simulasikan pembayaran" hanya mengubah status pesanan di browser kamu.',
      },
      {
        t: 'Di mana data pesanan dan rutinitasku disimpan?',
        j: 'Hanya di browser yang kamu pakai (localStorage). Tidak ada yang dikirim ke server. Menghapus data situs di browser akan menghapus keranjang, pesanan, rutinitas, dan pesan yang kamu tulis.',
      },
      {
        t: 'Apakah kandungan dan kadarnya sungguhan?',
        j: 'Nama bahan, fungsi, dan batas kadarnya mengikuti pengetahuan umum tentang kosmetik, tetapi formulanya rekaan dan tidak pernah dibuat atau diuji. Jangan memakai halaman ini sebagai pengganti saran tenaga kesehatan.',
      },
    ],
  },
];

export function cariProduk(slug) {
  return produk.find((p) => p.slug === slug);
}

export function cariLangkah(id) {
  return langkah.find((l) => l.id === id);
}

export function cariKulit(id) {
  return jenisKulit.find((k) => k.id === id);
}

export function cariTujuan(id) {
  return tujuan.find((t) => t.id === id);
}
