# Kapasitas Panas & Proses Termodinamika

Deck presentasi berbasis web untuk mata kuliah Fisika Termal dan Statistika.
Digeser pakai gerakan tangan lewat kamera depan MacBook, atau panah keyboard.

Kelompok 4 - Ara Ayesha Putri Asnan, Khanum Aditiya Putra, Ramdhan Rizka Fakhresi
Kamis, 10 September 2026. Sumber materi: Sandeep Sharma, Bab 2.

---

## Menjalankan

```bash
npm install
npm start
```

`npm start` melakukan build lalu menyalakan server di `http://localhost:8011`.
Buka di **Chrome**, izinkan akses kamera saat diminta.

## GitHub Pages

Setelah workflow **Deploy GitHub Pages** selesai pada branch `main`, deck tersedia
di `https://himiko-lab.github.io/thermal-and-statistical-physics/`.
Deployment dibangun ulang otomatis setiap kali ada push ke `main`; workflow juga
bisa dijalankan manual dari tab **Actions**. Di repository settings, pilih
**Settings → Pages → Source: GitHub Actions** bila belum terpilih.

GitHub Pages menggunakan HTTPS, sehingga hand tracking dapat meminta akses kamera
seperti saat dijalankan lewat `localhost`. Izin kamera tetap harus diberikan di
browser untuk domain GitHub Pages tersebut.

Kalau sudah pernah build dan hanya ingin menyalakan servernya:

```bash
npm run serve
```

> Kamera hanya jalan di *secure context*. `http://localhost` termasuk, jadi
> tidak perlu sertifikat. Membuka file HTML langsung lewat `file://` **tidak
> akan** menyalakan kamera. Itulah alasan versi cadangan di bawah dibangun
> tanpa hand tracking.

### Versi cadangan tanpa kamera

`deck-offline.html` di folder ini adalah satu file HTML mandiri, sekitar 800 KB,
berisi seluruh deck. Klik dua kali, jalan tanpa server dan tanpa internet.
Navigasinya panah keyboard saja, tanpa gerakan tangan.

Bawa ini sebagai jaring pengaman hari-H. Kalau kamera bermasalah di ruangan,
buka file ini dan presentasi tetap jalan.

Untuk membangun ulang setelah mengubah isi:

```bash
npm run build:offline
```

---

## Kendali

| Tombol | Fungsi |
|---|---|
| `→` `spasi` | Buka isi slide, lalu lanjut ke slide berikutnya |
| `←` | Mundur satu tahap |
| `Home` `End` | Slide pertama / terakhir |
| `H` | Matikan / nyalakan hand tracking dan kamera |
| `S` | Ganti sensitivitas (Tenang / Normal / Sensitif) |
| `Z` | Besarkan kamera di tengah layar untuk demo |
| `C` | Sembunyikan preview kamera |
| `N` | Buka jendela catatan presenter |
| `P` | Ekspor PDF |
| `F` | Fullscreen |
| `?` | Bantuan |

### Gerakan tangan

Buka telapak, geser menyamping, lalu kendurkan. Minimal tiga jari harus
terentang. Tangan mengepal diabaikan, jadi gerakan alami saat menjelaskan tidak
menggeser slide.

Setiap slide hanya butuh **dua kali maju**: sekali untuk tiba di slide, sekali
untuk membuka seluruh isinya. Urutan yang lebih halus dari itu berjalan sendiri
lewat timer, bukan lewat klik tambahan. Di slide turunan `dH = dQ`, misalnya,
suku `VdP` baru terbang keluar setelah labelnya sempat terbaca, dan kesimpulannya
mendarat paling akhir. Klik sekali lalu diam sekitar dua detik.

`H` adalah pengaman utama. Kalau deteksi mulai kacau karena cahaya aneh atau
backlight jendela, tekan `H` sekali dan lanjut pakai panah.

Kode deteksinya (`public/gesture.js`) disalin dari deck Sensatype. Logika
deteksinya tidak disentuh, karena sudah melewati penyetelan di ruangan
sungguhan. Penyetelan lanjutan ada di `PRESETS` dan `CONFIG` di dalam berkas
itu. Yang diubah hanya dua hal di luar logika deteksi:

- **Penjaga kemacetan.** Kadang kamera menyala tetapi tidak pernah mengirim
  satu frame pun: `play()` ditolak diam-diam, tab sempat tersembunyi saat
  start, atau track direbut aplikasi lain. Kalau selama 2,5 detik tidak ada
  frame yang terproses, sesi videonya dibangun ulang sendiri. Kalau track-nya
  memang sudah mati, stream diminta ulang dari awal.
- **`start()` aman dipanggil berkali-kali.** Ia dipanggil saat mount, saat
  status diklik untuk mencoba lagi, dan oleh penjaga kemacetan. Dua pemanggilan
  yang tumpang tindih bisa meminta kamera dua kali dan saling menimpa
  `srcObject`, yang justru menghasilkan kamera menyala tanpa pelacakan.

### Kalau rangka tangan bergerak berlawanan arah

