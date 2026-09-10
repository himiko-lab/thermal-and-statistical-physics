import {
  ArrowLineUp, ArrowsClockwise, Atom, FlowArrow, Lock, LockOpen,
  Package, Scales, Snowflake, Thermometer,
} from '@phosphor-icons/react';

import Reveal from '../components/Reveal.jsx';
import SlideHead from '../components/SlideHead.jsx';
import Formula, { Frac, Paren, V } from '../components/Formula.jsx';
import ExplodedGrid from '../components/ExplodedGrid.jsx';
import Piston from '../components/Piston.jsx';
import PVChart from '../components/PVChart.jsx';

/**
 * Isi deck.
 *
 * Aturan tetap: setiap slide punya tepat DUA tahap. Tahap 0 adalah keadaan
 * saat slide baru tiba (kepala, judul, dan jangkar visualnya). Satu klik lagi
 * membuka seluruh isinya. Urutan yang lebih halus dari itu dijalankan oleh
 * waktu lewat `phase`, bukan oleh klik tambahan. Lihat hooks/useCascade.js.
 *
 * Menambah slide berarti menambah satu entri di array paling bawah. Rumus
 * ditulis sebagai daftar suku supaya bisa meledak terpisah; lihat
 * components/Formula.jsx.
 */

const ANGGOTA = ['Ara Ayesha Putri Asnan', 'Khanum Aditiya Putra', 'Ramdhan Rizka Fakhresi'];

/**
 * Sumber materi. Isi yang bertanda LENGKAPI dengan data sebenarnya dari buku
 * yang kalian pakai; jangan dibiarkan, karena sitasi yang tidak bisa
 * ditelusuri justru merugikan saat dinilai.
 */
const SUMBER = {
  penulis: 'Sandeep Sharma',
  judul: 'LENGKAPI: judul lengkap buku',
  edisi: 'LENGKAPI: edisi',
  tahun: 'LENGKAPI: tahun terbit',
  penerbit: 'LENGKAPI: penerbit',
  bab: 'Bab 2, Heat Capacities and Thermodynamic Processes',
  halaman: 'LENGKAPI: rentang halaman',
};

const Unit = ({ children }) => (
  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.52em', color: 'var(--ink-3)', marginLeft: '0.4em' }}>
    {children}
  </span>
);

const Syarat = ({ children }) => (
  <p className="syarat"><b>Syarat</b><span>{children}</span></p>
);

const Names = () => (
  <div className="names">
    {ANGGOTA.map((n) => <span key={n}>{n}</span>)}
  </div>
);

// Isi baris dibungkus satu span. Tanpa itu, setiap potongan teks dan setiap
// <span> di dalamnya jadi flex item terpisah, sehingga kata yang disorot
// terlempar ke baris sendiri dengan celah aneh di kiri-kanannya.
const Bullet = ({ children }) => (
  <p className="row"><span className="tick" /><span>{children}</span></p>
);

/* ══════════════════════════════════════════════════════════════ 1. sampul */
const sampul = {
  id: 'sampul',
  title: 'Sampul',
  steps: 2,
  className: 'slide--center',
  render: ({ step }) => (
    <>
      <Reveal at={0} step={step}>
        <div className="head" style={{ marginBottom: 30 }}>
          <span className="head-eyebrow">Fisika Termal dan Statistika</span>
          <span className="head-rule" />
        </div>
      </Reveal>

      <Reveal at={0} step={step} delay={100}>
        <h1 className="h1">
          Kapasitas Panas<br />
          <span className="dim">dan</span> Proses Termodinamika
        </h1>
      </Reveal>

      <Reveal at={1} step={step} style={{ marginTop: 34 }}>
        <p className="lead" style={{ marginBottom: 26 }}>Sandeep Sharma, Bab 2</p>
        <Names />
        <p className="tiny" style={{ marginTop: 18 }}>Kelompok 4 &nbsp;&middot;&nbsp; Kamis, 10 September 2026</p>
      </Reveal>
    </>
  ),
};

/* ═══════════════════════════════════════════════════════ 2. peta materi */
const PETA = [
  { n: '01', Icon: Thermometer, t: 'Kapasitas Panas', s: 'Nilainya ditentukan oleh proses, bukan oleh zat saja' },
  { n: '02', Icon: Package, t: 'Entalpi', s: 'Fungsi keadaan untuk proses bertekanan tetap' },
  { n: '03', Icon: ArrowLineUp, t: 'Mengapa CP > CV', s: 'Ke mana kalor pergi saat sistem boleh memuai' },
  { n: '04', Icon: Scales, t: 'Kalorimetri', s: 'Kekekalan energi di dalam sistem terisolasi' },
  { n: '05', Icon: FlowArrow, t: 'Proses Termodinamika', s: 'Isotermal, adiabatik, dan kerabat-kerabatnya' },
  { n: '06', Icon: ArrowsClockwise, t: 'Ideal dan Nyata', s: 'Quasi-statis, reversibel, ireversibel' },
];

