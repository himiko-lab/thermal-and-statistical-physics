import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { CaretLeft, CaretRight, FilePdf, Hand, Keyboard, ListBullets, Question } from '@phosphor-icons/react';

import slides from './content/slides.jsx';
import notes from './content/notes.js';
import useGesture from './hooks/useGesture.js';
import useCascade, { CASCADE } from './hooks/useCascade.js';
import useMediaQuery, { TOUCH, PORTRAIT } from './hooks/useMediaQuery.js';
import NotesSheet from './components/NotesSheet.jsx';
import HandTest from './components/HandTest.jsx';

const STAGE_W = 1280;
const STAGE_H = 720;

/* ───────────────────────────────────────────────────────── navigasi deck */
function reducer(state, action) {
  const { i, step } = state;
  switch (action.type) {
    case 'next':
      if (step < slides[i].steps - 1) return { i, step: step + 1 };
      if (i < slides.length - 1) return { i: i + 1, step: 0 };
      return state;
    case 'prev':
      if (step > 0) return { i, step: step - 1 };
      if (i > 0) return { i: i - 1, step: slides[i - 1].steps - 1 };
      return state;
    case 'slide':
      return { i: Math.max(0, Math.min(slides.length - 1, action.i)), step: 0 };
    case 'first':
      return { i: 0, step: 0 };
    case 'last':
      return { i: slides.length - 1, step: slides[slides.length - 1].steps - 1 };
    default:
      return state;
  }
}

/* Total tahap di seluruh deck, dipakai untuk bar progres yang jujur: ia
   bergerak per tahap, bukan per slide, jadi tidak melompat-lompat. */
const TOTAL_STEPS = slides.reduce((n, s) => n + s.steps, 0);
const OFFSETS = slides.reduce((acc, s, idx) => {
  acc[idx] = idx === 0 ? 0 : acc[idx - 1] + slides[idx - 1].steps;
  return acc;
}, []);

