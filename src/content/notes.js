/**
 * Catatan presenter, satu entri per slide (dikunci dengan id slide).
 *
 * Slide sengaja dibuat sangat minimalis; uraian lengkapnya ada di sini. Edit
 * bebas, tidak perlu menyentuh slides.jsx.
 *
 *   target - perkiraan durasi bicara dalam detik
 *   notes  - poin yang diucapkan, bukan yang ditampilkan
 */
export const notes = {
  sampul: {
    target: 40,
    notes: [
      'Perkenalkan kelompok dan judul: Kapasitas Panas dan Proses Termodinamika, dari Sandeep Sharma Bab 2.',
      'Sebutkan benang merahnya: kita akan lihat bagaimana sistem merespons kalor, lalu bagaimana respons itu diklasifikasikan jadi berbagai proses.',
    ],
  },
  peta: {
    target: 50,
    notes: [
      'Enam bagian ini berurutan, bukan daftar acak.',
      'Kapasitas panas memunculkan kebutuhan akan entalpi. Entalpi menjelaskan kenapa CP lebih besar dari CV. Setelah paham perpindahan energinya, kita ukur lewat kalorimetri, lalu klasifikasikan prosesnya, dan terakhir kita hadapkan pada kenyataan bahwa proses nyata tidak ideal.',
    ],
  },
  definisi: {
    target: 90,
    notes: [
      'Poin utama: kapasitas panas BUKAN konstanta material seperti massa jenis. Ia respons dinamis, dan nilainya bergantung pada batasan yang kita terapkan.',
      'Alfa itu parameter yang dijaga konstan. Kalau volume yang dijaga, kita dapat CV. Kalau tekanan, kita dapat CP.',
      'Jadi satu zat yang sama bisa punya lebih dari satu nilai kapasitas panas. Ini yang sering salah dipahami.',
      'Satuan: joule per kelvin.',
    ],
  },
  cvcp: {
    target: 100,
    notes: [
      'CV: sistem rigid, volume terkunci. Karena dV = 0, maka dW = −P dV = 0. Tidak ada kerja mekanis sama sekali.',
      'Konsekuensinya seluruh kalor masuk jadi energi internal, sehingga CV = (∂U/∂T) pada V tetap.',
      'CP: piston bebas bergerak supaya tekanan tetap. Di sini kalor terbagi dua, sebagian jadi energi internal, sebagian jadi kerja ekspansi.',
      'Karena itu bentuk formalnya memakai entalpi, bukan energi internal: CP = (∂H/∂T) pada P tetap. Slide berikutnya menjelaskan kenapa.',
    ],
  },
  sifat: {
    target: 70,
    notes: [
      'Kapasitas panas C bersifat ekstensif: gandakan massanya, gandakan pula nilainya.',
      'Kapasitas panas spesifik c bersifat intensif: sudah dinormalisasi per satuan massa atau per mol.',
      'Kenapa ini penting dalam desain eksperimen: kalau kita mau membandingkan karakteristik intrinsik dua material, kita harus pakai besaran intensif. Kalau tidak, yang terbaca hanyalah perbedaan banyaknya zat.',
    ],
  },
  entalpi: {
    target: 85,
    notes: [
      'Untuk analisis isobarik, yang paling umum di reaksi kimia dan proses industri, energi internal saja tidak memadai.',
      'H = U + PV. Suku PV itu energi yang terkait dengan sistem menempati ruang sebesar V pada tekanan P.',
      'Entalpi adalah fungsi keadaan, sama seperti U. Nilainya tidak bergantung pada jalur.',
    ],
  },
  turunan: {
    target: 120,
    notes: [
      'Ini turunan yang paling penting di bagian ini. Ambil bentuk diferensial dari H = U + PV.',
      'dH = dU + P dV + V dP. Tiga suku.',
      'Sekarang terapkan batasan tekanan konstan: dP = 0, sehingga suku V dP hilang.',
      'Sisanya dH = dU + P dV.',
      'Bandingkan dengan Hukum Pertama dalam konvensi ini: dQ = dU + P dV. Ruas kanannya identik.',
      'Kesimpulan: dH = dQ pada tekanan konstan. Inilah alasan entalpi disebut "kalor pada tekanan tetap", dan alasan CP didefinisikan lewat H.',
      'Beri jeda sebentar di sini, ini poin yang perlu dicerna.',
    ],
  },
  molar: {
    target: 70,
    notes: [
      'Standarisasi dengan mol: c = C/n.',
      'Pertanyaan "so what": kenapa mol, bukan massa? Karena mol menghitung jumlah partikel, bukan berat partikel.',
      'Dengan mol, perbedaan massa atomik antar zat tereliminasi. Yang tersisa untuk dibandingkan adalah derajat kebebasan internal molekulnya, yaitu berapa banyak cara molekul itu bisa menyimpan energi.',
      'Ini memberi gambaran yang lebih murni tentang perilaku molekuler.',
    ],
  },
  kenapa: {
    target: 110,
    notes: [
      'Analogi piston. Kalau piston dipaku, gas cepat panas karena energi tidak "bocor" ke mana-mana.',
      'Kalau piston dibiarkan bebas, sebagian energi terpakai mendorong piston naik melawan tekanan lingkungan.',
      'Maka untuk mencapai kenaikan suhu yang SAMA, pada tekanan tetap kita butuh kalor LEBIH BANYAK.',
      'Perhatikan arah kalimatnya: bukan suhunya yang lebih rendah, tapi kalor yang dibutuhkan yang lebih besar.',
      'Karena itu CP selalu lebih besar dari CV, untuk gas ideal maupun gas nyata. Ini konsekuensi kekekalan energi, bukan sifat khusus zat tertentu.',
      'Tunggu sekitar 1,5 detik sampai bar selesai mengisi sebelum lanjut bicara.',
    ],
  },
  contoh: {
    target: 95,
    notes: [
      'Slide ini yang mengubah presentasi dari menjelaskan konsep jadi menerapkannya. Bacakan angkanya pelan-pelan.',
      'Ambil 1 mol gas ideal monoatomik, naikkan suhunya 10 kelvin. Monoatomik berarti hanya punya tiga derajat kebebasan translasi, sehingga CV molar = 3/2 R.',
      'Volume tetap: CV molar 12,47 sehingga Q = 124,7 joule. Semuanya jadi energi internal, tidak ada kerja sama sekali.',
      'Tekanan tetap: CP molar 20,79 sehingga Q = 207,9 joule. Padahal kenaikan suhunya sama persis, jadi perubahan energi internalnya juga sama, 124,7 joule.',
      'Selisihnya 83,1 joule. Itu bukan angka acak: nilainya persis nR delta T, dan itulah kerja yang dipakai sistem untuk mendorong pistonnya.',
      'Tegaskan tandanya. Kita pakai Konvensi 1, jadi kerja saat memuai bernilai NEGATIF: W = minus 83,1 joule. Cek Hukum Pertama: delta U = Q + W = 207,9 dikurangi 83,1 = 124,7. Cocok.',
      'Kalau ditanya kenapa delta U-nya sama di kedua kasus: karena energi internal gas ideal hanya bergantung pada suhu, tidak pada volume.',
    ],
  },
  kalorimetri: {
    target: 75,
    notes: [
      'Dalam sistem komposit yang terisolasi termal, energi tidak diciptakan atau dimusnahkan, hanya berpindah.',
      'QA = −QB. Tanda minus itu penting: kalor yang dilepas satu komponen persis sama dengan yang diterima komponen lain.',
      'Bentuk lain yang sering dipakai: Q lepas + Q terima = 0.',
      'Kesetimbangan termal tercapai saat suhu seragam, sehingga aliran neto kalor berhenti. Perhatikan kata "neto": pertukaran di tingkat mikroskopis tetap terjadi.',
    ],
  },
  taksonomi: {
    target: 90,
    notes: [
      'Enam proses ini adalah kerangka untuk sisa pembahasan.',
      'Tegaskan konvensi tandanya lebih dulu, karena inilah sumber kesalahan paling umum. Kita pakai Konvensi 1: dW = −P dV.',
      'Artinya kerja positif bila dilakukan PADA sistem, yaitu saat kompresi. Kerja negatif bila dilakukan OLEH sistem, yaitu saat ekspansi.',
      'Kalau di buku lain tandanya terbalik, itu Konvensi 2. Bukan salah, hanya beda kesepakatan. Yang penting konsisten.',
    ],
  },
  adiabatik: {
    target: 115,
    notes: [
      'Isotermal: suhu tetap, PV = konstan. Untuk gas ideal, ΔU = 0, sehingga seluruh kalor yang masuk keluar lagi sebagai kerja. Kerjanya W = −nRT ln(Vf/Vi).',
      'Penting: ΔU = 0 itu khusus gas ideal, karena energi internal gas ideal hanya fungsi suhu.',
      'Adiabatik: tidak ada pertukaran kalor, dQ = 0, dan PV pangkat gamma = konstan. Karena Q = 0, seluruh perubahan energi internal berasal dari kerja: ΔU = W = n CV ΔT.',
      'Sekarang derivasi kemiringannya. Isotermal: P = C/V, turunkan, dapat dP/dV = −P/V.',
      'Adiabatik: P = C/V pangkat gamma, turunkan, dapat dP/dV = −gamma P/V.',
      'Karena gamma = CP/CV dan kita sudah buktikan CP > CV, maka gamma > 1. Jadi kemiringan adiabatik adalah gamma kali kemiringan isotermal.',
      'Interpretasi fisisnya: pada adiabatik, tekanan turun bukan hanya karena volume membesar, tapi juga karena suhu ikut turun. Dua efek sekaligus, jadi kurvanya lebih curam.',
    ],
  },
  kasus: {
    target: 105,
    notes: [
      'Ekspansi bebas: gas memuai ke ruang hampa. Q = 0 karena terisolasi, W = 0 karena tidak ada tekanan lawan, sehingga ΔU = 0 dan suhu tidak berubah untuk gas ideal.',
      'Tekankan: meskipun Q = 0, ini BUKAN proses adiabatik kuasi-statis. Ekspansi bebas itu ireversibel. Jangan disamakan.',
      'Siklik: setelah satu putaran penuh sistem kembali ke keadaan awal, jadi ΔU = 0. Kerja netonya sama dengan luas area di dalam kurva tertutup pada diagram P-V.',
      'Isokhorik: dV = 0 sehingga W = 0, dan seluruh kalor masuk jadi energi internal.',
      'Isobarik: W = −P (Vf − Vi). Contoh fenomenologis, penguapan air di wadah terbuka pada tekanan atmosfer.',
    ],
  },
  nyata: {
    target: 100,
    notes: [
      'Quasi-statis: proses berlangsung sangat lambat, infinitesimal, sehingga sistem selalu praktis berada dalam kesetimbangan. Ini yang memungkinkan kita menghitung kerja dengan integral P dV.',
      'Reversibilitas butuh DUA syarat sekaligus. Pertama, prosesnya harus quasi-statis. Kedua, tidak boleh ada gaya disipatif seperti gesekan atau viskositas.',
      'Tegaskan: quasi-statis saja tidak cukup. Proses lambat yang ada gesekannya tetap ireversibel.',
      'Contoh ireversibel di dunia nyata: ekspansi bebas, perpindahan panas spontan dari panas ke dingin, dan pemanasan Joule pada hambatan listrik.',
      'Sebagian besar proses nyata ireversibel, karena efek disipatif hampir selalu ada.',
    ],
  },
  penutup: {
    target: 45,
    notes: [
      'Rangkum: setiap sistem termodinamika adalah kompromi antara efisiensi reversibel yang ideal dan realitas ireversibel.',
      'Pemahaman taksonomi proses inilah yang jadi kunci menganalisis efisiensi energi.',
      'Buka sesi tanya jawab.',
      'Tombol Ekspor PDF ada di slide ini kalau diperlukan.',
    ],
  },
};

export default notes;