const peta = {
  id: 'peta',
  title: 'Peta materi',
  steps: 2,
  render: ({ step, no, total }) => (
    <>
      <SlideHead eyebrow="Peta materi" no={no} total={total} />
      <Reveal at={0} step={step}>
        <h2 className="h2">Enam kepingan, satu alur</h2>
        <p className="tiny" style={{ marginBottom: 26 }}>
          Setiap bagian memunculkan kebutuhan akan bagian berikutnya.
        </p>
      </Reveal>

      <ExplodedGrid out={step >= 1} columns={3}>
        {PETA.map(({ n, Icon, t, s }) => (
          <div key={n} className="piece">
            <Icon size={26} weight="light" className="piece-icon" />
            <div className="piece-index">{n}</div>
            <h3 className="piece-title">{t}</h3>
            <p className="piece-sub">{s}</p>
          </div>
        ))}
      </ExplodedGrid>
    </>
  ),
};

/* ═════════════════════════════════════════════ 3. definisi kapasitas panas */
const definisi = {
  id: 'definisi',
  title: 'Definisi kapasitas panas',
  steps: 2,
  render: ({ step, phase, no, total }) => (
    <>
      <SlideHead eyebrow="01 · Fondasi" no={no} total={total} />
      <h2 className="h2">Bukan satu nilai universal</h2>
      <p className="tiny" style={{ marginTop: -4 }}>
        Nilainya bergantung pada keadaan sistem dan pada proses yang dijalaninya.
      </p>

      <Formula
        size={70}
        box={300}
        exploded={phase >= 1}
        labels={phase >= 2}
        spread={{ x: 148, y: 36 }}
        terms={[
          { t: <><V>C</V><sub style={{ fontSize: '0.5em' }}>α</sub></>, dir: [-1.3, -0.42], side: 'up', label: 'Respons sistem terhadap perubahan suhu' },
          { t: '=', op: true },
          { t: <Paren><Frac a={<>d<V>Q</V></>} b={<>d<V>T</V></>} /></Paren>, dir: [0.05, 0.46], side: 'down', label: 'Kalor yang dipertukarkan per satu satuan kenaikan suhu' },
          { t: <span style={{ fontSize: '0.5em' }}>α</span>, dir: [1.42, -0.42], side: 'up', label: 'Batasan yang dijaga tetap. Di sinilah fisikanya.' },
        ]}
      />

      <Reveal at={3} step={phase}>
        <div className="stack" style={{ display: 'flex', gap: 56, alignItems: 'baseline' }}>
          <span className="eq" style={{ fontSize: 29 }}>
            α = <V>V</V> &nbsp;&rarr;&nbsp; <span className="gold"><V>C</V><sub style={{ fontSize: '0.55em' }}>V</sub></span>
          </span>
          <span className="eq" style={{ fontSize: 29 }}>
            α = <V>P</V> &nbsp;&rarr;&nbsp; <span className="gold"><V>C</V><sub style={{ fontSize: '0.55em' }}>P</sub></span>
          </span>
          <span className="tiny">Satu zat, banyak nilai <V>C</V>.</span>
        </div>
      </Reveal>
    </>
  ),
};

/* ═══════════════════════════════════════════════════════ 4. CV vs CP */
const cvcp = {
  id: 'cvcp',
  title: 'CV dibanding CP',
  steps: 2,
  render: ({ step, no, total }) => (
    <>
      <SlideHead eyebrow="01 · Fondasi" no={no} total={total} />
      <h2 className="h2">Dua batasan, dua besaran</h2>
      <p className="tiny" style={{ marginBottom: 24 }}>Silinder yang sama, perlakuan yang berbeda.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 44 }}>
        <Reveal at={1} step={step} style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
          <Piston free={false} heated={step >= 1} play={step >= 1} width={150} height={196} />
          <div>
            <div className="tag">Volume tetap</div>
            <div className="eq" style={{ fontSize: 40, marginBottom: 18 }}>
              <V>C</V><sub style={{ fontSize: '0.5em' }}>V</sub> = <Paren sub="V"><Frac a={<>&part;<V>U</V></>} b={<>&part;<V>T</V></>} /></Paren>
            </div>
            <div className="rows">
              <Bullet>Piston terpaku, sistem rigid</Bullet>
              <Bullet>Tidak ada kerja mekanis, <V>dW</V> = 0</Bullet>
            </div>
          </div>
        </Reveal>

        <Reveal at={1} step={step} delay={220} style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
          <Piston free heated={step >= 1} play={step >= 1} width={150} height={196} />
          <div>
            <div className="tag">Tekanan tetap</div>
            <div className="eq" style={{ fontSize: 40, marginBottom: 18 }}>
              <V>C</V><sub style={{ fontSize: '0.5em' }}>P</sub> = <Paren sub="P"><Frac a={<>&part;<V>H</V></>} b={<>&part;<V>T</V></>} /></Paren>
            </div>
            <div className="rows">
              <Bullet>Piston bebas naik</Bullet>
              <Bullet>Kalor terbagi: energi internal dan kerja ekspansi</Bullet>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  ),
};

