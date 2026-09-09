/**
 * Catatan presenter, satu entri per slide (dikunci dengan id slide).
 *
 * Slide sengaja dibuat sangat minimalis; uraian lengkapnya ada di sini. Tekan
 * N saat presentasi untuk membukanya di jendela terpisah. Edit bebas, tidak
 * perlu menyentuh slides.jsx.
 *
 *   target - perkiraan durasi bicara dalam detik
 *   notes  - poin yang diucapkan, bukan yang ditampilkan
 *   simbol - cara baca lambang yang muncul di slide itu, tampil di bagian
 *            bawah jendela catatan. Isinya berbeda tiap slide, hanya memuat
 *            lambang yang benar-benar dipakai di sana.
 */

/* Lambang yang berulang di banyak slide, supaya tidak ditulis berkali-kali. */
const S = {
  d: { s: 'd', baca: 'de', arti: 'perubahan yang sangat kecil, diferensial' },
  D: { s: 'Δ', baca: 'delta', arti: 'selisih antara keadaan akhir dan awal' },
  del: { s: '∂', baca: 'do, atau turunan parsial', arti: 'turunan dengan variabel lain ditahan tetap' },
  CV: { s: 'C_V', baca: 'C-V', arti: 'kapasitas panas pada volume tetap' },
  CP: { s: 'C_P', baca: 'C-P', arti: 'kapasitas panas pada tekanan tetap' },
  Cm: { s: 'C_m', baca: 'C-em', arti: 'kapasitas panas molar, per satu mol' },
  Q: { s: 'Q', baca: 'ku', arti: 'kalor yang dipertukarkan' },
  W: { s: 'W', baca: 'we', arti: 'kerja' },
  U: { s: 'U', baca: 'u', arti: 'energi internal' },
  H: { s: 'H', baca: 'ha', arti: 'entalpi' },
  R: { s: 'R', baca: 'er', arti: 'tetapan gas umum, 8,314 J per mol per kelvin' },
  n: { s: 'n', baca: 'en', arti: 'jumlah zat dalam mol' },
  gamma: { s: 'γ', baca: 'gamma', arti: 'nisbah C-P terhadap C-V' },
};