export default function App() {
  const [{ i, step }, dispatch] = useReducer(reducer, { i: 0, step: 0 });
  const [help, setHelp] = useState(false);
  const [camOn, setCamOn] = useState(true);
  const [camZoom, setCamZoom] = useState(false);
  const [toast, setToast] = useState(null);
  const [printing, setPrinting] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [test, setTest] = useState(false);
  const [fire, setFire] = useState(null);

  const isTouch = useMediaQuery(TOUCH);
  const isPortrait = useMediaQuery(PORTRAIT);

  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const notesWinRef = useRef(null);

  /* Selama mode uji terbuka, geseran tidak memindahkan slide; ia hanya
     dilaporkan, supaya gerakannya bisa dilatih tanpa mengacak posisi deck. */
  const testRef = useRef(false);
  testRef.current = test;

  const next = useCallback(() => {
    if (testRef.current) return setFire({ dir: 'next', at: Date.now() });
    dispatch({ type: 'next' });
  }, []);

  const prev = useCallback(() => {
    if (testRef.current) return setFire({ dir: 'prev', at: Date.now() });
    dispatch({ type: 'prev' });
  }, []);

  const gesture = useGesture({ videoRef, canvasRef, onNext: next, onPrev: prev, active: !__OFFLINE__ && !isTouch });

  // Setiap slide hanya punya dua tahap. Urutan yang lebih halus dari itu
  // dijalankan oleh timer, bukan oleh klik tambahan. Saat mencetak, seluruh
  // fase dilompati ke akhir supaya halaman langsung lengkap.
  const phase = useCascade(step >= 1 || printing, CASCADE, printing);

  const say = useCallback((msg, ms = 4200) => {
    setToast(msg);
    window.clearTimeout(say._t);
    say._t = window.setTimeout(() => setToast(null), ms);
  }, []);

  /* ───────────────────────────── panggung 1280x720 diskalakan ke layar apa pun */
  useEffect(() => {
    const fit = () => {
      const el = stageRef.current;
      if (!el) return;
      const k = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
      el.style.transform = `translate(-50%, -50%) scale(${k})`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  /* ──────────────────────────────────────────────────── ekspor PDF (cetak) */
  const exportPdf = useCallback(() => {
    say('Di dialog cetak Chrome: buka More settings, lalu centang Background graphics. Tanpa itu latar gelapnya hilang.', 7000);
    setPrinting(true);
    // Beri jeda supaya toast terbaca dan semua tahap sempat dipaksa tampil
    // sebelum browser memotret halaman.
    window.setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 900);
  }, [say]);

  /* ───────────────────────────────────────────── jendela catatan presenter */
  const openNotes = useCallback(() => {
    const win = window.open('', 'catatan-presenter', 'width=560,height=820');
    if (!win) return say('Pop-up diblokir. Izinkan pop-up untuk situs ini, lalu tekan N lagi.');
    win.document.write(NOTES_DOC);
    win.document.close();
    notesWinRef.current = win;
  }, [say]);

  // Kirim isi catatan setiap kali slide berpindah, dan saat jendela baru dibuka.
  useEffect(() => {
    const win = notesWinRef.current;
    if (!win || win.closed) return;
    const s = slides[i];
    const n = notes[s.id] ?? { target: 0, notes: [] };
    const nextSlide = slides[i + 1];
    const payload = {
      no: i + 1,
      total: slides.length,
      title: s.title,
      step: step + 1,
      steps: s.steps,
      target: n.target,
      notes: n.notes,
      simbol: n.simbol ?? [],
      next: nextSlide ? nextSlide.title : 'Selesai',
    };
    const post = () => win.postMessage({ type: 'deck:update', payload }, '*');
    post();
    // Jendela yang baru dibuka mungkin belum memasang listener-nya.
    const t = window.setTimeout(post, 260);
    return () => window.clearTimeout(t);
  }, [i, step]);

  // Panah di jendela catatan menggerakkan deck juga.
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === 'notes:nav') (e.data.dir === 'prev' ? prev : next)();
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [next, prev]);

  useEffect(() => () => notesWinRef.current?.close?.(), []);

  /* Di desktop catatan dibuka di jendela terpisah supaya bisa ditaruh di layar
     laptop; di ponsel tidak ada layar kedua, jadi ia muncul sebagai lembar. */
  const showNotes = useCallback(() => {
    if (isTouch) setSheet((v) => !v);
    else openNotes();
  }, [isTouch, openNotes]);

  /* ──────────────────────────────────────────────────────────── papan tik */
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case 'ArrowRight': case ' ': case 'PageDown': e.preventDefault(); next(); break;
        case 'ArrowLeft': case 'PageUp': e.preventDefault(); prev(); break;
        case 'Home': dispatch({ type: 'first' }); break;
        case 'End': dispatch({ type: 'last' }); break;
        case 'Escape': setHelp(false); setCamZoom(false); setSheet(false); setTest(false); break;
        case '?': case '/': setHelp((v) => !v); break;
        default: break;
      }
      switch (e.key.toLowerCase()) {
        case 'h':
          if (__OFFLINE__) return say('Versi offline dibangun tanpa kamera. Pakai versi server untuk gerakan tangan.');
          gesture.toggle();
          break;
        case 's':
          if (!__OFFLINE__) gesture.cycleSensitivity();
          break;
        case 'c': setCamOn((v) => !v); break;
        case 'z': setCamZoom((v) => !v); break;
        case 'n': showNotes(); break;
        case 't':
          if (__OFFLINE__) say('Versi offline dibangun tanpa kamera. Pakai versi server untuk menguji gerakan tangan.');
          else if (isTouch) say('Mode uji butuh kamera dan tetikus. Buka di laptop.');
          else setTest((v) => !v);
          break;
        case 'p': exportPdf(); break;
        case 'f':
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen?.();
          break;
        default: break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, gesture, showNotes, exportPdf, say, isTouch]);

  const progress = ((OFFSETS[i] + step + 1) / TOTAL_STEPS) * 100;

  const ctx = useMemo(
    () => ({
      pdfButton: (
        <Button className="btn-pdf" variant="outline" onPress={exportPdf}>
          <FilePdf size={19} weight="light" /> Ekspor PDF
        </Button>
      ),
    }),
    [exportPdf],
  );

  return (
    <div className={[camZoom ? 'cam-zoom' : '', test ? 'is-testing' : ''].filter(Boolean).join(' ') || undefined} data-printing={printing ? 'true' : undefined}>
      <div className="stage-wrap">
        <div className="stage" ref={stageRef}>
          {slides.map((s, idx) => (
            <section
              key={s.id}
              className={`slide${idx === i ? ' is-active' : ''}${s.className ? ' ' + s.className : ''}`}
              data-slide={s.id}
            >
              {/* step -1 pada slide non-aktif: begitu slide dikunjungi lagi,
                  animasinya berjalan ulang dari nol, bukan tampil jadi.
                  Saat mencetak, semua slide dipaksa ke tahap akhir. */}
              {s.render({
                step: printing ? s.steps - 1 : idx === i ? step : -1,
                phase: printing ? CASCADE.length : idx === i ? phase : 0,
                no: idx + 1,
                total: slides.length,
                ctx,
              })}
            </section>
          ))}
        </div>
      </div>

      <div className="hud hud--progress">
        <div style={{ transform: `scaleX(${progress / 100})` }} />
      </div>

      {i === 0 ? (
        <div className="hud hud--hint">
          {isTouch
            ? isPortrait
              ? 'Putar layar untuk tampilan lebih besar'
              : 'Ketuk tombol di kanan bawah untuk lanjut'
            : __OFFLINE__
              ? 'Tekan → untuk lanjut · ? untuk bantuan'
              : 'Buka telapak lalu geser · atau tekan → · ? untuk bantuan'}
        </div>
      ) : null}

      {/* Perangkat sentuh tidak punya tombol panah. Kontrolnya sengaja kecil
          dan redup supaya tidak bersaing dengan isi slide. */}
      {isTouch ? (
        <div className="hud hud--touch">
          <button
            className="tbtn"
            onClick={prev}
            disabled={i === 0 && step === 0}
            aria-label="Slide sebelumnya"
          >
            <CaretLeft size={18} weight="light" />
          </button>
          <button className="tbtn tbtn--wide" onClick={showNotes} aria-label="Catatan presenter">
            <ListBullets size={16} weight="light" />
            Catatan
          </button>
          <button
            className="tbtn"
            onClick={next}
            disabled={i === slides.length - 1 && step === slides[i].steps - 1}
            aria-label="Slide selanjutnya"
          >
            <CaretRight size={18} weight="light" />
          </button>
        </div>
      ) : null}

      {test ? (
        <HandTest
          getHand={gesture.getHand}
          getStats={gesture.getStats}
          connections={gesture.connections}
          fire={fire}
          onClose={() => setTest(false)}
        />
      ) : null}

      {sheet ? (
        <NotesSheet
          no={i + 1}
          total={slides.length}
          title={slides[i].title}
          entry={notes[slides[i].id]}
          onClose={() => setSheet(false)}
        />
      ) : null}

      {/* Selalu ter-mount, disembunyikan lewat CSS. Kalau elemennya dicabut
          dari DOM saat C ditekan, controller tetap memegang <video> lama yang
          sudah lepas dan pelacakan tidak pernah pulih. */}
      {!__OFFLINE__ ? (
        <div
          className="hud hud--cam"
          data-hidden={camOn ? undefined : 'true'}
          data-live={['tracking', 'armed', 'cooldown', 'rearm'].includes(gesture.state) ? 'true' : undefined}
        >
          <div className="cam-box">
            <video ref={videoRef} playsInline muted />
            <canvas ref={canvasRef} width={320} height={240} />
            <span className="sens-badge">{gesture.preset}</span>
          </div>
          <div className="cam-status" data-tone={gesture.tone} onClick={gesture.retry} role="status">
            {gesture.label}
          </div>
          <div className="cam-bar">
            <div className="cam-fill" style={{ transform: `scaleX(${gesture.progress})` }} />
          </div>
        </div>
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}

      {help ? (
        <div className="overlay" onClick={() => setHelp(false)}>
          <div className="overlay-panel" onClick={(e) => e.stopPropagation()}>
            <h3 className="h3" style={{ marginBottom: 18 }}>Kendali</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 34px' }}>
              <Row k={['→', 'spasi']} v="Buka isi slide, lalu slide berikutnya" icon={<Keyboard size={18} weight="light" />} />
              <Row k={['←']} v="Mundur satu tahap" />
              <Row k={['H']} v="Matikan / nyalakan kamera" icon={<Hand size={18} weight="light" />} />
              <Row k={['S']} v="Ganti sensitivitas gerakan" />
              <Row k={['Z']} v="Besarkan kamera untuk demo" />
              <Row k={['C']} v="Sembunyikan preview kamera" />
              <Row k={['N']} v="Catatan presenter" />
              <Row k={['T']} v="Uji hand tracking" />
              <Row k={['P']} v="Ekspor PDF" icon={<FilePdf size={18} weight="light" />} />
              <Row k={['F']} v="Fullscreen" />
              <Row k={['?']} v="Buka / tutup bantuan ini" icon={<Question size={18} weight="light" />} />
            </div>
            <p className="tiny" style={{ marginTop: 22 }}>
              Gerakan: buka telapak, geser menyamping, lalu kendurkan. Minimal tiga jari terentang.
              Tangan mengepal diabaikan, jadi gerakan alami saat menjelaskan tidak menggeser slide.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Row({ k, v, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, color: 'var(--ink-2)' }}>
      <span style={{ display: 'flex', gap: 5, flex: 'none' }}>
        {k.map((key) => <span key={key} className="kbd">{key}</span>)}
      </span>
      {icon}
      <span>{v}</span>
    </div>
  );
}

/* Dokumen jendela catatan. Mandiri, supaya tidak ikut terpengaruh CSS deck. */
const NOTES_DOC = `<!doctype html><html lang="id"><head><meta charset="utf-8">
<title>Catatan presenter</title><style>
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;height:100vh;display:flex;flex-direction:column;background:#0a0a0b;color:#f7f5f1;
 font:15px/1.55 -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif}
.pane{flex:1;overflow-y:auto;padding:22px 24px}
.top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}
.no{font-size:12px;letter-spacing:.16em;color:#efc25e;text-transform:uppercase}
h1{font-size:23px;margin:2px 0 4px;letter-spacing:-.02em}
.meta{font-size:12px;color:rgba(247,245,241,.42);margin-bottom:18px}
#timer{font-variant-numeric:tabular-nums;font-size:26px}
#timer.over{color:#efc25e}
ul{margin:0;padding:0;list-style:none}
li{padding:10px 0 10px 15px;border-left:1px solid rgba(255,255,255,.10);margin-bottom:7px;
 color:rgba(247,245,241,.80)}
li:first-child{border-left-color:#efc25e}
.next{margin-top:20px;padding-top:13px;border-top:1px solid rgba(255,255,255,.10);
 font-size:13px;color:rgba(247,245,241,.42)}
/* Kunci cara baca, dipatok di bagian bawah jendela dan berbeda tiap slide. */
.sym{flex:none;max-height:40vh;overflow-y:auto;padding:13px 24px 17px;
 border-top:1px solid rgba(239,194,94,.30);background:#101012}
.symhead{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:#efc25e;margin-bottom:9px}
dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:5px 14px;align-items:baseline}
dt{font-family:"STIX Two Text","New York",Georgia,serif;font-size:17px;color:#f7f5f1;white-space:nowrap}
dd{margin:0;font-size:12.5px;line-height:1.4;color:rgba(247,245,241,.55)}
dd b{font-weight:500;color:#efc25e}
.keys{padding:0 24px 12px;font-size:11px;color:rgba(247,245,241,.30)}
</style></head><body>
<div class="pane">
  <div class="top"><span class="no" id="no"></span><span id="timer">00:00</span></div>
  <h1 id="title">Menunggu deck…</h1>
  <div class="meta" id="meta"></div>
  <ul id="notes"></ul>
  <div class="next" id="next"></div>
</div>
<div class="sym" id="symWrap" hidden>
  <div class="symhead">Cara baca simbol di slide ini</div>
  <dl id="sym"></dl>
</div>
<div class="keys">R reset timer &middot; T mulai/jeda &middot; panah untuk navigasi</div>
<script>
let t=0,run=false;
const el=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
setInterval(()=>{if(run){t++;const m=String(Math.floor(t/60)).padStart(2,'0'),s=String(t%60).padStart(2,'0');el('timer').textContent=m+':'+s;}},1000);
window.addEventListener('message',e=>{
  const d=e.data;if(!d||d.type!=='deck:update')return;const p=d.payload;
  el('no').textContent='Slide '+p.no+' / '+p.total;
  el('title').textContent=p.title;
  el('meta').textContent='Tahap '+p.step+' dari '+p.steps+(p.target?' · target '+p.target+' detik':'');
  el('notes').innerHTML=p.notes.map(n=>'<li>'+esc(n)+'</li>').join('');
  el('next').textContent='Berikutnya: '+p.next;
  const sym=p.simbol||[];
  el('symWrap').hidden=sym.length===0;
  el('sym').innerHTML=sym.map(x=>'<dt>'+esc(x.s)+'</dt><dd><b>'+esc(x.baca)+'</b>'+(x.arti?' · '+esc(x.arti):'')+'</dd>').join('');
});
document.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();window.opener?.postMessage({type:'notes:nav',dir:'next'},'*');}
  if(e.key==='ArrowLeft'){e.preventDefault();window.opener?.postMessage({type:'notes:nav',dir:'prev'},'*');}
  if(k==='r'){t=0;el('timer').textContent='00:00';}
  if(k==='t'){run=!run;}
});
<\/script></body></html>`;