/* ══════════════════════════════════════════════ 5. ekstensif vs intensif */
const sifat = {
  id: 'sifat',
  title: 'Ekstensif dan intensif',
  steps: 2,
  render: ({ step, no, total }) => (
    <>
      <SlideHead eyebrow="01 · Fondasi" no={no} total={total} />
      <h2 className="h2">Bergantung ukuran, atau tidak</h2>
      <p className="tiny" style={{ marginBottom: 34 }}>Pembedaan yang menentukan besaran mana yang layak dibandingkan.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
        <Reveal at={1} step={step} className="stack">
          <div className="tag tag--plain">Ekstensif</div>
          <div className="eq gold" style={{ fontSize: 58, margin: '4px 0 20px' }}><V>C</V></div>
          <p className="lead" style={{ fontSize: 20 }}>
            Berskala dengan dimensi sistem. Makin besar massanya, makin besar energi yang dibutuhkan.
          </p>
        </Reveal>

        <Reveal at={1} step={step} delay={200} className="stack">
          <div className="tag tag--plain">Intensif</div>
          <div className="eq gold" style={{ fontSize: 44, margin: '4px 0 14px', lineHeight: 1.5 }}>
            <div><V>C</V><sub style={{ fontSize: '0.5em' }}>m</sub> = <V>C</V>/<V>n</V><Unit>J mol⁻¹ K⁻¹</Unit></div>
            <div><V>c</V> = <V>C</V>/<V>m</V><Unit>J kg⁻¹ K⁻¹</Unit></div>
          </div>
          <p className="lead" style={{ fontSize: 20 }}>
            Dinormalisasi per mol atau per satuan massa. Ciri intrinsik material, lepas dari banyaknya zat.
          </p>
        </Reveal>
      </div>

      <Reveal at={1} step={step} delay={420}>
        <p className="tiny" style={{ marginTop: 36 }}>
          Normalisasi membuat kita membandingkan <span className="gold">sifat zat</span>, bukan banyaknya zat.
        </p>
      </Reveal>
    </>
  ),
};

/* ═══════════════════════════════════════════════════════════ 6. entalpi */
const entalpi = {
  id: 'entalpi',
  title: 'Entalpi',
  steps: 2,
  render: ({ step, phase, no, total }) => (
    <>
      <SlideHead eyebrow="02 · Entalpi" no={no} total={total} />
      <h2 className="h2">Energi internal saja tidak cukup</h2>

      <Formula
        size={76}
        box={292}
        exploded={phase >= 1}
        labels={phase >= 2}
        spread={{ x: 164, y: 36 }}
        terms={[
          { t: <V>H</V>, dir: [-1.42, -0.42], side: 'up', label: 'Total energi yang relevan saat tekanan dijaga tetap' },
          { t: '=', op: true },
          { t: <V>U</V>, dir: [0, 0.46], side: 'down', label: 'Energi internal yang tersimpan di dalam sistem' },
          { t: '+', op: true },
          { t: <><V>P</V><V>V</V></>, dir: [1.42, -0.42], side: 'up', label: 'Kerja untuk menempati ruang V pada tekanan P' },
        ]}
      />

      <Reveal at={3} step={phase}>
        <p className="tiny">
          Entalpi adalah fungsi keadaan, sama seperti <V>U</V>. Dipakai pada analisis isobarik,
          yang justru paling umum di reaksi kimia dan proses industri.
        </p>
      </Reveal>
    </>
  ),
};