`gesture.js` menggambar rangkanya dalam koordinat cermin, supaya cocok dengan
video yang tampil seperti cermin. Jadi **hanya elemen `<video>` yang boleh
diberi `transform: scaleX(-1)`**, tidak canvas-nya. Kalau canvas ikut dibalik,
pembalikan terjadi dua kali dan rangkanya bergerak berlawanan dengan tangan
aslinya. Aturannya ada di `.cam-box video` pada `src/styles.css`.

Kalau yang terbalik justru arah slide-nya, bukan rangkanya, ubah
`invertDirection` di `CONFIG`.

---

## Ekspor PDF

Tekan `P`, atau klik tombol **Ekspor PDF** di slide penutup.

Di dialog cetak Chrome, buka **More settings** lalu centang **Background
graphics**. Tanpa itu Chrome membuang seluruh warna latar dan PDF-nya keluar
putih polos dengan teks terang yang nyaris tak terbaca.

Yang tercetak hanya materinya. HUD kamera, status deteksi, bar progres,
petunjuk tombol, dan tombol ekspor itu sendiri tidak ikut. Tiap slide jadi satu
halaman lanskap, dan semua tahap dipaksa ke keadaan akhir sehingga tidak ada
elemen yang hilang. Rumus dicetak dalam keadaan terurai lengkap dengan label,
karena bentuk itu yang paling informatif di atas kertas.

Teksnya tetap teks sungguhan, bukan gambar, jadi bisa diseleksi, disalin, dan
dibaca ekstraktor teks.

---

## Menambah dan mengubah isi

Semua isi ada di `src/content/`. Komponen tidak perlu disentuh.

### Menambah rumus ber-exploded view

Rumus ditulis sebagai daftar suku, bukan teks utuh. Tiap suku bisa terbang
terpisah sambil membawa labelnya.

```jsx
<Formula
  size={66}
  box={248}                        // tinggi ruang yang dicadangkan
  exploded={step >= 1}
  labels={step >= 1}
  spread={{ x: 132, y: 76 }}       // jarak terbang, satuan piksel
  terms={[
    { t: <V>H</V>, dir: [-1.4, -0.42], side: 'up',   label: 'Entalpi' },
    { t: <Equals size={32} weight="light" />, op: true },
    { t: <V>U</V>, dir: [0, 0.46],     side: 'down', label: 'Energi internal' },
    { t: '+', op: true },
    { t: <><V>P</V><V>V</V></>, dir: [1.4, -0.42], side: 'up', label: 'Kerja' },
  ]}
/>
```

| Properti suku | Arti |
|---|---|
| `t` | Isi suku, boleh JSX |
| `dir` | Arah terbang `[x, y]`, dikali `spread` |
| `side` | Paksa label ke `'up'` atau `'down'` |
| `op` | `true` untuk operator (`=`, `+`); tampil redup, tidak diberi label |
| `label` | Keterangan yang muncul di tahap berlabel |
| `state` | `'dim'`, `'hot'`, `'cool'`, atau `'gone'` |

`state: 'gone'` membuat suku terbang keluar dan memudar. Dipakai untuk
menunjukkan suku yang nol pada suatu batasan, misalnya `VdP` saat `dP = 0`.
Operator di depannya ikut hilang sendiri, tidak perlu diatur.

Pembantu notasi: `<V>` untuk variabel miring, `<Frac a b />` untuk pecahan,
`<Paren sub>` untuk kurung besar bersubskrip.

### Menambah slide

Tambah satu objek di array paling bawah `src/content/slides.jsx`. **Selalu
`steps: 2`**, supaya seluruh deck konsisten dua kali maju per slide.

```jsx
{
  id: 'nama-unik',
  title: 'Judul untuk catatan presenter',
  steps: 2,
  className: 'slide--center',      // opsional, default rata atas
  render: ({ step, phase, no, total }) => (
    <>
      <SlideHead eyebrow="05 · Taksonomi" no={no} total={total} />
      <h2 className="h2">Judul slide</h2>

      {/* muncul saat klik kedua */}
      <Reveal at={1} step={step}><p className="lead">Isi utama</p></Reveal>

      {/* menyusul sendiri lewat timer, tanpa klik tambahan */}
      <Reveal at={1} step={step} delay={220}><p className="tiny">Menyusul</p></Reveal>
      <Reveal at={3} step={phase}><p className="tiny">Menyusul lebih lama</p></Reveal>
    </>
  ),
}
```

Ada dua cara menunda kemunculan, dan keduanya tidak menambah klik:

- **`delay`** pada `Reveal` untuk jeda kecil yang cukup pakai CSS.
- **`phase`** untuk urutan yang butuh perubahan keadaan sungguhan, misalnya suku
  rumus yang harus berubah jadi `state: 'gone'`. Fase naik otomatis mengikuti
  `CASCADE` di `src/hooks/useCascade.js` (0, 380, 1100, dan 1720 milidetik).

Penomoran slide, bar progres, dan navigasi menyesuaikan sendiri.

### Catatan presenter

`src/content/notes.js`, satu entri per `id` slide. Tekan `N` saat presentasi
untuk membukanya di jendela terpisah, lengkap dengan timer dan target durasi.