export const notes = {
  /* ─────────────────────────────────────────────────────────── 1 */
  sampul: {
    target: 30,
    notes: [
      'Perkenalkan kelompok dan judulnya: Kapasitas Panas dan Proses Termodinamika, dari Sandeep Sharma Bab 2.',
      'Satu kalimat pembuka yang menjanjikan arah: hari ini kita lihat bagaimana sistem merespons kalor, lalu bagaimana respons itu diklasifikasikan jadi berbagai jenis proses.',
      'Jangan buru-buru pindah. Biarkan judulnya sempat terbaca.',
    ],
    simbol: [],
  },

  /* ─────────────────────────────────────────────────────────── 2 */
  peta: {
    target: 40,
    notes: [
      'Enam bagian ini berurutan, bukan daftar acak. Tekankan itu.',
      'Kapasitas panas memunculkan kebutuhan akan entalpi. Entalpi menjelaskan kenapa C-P lebih besar dari C-V. Setelah paham perpindahan energinya, kita ukur lewat kalorimetri, lalu klasifikasikan prosesnya, dan terakhir kita hadapkan pada kenyataan bahwa proses nyata tidak pernah benar-benar ideal.',
      'Kalau waktu mepet, slide ini boleh dilewati cepat. Fungsinya cuma memberi peta.',
    ],
    simbol: [S.CP, S.CV],
  },

  /* ─────────────────────────────────────────────────────────── 3 */
  definisi: {
    target: 60,
    notes: [
      'Poin utama, dan ini yang paling sering salah dipahami: kapasitas panas BUKAN konstanta material seperti massa jenis.',
      'Nilainya bergantung pada keadaan sistem dan pada proses yang sedang dijalani. Satu zat yang sama bisa punya lebih dari satu nilai kapasitas panas.',
      'Alfa di situ bukan besaran fisis, melainkan penanda batasan apa yang kita jaga tetap. Kalau volume yang dijaga, kita dapat C-V. Kalau tekanan, kita dapat C-P.',
      'Satuannya joule per kelvin.',
      'Kalau ada yang bertanya kenapa pakai d dan bukan delta: karena definisinya berlaku untuk perubahan suhu yang sangat kecil, di mana kapasitas panasnya belum sempat berubah.',
    ],
    simbol: [
      { s: 'α', baca: 'alfa', arti: 'batasan yang dijaga tetap, bisa V atau P' },
      { s: 'C_α', baca: 'C-alfa', arti: 'kapasitas panas pada batasan alfa' },
      S.d, S.Q,
      { s: 'T', baca: 'te', arti: 'suhu mutlak dalam kelvin' },
      S.CV, S.CP,
    ],
  },

  /* ─────────────────────────────────────────────────────────── 4 */
  cvcp: {
    target: 70,
    notes: [
      'Silinder yang sama, dua perlakuan berbeda. Tunjuk gambarnya.',
      'Kiri, volume tetap: pistonnya dipaku. Karena dV nol, maka kerjanya juga nol. Tidak ada kerja mekanis sama sekali.',
      'Akibatnya seluruh kalor yang masuk jadi energi internal, sehingga C-V adalah turunan parsial U terhadap T pada volume tetap.',
      'Kanan, tekanan tetap: pistonnya bebas naik supaya tekanannya terjaga. Di sini kalor terbagi dua, sebagian jadi energi internal, sebagian jadi kerja untuk mendorong piston.',
      'Karena itu bentuk formalnya memakai entalpi, bukan energi internal. Slide berikutnya menjelaskan kenapa entalpi yang dipakai.',
    ],
    simbol: [
      S.CV, S.CP, S.del, S.U, S.H,
      { s: 'T', baca: 'te', arti: 'suhu mutlak' },
      { s: 'dW', baca: 'de-we', arti: 'kerja yang sangat kecil' },
      { s: '(∂U/∂T)_V', baca: 'do U per do T, pada V tetap', arti: '' },
    ],
  },

  /* ─────────────────────────────────────────────────────────── 5 */
  sifat: {
    target: 45,
    notes: [
      'Kapasitas panas C bersifat ekstensif: gandakan massanya, nilainya ikut berlipat.',
      'Kalau dinormalisasi, ia jadi intensif. Ada dua cara menormalkannya, dan keduanya jangan tertukar.',
      'Per mol menghasilkan C-em, satuannya joule per mol per kelvin. Per satuan massa menghasilkan c kecil, satuannya joule per kilogram per kelvin.',
      'Kenapa ini penting: kalau kita mau membandingkan karakteristik dua material, kita harus pakai besaran intensif. Kalau tidak, yang terbaca hanyalah perbedaan banyaknya zat, bukan sifat zatnya.',
    ],
    simbol: [
      { s: 'C', baca: 'ce', arti: 'kapasitas panas total, ekstensif' },
      S.Cm,
      { s: 'c', baca: 'ce kecil', arti: 'kapasitas panas spesifik per satuan massa' },
      S.n,
      { s: 'm', baca: 'em', arti: 'massa' },
    ],
  },

  /* ─────────────────────────────────────────────────────────── 6 */
  entalpi: {
    target: 55,
    notes: [
      'Untuk analisis pada tekanan tetap, dan itu justru yang paling umum di reaksi kimia dan proses industri, energi internal saja tidak memadai.',
      'H sama dengan U ditambah P kali V. Suku P V itu energi yang terkait dengan sistem menempati ruang sebesar V pada tekanan P.',
      'Tekankan: entalpi adalah fungsi keadaan, persis seperti U. Nilainya tidak bergantung pada jalur yang ditempuh, hanya pada keadaan awal dan akhir.',
      'Jangan dulu bilang "entalpi itu kalor". Itu baru benar pada syarat tertentu, dan syaratnya kita turunkan di slide berikutnya.',
    ],
    simbol: [
      S.H, S.U,
      { s: 'P', baca: 'pe', arti: 'tekanan' },
      { s: 'V', baca: 've', arti: 'volume' },
    ],
  },

  /* ─────────────────────────────────────────────────────────── 7 */
  turunan: {
    target: 85,
    notes: [
      'Ini turunan paling penting di bagian ini. Bicara pelan, dan beri jeda di akhir.',
      'Ambil bentuk diferensial dari H sama dengan U tambah P V. Hasilnya tiga suku: dH sama dengan dU, tambah P dV, tambah V dP.',
      'Sekarang terapkan batasannya. Tekanan dijaga tetap, jadi dP nol, dan suku V dP hilang. Tunggu sampai animasinya selesai membuangnya.',
      'Sisanya dH sama dengan dU tambah P dV.',
      'Bandingkan dengan Hukum Pertama dalam konvensi kita: dQ sama dengan dU tambah P dV. Ruas kanannya identik.',
      'Kesimpulannya, dH sama dengan dQ pada tekanan tetap. Inilah alasan entalpi sering disebut kalor pada tekanan tetap, dan alasan C-P didefinisikan lewat H, bukan lewat U.',
      'Sebutkan syaratnya yang tertulis di slide: sistem tertutup, tekanan konstan, dan satu-satunya kerja adalah P dV. Kalau ada kerja listrik atau kerja permukaan, kesimpulan ini tidak berlaku.',
    ],
    simbol: [
      S.d, S.H, S.U, S.Q,
      { s: 'P', baca: 'pe', arti: 'tekanan' },
      { s: 'V', baca: 've', arti: 'volume' },
      { s: 'dQ_P', baca: 'de-ku, pada P tetap', arti: 'kalor yang dipertukarkan pada tekanan tetap' },
      { s: 'VdP', baca: 've de-pe', arti: 'suku yang nol saat tekanan dijaga tetap' },
    ],
  },

  /* ─────────────────────────────────────────────────────────── 8 */
  molar: {
    target: 50,
    notes: [
      'Standarisasi dengan mol: C-em sama dengan C dibagi n.',
      'Pertanyaan pentingnya, kenapa mol dan bukan massa. Karena mol menghitung jumlah partikel, bukan berat partikel.',
      'Dengan mol, perbedaan massa atomik antar zat tereliminasi. Yang tersisa untuk dibandingkan adalah derajat kebebasan internal molekulnya, yaitu berapa banyak cara molekul itu bisa menyimpan energi.',
      'Perhatikan notasinya, ini sering tertukar di banyak buku. C-em pakai huruf besar untuk per mol, c kecil untuk per satuan massa. Satuannya berbeda, jadi jangan sampai tertukar saat mengerjakan soal.',
    ],
    simbol: [
      S.Cm, S.n, S.d, S.Q,
      { s: 'T', baca: 'te', arti: 'suhu mutlak' },
      { s: 'c', baca: 'ce kecil', arti: 'kapasitas panas spesifik per satuan massa' },
    ],
  },

  /* ─────────────────────────────────────────────────────────── 9 */
  kenapa: {
    target: 75,
    notes: [
      'Kembali ke analogi piston, sekarang untuk menjawab pertanyaan pokoknya.',
      'Kalau piston dipaku, gas cepat panas karena energinya tidak bocor ke mana-mana.',
      'Kalau piston dibiarkan bebas, sebagian energi terpakai mendorong piston naik melawan tekanan lingkungan.',
      'Perhatikan arah kalimatnya, ini kritis: untuk mencapai kenaikan suhu yang SAMA, pada tekanan tetap kita butuh kalor LEBIH BANYAK. Bukan suhunya yang lebih rendah.',
      'Untuk gas ideal, selisihnya persis n R. Itu bukan angka kira-kira, dan slide berikutnya membuktikannya dengan angka.',
      'Kalau ada yang bertanya apakah C-P selalu lebih besar untuk semua zat: jawabannya ada di baris syarat. Secara umum C-P lebih besar atau sama dengan C-V, karena selisihnya sama dengan T V alfa kuadrat dibagi kappa-T, dan kappa-T selalu positif untuk sistem yang stabil. Sama besar hanya kalau koefisien muai termalnya nol, misalnya air di sekitar 4 derajat Celsius.',
      'Tunggu sekitar 1,5 detik sampai bar-nya selesai mengisi sebelum lanjut bicara.',
    ],
    simbol: [
      S.CP, S.CV, S.n, S.R, S.D, S.U,
      { s: 'α', baca: 'alfa', arti: 'koefisien muai termal' },
      { s: 'κ_T', baca: 'kappa-te', arti: 'kompresibilitas isotermal, selalu positif untuk sistem stabil' },
      { s: 'T', baca: 'te', arti: 'suhu mutlak' },
    ],
  },

  /* ────────────────────────────────────────────────────────── 10 */
  contoh: {
    target: 85,
    notes: [
      'Slide ini yang mengubah presentasi dari sekadar menjelaskan konsep jadi menerapkannya. Bacakan angkanya pelan-pelan.',
      'Ambil 1 mol gas ideal monoatomik, naikkan suhunya 10 kelvin. Monoatomik berarti hanya punya tiga derajat kebebasan translasi, sehingga C-V molarnya tiga per dua R.',
      'Volume tetap: C-V molar 12,47 sehingga kalornya 124,7 joule. Semuanya jadi energi internal, kerjanya nol.',
      'Tekanan tetap: C-P molar 20,79 sehingga kalornya 207,9 joule. Padahal kenaikan suhunya sama persis, jadi perubahan energi internalnya juga sama, 124,7 joule.',
      'Selisihnya 83,1 joule. Itu bukan angka acak: nilainya persis n R delta T, dan itulah kerja yang dipakai sistem untuk mendorong pistonnya.',
      'Tegaskan tandanya. Kita pakai Konvensi 1, jadi kerja saat memuai bernilai NEGATIF: minus 83,1 joule. Cek Hukum Pertama: delta U sama dengan Q tambah W, yaitu 207,9 dikurangi 83,1 sama dengan 124,7. Cocok.',
      'Kalau ditanya kenapa delta U-nya sama di kedua kasus: karena energi internal gas ideal hanya bergantung pada suhu, tidak pada volume.',
    ],
    simbol: [
      S.Cm, S.CV, S.CP, S.Q, S.W, S.U, S.D, S.n, S.R,
      { s: 'C_V,m', baca: 'C-V-em', arti: 'kapasitas panas molar pada volume tetap' },
      { s: 'ΔT', baca: 'delta te', arti: 'kenaikan suhu, di sini 10 kelvin' },
    ],
  },

  /* ────────────────────────────────────────────────────────── 11 */
  kalorimetri: {
    target: 50,
    notes: [
      'Dalam sistem gabungan yang terisolasi secara termal, energi tidak diciptakan atau dimusnahkan, hanya berpindah tempat.',
      'Q-A sama dengan minus Q-B. Tanda minusnya penting: kalor yang dilepas satu komponen persis sama besarnya dengan yang diterima komponen lain.',
      'Bentuk lain yang sering dipakai: Q lepas tambah Q terima sama dengan nol.',
      'Kesetimbangan termal tercapai saat suhunya seragam, sehingga aliran neto kalor berhenti. Perhatikan kata neto: pertukaran di tingkat mikroskopis tetap terjadi, hanya saja saling meniadakan.',
    ],
    simbol: [
      S.Q,
      { s: 'Q_A', baca: 'ku-a', arti: 'kalor pada komponen A, yang bersuhu lebih tinggi' },
      { s: 'Q_B', baca: 'ku-be', arti: 'kalor pada komponen B, yang bersuhu lebih rendah' },
    ],
  },

  /* ────────────────────────────────────────────────────────── 12 */
  taksonomi: {
    target: 60,
    notes: [
      'Enam proses ini adalah kerangka untuk sisa pembahasan.',
      'Tegaskan konvensi tandanya lebih dulu, karena inilah sumber kesalahan paling umum. Kita pakai Konvensi 1: dW sama dengan minus P dV.',
      'Artinya kerja bernilai positif kalau dilakukan PADA sistem, yaitu saat kompresi. Dan negatif kalau dilakukan OLEH sistem, yaitu saat ekspansi.',
      'Kalau di buku lain tandanya terbalik, itu Konvensi 2. Bukan salah, hanya beda kesepakatan. Yang penting kita konsisten sepanjang presentasi.',
      'Bacakan enam prosesnya cepat saja, jangan diurai satu per satu di sini. Empat di antaranya kita bahas lebih dalam di slide berikutnya.',
    ],
    simbol: [
      S.d, S.D, S.gamma, S.Q, S.W, S.U,
      { s: 'dT = 0', baca: 'de-te sama dengan nol', arti: 'suhu tidak berubah, isotermal' },
      { s: 'dQ = 0', baca: 'de-ku sama dengan nol', arti: 'tidak ada pertukaran kalor, adiabatik' },
      { s: 'PV^γ', baca: 'pe-ve pangkat gamma', arti: '' },
    ],
  },

  /* ────────────────────────────────────────────────────────── 13 */
  adiabatik: {
    target: 85,
    notes: [
      'Isotermal: suhu tetap, P V sama dengan konstan. Untuk gas ideal delta U nol, sehingga seluruh kalor yang masuk keluar lagi sebagai kerja. Kerjanya minus n R T ln V-akhir per V-awal.',
      'Penting dan sering luput: delta U sama dengan nol itu khusus gas ideal, karena energi internal gas ideal hanya fungsi suhu.',
      'Adiabatik: tidak ada pertukaran kalor, dQ nol, dan P V pangkat gamma sama dengan konstan. Karena Q nol, seluruh perubahan energi internal berasal dari kerja.',
      'Sekarang derivasi kemiringannya. Isotermal: P sama dengan C per V, diturunkan, dapat dP per dV sama dengan minus P per V.',
      'Adiabatik: P sama dengan C per V pangkat gamma, diturunkan, dapat dP per dV sama dengan minus gamma P per V.',
      'Karena gamma adalah C-P per C-V, dan kita sudah buktikan C-P lebih besar dari C-V, maka gamma lebih besar dari satu. Jadi kemiringan adiabatik adalah gamma kali kemiringan isotermal.',
      'Interpretasi fisisnya, dan ini yang paling layak diingat: pada adiabatik, tekanan turun bukan hanya karena volume membesar, tetapi juga karena suhunya ikut turun. Dua efek sekaligus, jadi kurvanya lebih curam.',
      'Sebutkan syaratnya: hubungan P V pangkat gamma hanya berlaku untuk gas ideal pada proses adiabatik yang reversibel. Ekspansi bebas juga punya Q nol, tapi ireversibel, jadi tidak memenuhi hubungan ini.',
    ],
    simbol: [
      S.gamma, S.CP, S.CV, S.d, S.D, S.U, S.Q, S.R, S.n,
      { s: 'P', baca: 'pe', arti: 'tekanan' },
      { s: 'V', baca: 've', arti: 'volume' },
      { s: 'dP/dV', baca: 'de-pe per de-ve', arti: 'kemiringan kurva pada diagram P-V' },
      { s: 'ln', baca: 'el-en', arti: 'logaritma natural' },
    ],
  },

  /* ────────────────────────────────────────────────────────── 14 */
  kasus: {
    target: 70,
    notes: [
      'Empat kasus ini yang paling sering tertukar satu sama lain.',
      'Ekspansi bebas: gas memuai ke ruang hampa. Q nol karena terisolasi, W nol karena tidak ada tekanan lawan, sehingga delta U nol dan suhunya tidak berubah untuk gas ideal.',
      'Tekankan: meskipun Q nol, ini BUKAN proses adiabatik kuasi-statis. Ekspansi bebas itu ireversibel. Ini jebakan soal yang klasik.',
      'Siklik: setelah satu putaran penuh sistem kembali ke keadaan awal, jadi delta U nol. Kerja netonya sama dengan luas area di dalam kurva tertutup pada diagram P-V.',
      'Isokhorik: dV nol sehingga W nol, dan seluruh kalor masuk jadi energi internal.',
      'Isobarik: W sama dengan minus P dikali selisih volume. Contoh nyatanya penguapan air di wadah terbuka pada tekanan atmosfer.',
    ],
    simbol: [
      S.Q, S.W, S.D, S.U, S.d,
      { s: 'V_f', baca: 've-ef', arti: 'volume akhir' },
      { s: 'V_i', baca: 've-i', arti: 'volume awal' },
      { s: 'dV = 0', baca: 'de-ve sama dengan nol', arti: 'volume tetap, isokhorik' },
      { s: 'dP = 0', baca: 'de-pe sama dengan nol', arti: 'tekanan tetap, isobarik' },
    ],
  },

  /* ────────────────────────────────────────────────────────── 15 */
  nyata: {
    target: 60,
    notes: [
      'Quasi-statis: prosesnya berlangsung sangat lambat, infinitesimal, sehingga sistem praktis selalu berada dalam kesetimbangan di setiap tahap. Inilah yang memungkinkan kita menghitung kerja dengan integral P dV.',
      'Reversibilitas butuh DUA syarat sekaligus. Pertama, prosesnya harus quasi-statis. Kedua, tidak boleh ada gaya disipatif seperti gesekan atau viskositas.',
      'Tegaskan: quasi-statis saja tidak cukup. Proses yang lambat tapi ada gesekannya tetap ireversibel. Ini sering disalahpahami.',
      'Contoh ireversibel di dunia nyata: ekspansi bebas, perpindahan panas spontan dari benda panas ke benda dingin, dan pemanasan Joule pada hambatan listrik.',
      'Sebagian besar proses nyata masuk kategori ireversibel, karena efek disipatif hampir selalu ada.',
    ],
    simbol: [
      { s: 'P dV', baca: 'pe de-ve', arti: 'kerja yang sangat kecil pada perubahan volume' },
    ],
  },

  /* ────────────────────────────────────────────────────────── 16 */
  penutup: {
    target: 30,
    notes: [
      'Rangkum dalam satu kalimat: setiap sistem termodinamika adalah kompromi antara efisiensi reversibel yang ideal dan realitas ireversibel yang tak terhindarkan.',
      'Pemahaman taksonomi proses inilah yang jadi kunci untuk menganalisis efisiensi energi.',
      'Sebutkan sumbernya, lalu buka sesi tanya jawab.',
      'Tombol Ekspor PDF ada di slide ini kalau sewaktu-waktu diperlukan. Bisa juga ditekan dengan tombol P dari slide mana pun.',
    ],
    simbol: [
      { s: 'dW = −P dV', baca: 'de-we sama dengan minus pe de-ve', arti: 'Konvensi 1, kerja positif saat kompresi' },
      S.R,
    ],
  },
};

export default notes;