/* ══════════════════════════════ 7. turunan dH = dQ pada tekanan tetap */
const turunan = {
  id: 'turunan',
  title: 'Turunan dH = dQ pada tekanan tetap',
  steps: 2,
  render: ({ step, phase, no, total }) => (
    <>
      <SlideHead eyebrow="02 · Entalpi" no={no} total={total} />
      <h2 className="h2">Satu suku yang menghilang</h2>

      <Formula
        size={58}
        box={248}
        exploded={phase >= 1}
        labels={phase >= 2}
        spread={{ x: 118, y: 36 }}
        terms={[
          { t: <>d<V>H</V></>, dir: [-1.85, -0.4], side: 'up' },
          { t: '=', op: true },
          { t: <>d<V>U</V></>, dir: [-0.5, 0.46], side: 'down', label: 'Perubahan energi internal' },
          { t: '+', op: true },
          { t: <><V>P</V>d<V>V</V></>, dir: [0.52, -0.4], side: 'up', label: 'Kerja ekspansi melawan lingkungan' },
          { t: '+', op: true },
          {
            t: <><V>V</V>d<V>P</V></>,
            dir: [1.85, 0.46],
            side: 'down',
            label: 'Nol saat tekanan dijaga tetap',
            state: phase >= 3 ? 'gone' : undefined,
          },
        ]}
        note={
          phase >= 4
            ? <>Hukum Pertama: d<V>Q</V> = d<V>U</V> + <V>P</V>d<V>V</V>. Ruas kanan yang tersisa persis sama.</>
            : phase >= 3
              ? <>Tekanan tetap, jadi d<V>P</V> = 0</>
              : null
        }
      />

      <Reveal at={4} step={phase} style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
          <div className="eq gold" style={{ fontSize: 54, flex: 'none' }}>
            d<V>H</V> = d<V>Q</V><sub style={{ fontSize: '0.46em' }}>P</sub>
          </div>
          <p className="lead stack" style={{ fontSize: 20 }}>
            Pada tekanan konstan, kalor yang diserap sistem sama dengan perubahan entalpinya.
          </p>
        </div>
        <Syarat>
          sistem tertutup, tekanan konstan, dan satu-satunya kerja adalah <V>P</V>d<V>V</V>.
        </Syarat>
      </Reveal>
    </>
  ),
};

/* ═══════════════════════════════════════════════ 8. kapasitas panas molar */
const molar = {
  id: 'molar',
  title: 'Kapasitas panas molar',
  steps: 2,
  render: ({ step, phase, no, total }) => (
    <>
      <SlideHead eyebrow="02 · Entalpi" no={no} total={total} />
      <h2 className="h2">Kenapa mol yang dijadikan patokan</h2>

      <Formula
        size={58}
        box={300}
        exploded={phase >= 1}
        labels={phase >= 2}
        spread={{ x: 146, y: 36 }}
        terms={[
          { t: <><V>C</V><sub style={{ fontSize: '0.5em' }}>m</sub></>, dir: [-1.38, -0.42], side: 'up', label: 'Kapasitas panas molar, satuan J mol⁻¹ K⁻¹' },
          { t: '=', op: true },
          { t: <Frac a={<V>C</V>} b={<V>n</V>} />, dir: [-0.1, 0.48], side: 'down', label: 'Kapasitas panas total dibagi jumlah mol' },
          { t: '=', op: true },
          { t: <><Frac a={'1'} b={<V>n</V>} /><Paren><Frac a={<>d<V>Q</V></>} b={<>d<V>T</V></>} /></Paren></>, dir: [1.3, -0.42], side: 'up', label: 'Langsung dari definisi kapasitas panas' },
        ]}
      />

      <Reveal at={3} step={phase}>
        <div className="stack">
          <p className="lead" style={{ fontSize: 21 }}>
            Mol menghitung jumlah partikel, bukan beratnya. Perbedaan massa atomik antar zat
            tereliminasi, dan yang tersisa untuk dibandingkan adalah
            <span className="gold"> derajat kebebasan internal molekulnya</span>.
          </p>
          <Syarat>
            <V>C</V><sub>m</sub> = <V>C</V>/<V>n</V> dalam J mol⁻¹ K⁻¹, berbeda dari kapasitas panas
            spesifik <V>c</V> = <V>C</V>/<V>m</V> dalam J kg⁻¹ K⁻¹. Keduanya sama-sama intensif,
            tetapi patokannya tidak sama.
          </Syarat>
        </div>
      </Reveal>
    </>
  ),
};