> Layar harus **extended**, bukan mirrored. System Settings, Displays, matikan
> "Mirror Displays". Taruh jendela deck di proyektor lalu tekan `F`, dan jendela
> catatan di layar MacBook. Latih langkah ini sebelum hari-H.

---

## Sebelum hari-H

1. Latihan di ruangan yang sama dengan pencahayaan yang sama. Backlight dari
   jendela di belakang kamu adalah penyebab kegagalan nomor satu.
2. Cek jarak. Kamera MacBook punya sudut pandang terbatas; di luar sekitar
   1,5 m tangan mudah keluar frame.
3. Colokkan charger. Inference kamera terus-menerus menguras baterai.
4. Nyalakan Do Not Disturb.
5. Siapkan `deck-offline.html` di Desktop sebagai cadangan, dan ingat tombol `H`.

---

## Susunan berkas

```
src/
  App.jsx                 navigasi, papan tik, HUD, jendela catatan, ekspor PDF
  styles.css              tema, animasi, dan aturan cetak
  fonts/                  Poppins subset latin, di-bundle sendiri
  content/
    slides.jsx            isi 15 slide
    notes.js              catatan presenter per slide
  components/
    Formula.jsx           rumus sebagai exploded view
    ExplodedGrid.jsx      kepingan yang meledak keluar dari titik tengah
    Reveal.jsx            elemen yang muncul pada tahap tertentu
    SlideHead.jsx         kepala slide: penanda bagian, garis, nomor
    Piston.jsx            silinder gas dengan piston terkunci atau bebas
    PVChart.jsx           diagram P-V isotermal dibanding adiabatik
  hooks/
    useGesture.js         jembatan ke HandGestureController
    useCascade.js         koreografi berbasis waktu, bukan berbasis klik
public/
  gesture.js              detektor gerakan tangan (salinan, jangan diubah)
  vendor/                 MediaPipe Hand Landmarker, 26 MB
serve.py                  server lokal dengan MIME dan header yang benar
deck-offline.html         versi cadangan satu file, tanpa kamera
```

## Animasi

Setiap slide dibuka dengan satu klik, lalu isinya masuk bertahap sendiri.
Urutannya diatur `CASCADE` di `src/hooks/useCascade.js`: 0, 380, 1100, dan 1720
milidetik. Aset ikut beranimasi, tidak cuma teks:

| Aset | Yang bergerak |
|---|---|
| Kurva P-V | Garisnya menggambar dirinya sendiri dari kiri ke kanan, isotermal dulu, adiabatik menyusul |
| Piston | Kolom gas memuai ke atas bersamaan dengan pistonnya naik |
| Bar energi | Mengisi dari kiri, segmen kerja ekspansi menyusul setelah segmen ΔU |
| Kepingan grid | Meledak keluar dari satu titik di tengah, berurutan |
| Suku rumus | Terbang ke posisinya masing-masing, label menyusul lewat garis penunjuk |

### Kenapa mulus

Yang dianimasikan hanya `transform`, `opacity`, dan `stroke-dashoffset`. Tidak
ada satu pun transisi pada `width`, `height`, `top`, atau `margin`, karena
properti seperti itu memaksa browser menghitung ulang tata letak di setiap
frame. Bar energi dan bar progres memakai `scaleX`, bukan `width`. Pemuaian gas
di piston memakai `scaleY` berjangkar di dasar silinder, bukan atribut `y` dan
`height` pada SVG.

Dua hal lagi yang menjaga frame rate: petunjuk `will-change` hanya diberikan
pada slide yang sedang aktif, dan animasi CSS di slide tersembunyi dihentikan,
bukan sekadar disembunyikan. Kelima belas slide memang ter-mount bersamaan, jadi
tanpa dua pembatasan itu molekul gas di beberapa slide akan terus berdenyut di
latar belakang dan ratusan elemen sekaligus meminta lapisan komposit sendiri.

Kalau macOS diatur "Reduce Motion", seluruh animasi dimatikan dan semua elemen
langsung tampil di keadaan akhir.

## Catatan desain

Warna utama emas, sekunder putih, di atas hitam pekat. Sengaja rata: tanpa
gradien latar, tanpa kartu bercahaya, tanpa bayangan tebal. Struktur dibangun
dari garis rambut satu piksel dan hierarki tipografi. Emas dipakai irit, hanya
untuk penanda bagian, garis, dan satu istilah kunci per slide.

Kode warna materi: **emas** berarti kalor, panas, sistem yang menerima energi.
**Putih** berarti dingin, terkunci, isotermal.

Antarmuka memakai Poppins, tetapi rumus sengaja dibiarkan serif. Kontras antara
dua jenis huruf itu yang membuat notasi fisikanya terbaca sebagai notasi, bukan
sebagai teks poster.

Poppins di-bundle sendiri di `src/fonts/`, bukan diambil dari Google Fonts.
`serve.py` mengirim header COEP `require-corp` yang memblokir seluruh resource
lintas-origin, jadi font dari CDN tidak akan pernah termuat.

Dibangun dengan React 19, HeroUI v3, Tailwind CSS v4, Phosphor Icons, dan Vite.