/* ══════════════════════════════════════════════════ 9. mengapa CP > CV */
const Bar = ({ label, segments, shown, delay = 0 }) => (
  <div style={{ marginBottom: 22 }}>
    <p className="tiny" style={{ marginBottom: 9, fontSize: 16 }}>{label}</p>
    <div style={{ display: 'flex', gap: 3, height: 40 }}>
      {segments.map((seg, i) => (
        <div key={i} style={{ position: 'relative', width: seg.w, height: '100%', overflow: 'hidden' }}>
          {/* Lebar tidak dianimasikan; yang bergerak adalah scaleX, yang
              berjalan di compositor sehingga tetap mulus di 60 fps. */}
          <div
            className="anim"
            style={{
              position: 'absolute',
              inset: 0,
              background: seg.c,
              transformOrigin: 'left center',
              transform: shown ? 'scaleX(1)' : 'scaleX(0)',
              transition: `transform 880ms var(--ease) ${delay + i * 240}ms`,
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              fontSize: 15,
              fontWeight: 500,
              color: '#0a0a0b',
              whiteSpace: 'nowrap',
              opacity: shown ? 1 : 0,
              transition: `opacity 420ms var(--ease) ${delay + i * 240 + 520}ms`,
            }}
          >
            {seg.t}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const kenapa = {
  id: 'kenapa',
  title: 'Mengapa CP lebih besar',
  steps: 2,
  render: ({ step, no, total }) => (
    <>
      <SlideHead eyebrow="03 · Alokasi energi" no={no} total={total} />
      <h2 className="h2">Ke mana kalornya pergi</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '308px 1fr', gap: 46, alignItems: 'center', marginTop: 14 }}>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Piston free={false} heated={step >= 1} play={step >= 1} width={140} height={184} />
          <Piston free heated={step >= 1} play={step >= 1} width={140} height={184} />
        </div>

        <div>
          <p className="tiny" style={{ marginBottom: 16 }}>Untuk kenaikan suhu yang sama:</p>
          <Bar
            label="Volume tetap, piston terpaku"
            shown={step >= 1}
            segments={[{ w: 292, c: 'rgba(247,245,241,0.82)', t: 'ΔU' }]}
          />
          <Bar
            label="Tekanan tetap, piston bebas naik"
            shown={step >= 1}
            delay={260}
            segments={[
              { w: 292, c: 'rgba(247,245,241,0.82)', t: 'ΔU' },
              { w: 128, c: 'var(--gold)', t: 'kerja ekspansi' },
            ]}
          />

          <Reveal at={1} step={step} delay={1150}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 10 }}>
              <span className="eq gold" style={{ fontSize: 40 }}>
                <V>C</V><sub style={{ fontSize: '0.5em' }}>P</sub> &minus; <V>C</V><sub style={{ fontSize: '0.5em' }}>V</sub> = <V>nR</V>
              </span>
              <span className="tiny" style={{ maxWidth: '38ch' }}>
                Untuk gas ideal, selisihnya persis <V>nR</V>. Jadi <V>C</V><sub>P</sub> &gt; <V>C</V><sub>V</sub>,
                dan selisih itu sama dengan kerja ekspansinya.
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal at={1} step={step} delay={1400}>
        <Syarat>
          untuk zat nyata berlaku <V>C</V><sub>P</sub> &minus; <V>C</V><sub>V</sub> = <V>TVα</V>²/<V>κ</V><sub>T</sub>.
          Karena <V>κ</V><sub>T</sub> &gt; 0 pada sistem yang stabil, <V>C</V><sub>P</sub> &ge; <V>C</V><sub>V</sub> selalu,
          dan sama besar hanya bila koefisien muai termalnya nol.
        </Syarat>
      </Reveal>
    </>
  ),
};

/* ══════════════════════════════════════════ 9b. contoh hitungan singkat */
const Hitung = ({ label, rows, accent }) => (
  <div className="stack" style={accent ? { borderLeftColor: 'var(--gold)' } : undefined}>
    <div className={accent ? 'tag' : 'tag tag--plain'}>{label}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((r, i) => (
        <div key={i} className="eq" style={{ fontSize: 25, color: r.kuat ? 'var(--gold)' : undefined }}>
          {r.t}
        </div>
      ))}
    </div>
  </div>
);

const contoh = {
  id: 'contoh',
  title: 'Contoh hitungan',
  steps: 2,
  render: ({ step, no, total }) => (
    <>
      <SlideHead eyebrow="03 · Alokasi energi" no={no} total={total} />
      <h2 className="h2">Diuji dengan angka</h2>
      <p className="tiny" style={{ marginBottom: 26 }}>
        1 mol gas ideal <span className="gold">monoatomik</span>, suhunya dinaikkan Δ<V>T</V> = 10 K.
        Tetapan gas <V>R</V> = 8,314 J mol⁻¹ K⁻¹.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <Reveal at={1} step={step}>
          <Hitung
            label="Volume tetap"
            rows={[
              { t: <><V>C</V><sub style={{ fontSize: '0.5em' }}>V,m</sub> = <sup>3</sup>&frasl;<sub>2</sub><V>R</V> = 12,47</> },
              { t: <><V>Q</V><sub style={{ fontSize: '0.5em' }}>V</sub> = <V>nC</V><sub style={{ fontSize: '0.5em' }}>V,m</sub>Δ<V>T</V> = 124,7 J</>, kuat: true },
              { t: <>Δ<V>U</V> = 124,7 J &nbsp;&nbsp; <V>W</V> = 0</> },
            ]}
          />
        </Reveal>

        <Reveal at={1} step={step} delay={240}>
          <Hitung
            accent
            label="Tekanan tetap"
            rows={[
              { t: <><V>C</V><sub style={{ fontSize: '0.5em' }}>P,m</sub> = <sup>5</sup>&frasl;<sub>2</sub><V>R</V> = 20,79</> },
              { t: <><V>Q</V><sub style={{ fontSize: '0.5em' }}>P</sub> = <V>nC</V><sub style={{ fontSize: '0.5em' }}>P,m</sub>Δ<V>T</V> = 207,9 J</>, kuat: true },
              { t: <>Δ<V>U</V> = 124,7 J &nbsp;&nbsp; <V>W</V> = &minus;83,1 J</> },
            ]}
          />
        </Reveal>
      </div>

      <Reveal at={1} step={step} delay={620} style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 32 }}>
          <span className="eq gold" style={{ fontSize: 29, flex: 'none' }}>
            <V>Q</V><sub style={{ fontSize: '0.5em' }}>P</sub> &minus; <V>Q</V><sub style={{ fontSize: '0.5em' }}>V</sub> = <V>nR</V>Δ<V>T</V> = 83,1 J
          </span>
          <span className="tiny">
            Persis sebesar kerja ekspansinya. Cek Hukum Pertama:
            Δ<V>U</V> = <V>Q</V> + <V>W</V> = 207,9 &minus; 83,1 = 124,7 J.
          </span>
        </div>
        <Syarat>
          tanda mengikuti Konvensi 1 (<V>dW</V> = &minus;<V>P</V>d<V>V</V>), jadi kerja saat memuai
          bernilai negatif. Δ<V>U</V> sama di kedua proses karena energi internal gas ideal hanya
          bergantung pada suhu.
        </Syarat>
      </Reveal>
    </>
  ),
};

/* ═════════════════════════════════════════════════════════ 10. kalorimetri */
const kalorimetri = {
  id: 'kalorimetri',
  title: 'Kalorimetri',
  steps: 2,
  render: ({ step, phase, no, total }) => (
    <>
      <SlideHead eyebrow="04 · Kalorimetri" no={no} total={total} />
      <h2 className="h2">Energi hanya berpindah tempat</h2>

      <Formula
        size={76}
        box={292}
        exploded={phase >= 1}
        labels={phase >= 2}
        spread={{ x: 188, y: 36 }}
        terms={[
          { t: <><V>Q</V><sub style={{ fontSize: '0.5em' }}>A</sub></>, dir: [-1.05, -0.44], side: 'up', state: 'hot', label: 'Dilepas komponen bersuhu lebih tinggi' },
          { t: '=', op: true },
          { t: <>&minus;<V>Q</V><sub style={{ fontSize: '0.5em' }}>B</sub></>, dir: [1.05, 0.46], side: 'down', state: 'cool', label: 'Diterima komponen bersuhu lebih rendah' },
        ]}
        note={<><V>Q</V><sub>lepas</sub> + <V>Q</V><sub>terima</sub> = 0</>}
      />

      <Reveal at={3} step={phase} style={{ marginTop: 22 }}>
        <div className="rows stack">
          <Bullet>Berlaku dalam sistem komposit yang terisolasi secara termal dari lingkungan</Bullet>
          <Bullet>Kesetimbangan termal tercapai saat seluruh komponen bersuhu seragam, sehingga aliran <span className="gold">neto</span> kalor berhenti</Bullet>
        </div>
      </Reveal>
    </>
  ),
};

/* ═══════════════════════════════════════════════ 11. proses termodinamika */
const PROSES = [
  { n: 'Isotermal', Icon: Thermometer, eq: <>d<V>T</V> = 0</>, s: <><V>PV</V> = konstan</> },
  { n: 'Adiabatik', Icon: Snowflake, eq: <>d<V>Q</V> = 0</>, s: <><V>PV</V><sup>γ</sup> = konstan</> },
  { n: 'Isokhorik', Icon: Lock, eq: <>d<V>V</V> = 0</>, s: <><V>W</V> = 0</> },
  { n: 'Isobarik', Icon: LockOpen, eq: <>d<V>P</V> = 0</>, s: <><V>W</V> = &minus;<V>P</V> Δ<V>V</V></> },
  { n: 'Ekspansi bebas', Icon: Atom, eq: <><V>Q</V> = <V>W</V> = 0</>, s: 'ireversibel' },
  { n: 'Siklik', Icon: ArrowsClockwise, eq: <>Δ<V>U</V> = 0</>, s: 'kerja neto = luas kurva' },
];

const proses = {
  id: 'proses',
  title: 'Proses Termodinamika',
  steps: 2,
  render: ({ step, no, total }) => (
    <>
      <SlideHead eyebrow="05 · Proses Termodinamika" no={no} total={total} />
      <h2 className="h2">Enam proses, satu kerangka</h2>
      <p className="tiny" style={{ marginBottom: 24 }}>
        <span className="gold">Konvensi 1</span> dipakai sepanjang bab ini: <V>dW</V> = &minus;<V>P</V>d<V>V</V>.
        Kerja positif bila dilakukan <em>pada</em> sistem, negatif bila dilakukan <em>oleh</em> sistem.
      </p>

      <ExplodedGrid out={step >= 1} columns={3}>
        {PROSES.map(({ n, Icon, eq, s }) => (
          <div key={n} className="piece">
            <Icon size={24} weight="light" className="piece-icon" />
            <div className="piece-index">{n}</div>
            <h3 className="piece-title eq gold" style={{ fontSize: 24, margin: '2px 0 6px' }}>{eq}</h3>
            <p className="piece-sub eq" style={{ fontSize: 15 }}>{s}</p>
          </div>
        ))}
      </ExplodedGrid>
    </>
  ),
};

/* ═════════════════════════════════════════════ 12. isotermal vs adiabatik */
const adiabatik = {
  id: 'adiabatik',
  title: 'Isotermal dibanding adiabatik',
  steps: 2,
  render: ({ step, phase, no, total }) => (
    <>
      <SlideHead eyebrow="05 · Proses Termodinamika" no={no} total={total} />
      <h2 className="h2">Kenapa adiabatik lebih curam</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '524px 1fr', gap: 40, alignItems: 'center', marginTop: 6 }}>
        <PVChart gamma={1.4} play={step >= 1} showAdiabat={phase >= 2} width={524} height={312} />

        <div>
          <Reveal at={1} step={phase} className="stack" style={{ marginBottom: 22 }}>
            <div className="tag tag--plain">Isotermal</div>
            <div className="eq" style={{ fontSize: 29, margin: '6px 0 10px' }}>
              <V>P</V> = <V>C</V>/<V>V</V> &nbsp;&rarr;&nbsp; <Frac a={<>d<V>P</V></>} b={<>d<V>V</V></>} /> = &minus;<Frac a={<V>P</V>} b={<V>V</V>} />
            </div>
            <p className="tiny">Suhu tetap. Δ<V>U</V> = 0, khusus gas ideal.</p>
          </Reveal>

          <Reveal at={2} step={phase} className="stack" style={{ borderLeftColor: 'var(--gold)' }}>
            <div className="tag">Adiabatik</div>
            <div className="eq gold" style={{ fontSize: 29, margin: '6px 0 10px' }}>
              <V>P</V> = <V>C</V>/<V>V</V><sup style={{ fontSize: '0.6em' }}>γ</sup> &nbsp;&rarr;&nbsp; <Frac a={<>d<V>P</V></>} b={<>d<V>V</V></>} /> = &minus;γ<Frac a={<V>P</V>} b={<V>V</V>} />
            </div>
            <p className="tiny">Tanpa pertukaran kalor. Δ<V>U</V> = <V>dW</V>.</p>
          </Reveal>

          <Reveal at={3} step={phase}>
            <p className="lead" style={{ fontSize: 19, marginTop: 22 }}>
              Karena γ = <V>C</V><sub>P</sub>/<V>C</V><sub>V</sub> &gt; 1, kemiringan adiabatik adalah
              <span className="gold"> γ kali</span> kemiringan isotermal. Tekanan turun bukan hanya
              karena volume bertambah, tetapi juga karena energi internal ikut turun.
            </p>
            <Syarat>
              <V>PV</V><sup>γ</sup> = konstan hanya untuk gas ideal pada proses adiabatik yang
              reversibel. Ekspansi bebas juga punya <V>Q</V> = 0, tetapi ireversibel, jadi tidak
              memenuhi hubungan ini.
            </Syarat>
          </Reveal>
        </div>
      </div>
    </>
  ),
};

/* ══════════════════════════════════════════════════ 13. empat kasus khusus */
const KASUS = [
  { t: 'Ekspansi bebas', s: 'Gas memuai ke ruang hampa', rows: ['Q = 0, sistem terisolasi', 'W = 0, tidak ada tekanan lawan', 'ΔU = 0, suhu tetap untuk gas ideal'], warn: 'Ireversibel, meskipun Q = 0' },
  { t: 'Proses siklik', s: 'Sistem kembali ke titik awal', rows: ['ΔU = 0 setelah satu putaran penuh', 'Kerja neto sama dengan luas area di dalam kurva tertutup'] },
  { t: 'Isokhorik', s: 'Volume dijaga tetap, dV = 0', rows: ['W = 0, tidak ada kerja mekanis', 'dU = dQ, seluruh kalor jadi energi internal'] },
  { t: 'Isobarik', s: 'Tekanan dijaga tetap, dP = 0', rows: ['W = −P (Vf − Vi)', 'Contoh: penguapan air di wadah terbuka'] },
];

const kasus = {
  id: 'kasus',
  title: 'Empat kasus khusus',
  steps: 2,
  render: ({ step, no, total }) => (
    <>
      <SlideHead eyebrow="05 · Proses Termodinamika" no={no} total={total} />
      <h2 className="h2">Empat kasus khusus</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 52px' }}>
        {KASUS.map((k, i) => (
          <Reveal key={k.t} at={1} step={step} delay={i * 160} className="stack">
            <h3 className="h3">{k.t}</h3>
            <p className="piece-sub" style={{ marginBottom: 10 }}>{k.s}</p>
            <div className="rows">
              {k.rows.map((r) => <Bullet key={r}>{r}</Bullet>)}
              {k.warn ? (
                <p className="row gold" style={{ fontSize: 18 }}>
                  <span className="tick" style={{ background: 'var(--gold)' }} />{k.warn}
                </p>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </>
  ),
};

/* ═══════════════════════════════════════════ 14. quasi-statis & reversibel */
const nyata = {
  id: 'nyata',
  title: 'Ideal dan nyata',
  steps: 2,
  render: ({ step, no, total }) => (
    <>
      <SlideHead eyebrow="06 · Ideal dan nyata" no={no} total={total} />
      <h2 className="h2">Dua syarat, dan kenyataan</h2>
      <p className="tiny" style={{ marginBottom: 30 }}>Batas antara idealisme fisik dan kenyataan operasional.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 52 }}>
        <div>
          <Reveal at={1} step={step} className="stack" style={{ marginBottom: 26 }}>
            <div className="tag tag--plain">Quasi-statis</div>
            <p className="lead" style={{ fontSize: 19 }}>
              Berlangsung sangat lambat sehingga sistem seolah selalu berada dalam kesetimbangan
              di setiap tahap. Model ideal untuk menghitung kerja secara teoretis.
            </p>
          </Reveal>

          <Reveal at={1} step={step} delay={220} className="stack" style={{ borderLeftColor: 'var(--gold)' }}>
            <div className="tag">Syarat reversibel</div>
            <div className="rows">
              <Bullet>Prosesnya quasi-statis</Bullet>
              <Bullet>Tidak ada gaya disipatif seperti gesekan atau viskositas</Bullet>
            </div>
            <p className="tiny" style={{ marginTop: 12 }}>Keduanya wajib. Satu saja tidak cukup.</p>
          </Reveal>
        </div>

        <Reveal at={1} step={step} delay={440} className="stack">
          <div className="tag tag--plain">Ireversibel di dunia nyata</div>
          <div className="rows">
            <Bullet>Ekspansi bebas gas ke ruang hampa</Bullet>
            <Bullet>Perpindahan panas spontan dari benda panas ke benda dingin</Bullet>
            <Bullet>Pemanasan Joule akibat hambatan listrik</Bullet>
          </div>
          <p className="tiny" style={{ marginTop: 16 }}>
            Sebagian besar proses nyata masuk kategori ini, karena efek disipatif hampir selalu ada.
          </p>
        </Reveal>
      </div>
    </>
  ),
};

/* ═══════════════════════════════════════════════════════════ 15. penutup */
const penutup = {
  id: 'penutup',
  title: 'Penutup',
  steps: 2,
  className: 'slide--center',
  render: ({ step, ctx }) => (
    <>
      <Reveal at={0} step={step}>
        <div className="head" style={{ marginBottom: 30 }}>
          <span className="head-eyebrow">Penutup</span>
          <span className="head-rule" />
        </div>
        <h2 className="h2" style={{ fontSize: 50, maxWidth: '22ch' }}>
          Kompromi antara yang ideal dan yang tak terelakkan
        </h2>
      </Reveal>

      <Reveal at={1} step={step} style={{ marginTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 52, alignItems: 'start' }}>
          <div>
            <p className="lead" style={{ fontSize: 20, marginBottom: 26 }}>
              Setiap sistem termodinamika adalah hasil tawar-menawar antara efisiensi reversibel yang
              ideal dan realitas ireversibel yang tak terhindarkan. Memahami taksonomi prosesnya
              adalah kunci untuk menganalisis efisiensi energi.
            </p>
            <Names />
          </div>

          <div className="stack">
            <div className="tag">Referensi</div>
            <p className="tiny" style={{ fontSize: 15.5, lineHeight: 1.55 }}>
              {SUMBER.penulis}. <em>{SUMBER.judul}</em>, {SUMBER.edisi}. {SUMBER.penerbit}, {SUMBER.tahun}.
              <br />
              {SUMBER.bab}, hlm. {SUMBER.halaman}.
            </p>
            <p className="tiny" style={{ fontSize: 14, marginTop: 10, color: 'var(--ink-4)' }}>
              Konvensi tanda kerja: <V>dW</V> = &minus;<V>P</V>d<V>V</V> (Konvensi 1).
              Tetapan gas <V>R</V> = 8,314 J mol⁻¹ K⁻¹.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>{ctx?.pdfButton}</div>
      </Reveal>
    </>
  ),
};

export const slides = [
  sampul, peta, definisi, cvcp, sifat, entalpi, turunan, molar,
  kenapa, contoh, kalorimetri, proses, adiabatik, kasus, nyata, penutup,
];

export default slides;
