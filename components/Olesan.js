// Olesan tekstur (SVG): bentuk olesan mengikuti tingkat kekentalan 1–6,
// warnanya mengikuti formula, dan kebeningan serta kilapnya dari data produk.
import { useId } from 'react';
import { cariProduk } from '@/lib/data';

const BENTUK = {
  1: {
    d: 'M28 60C25 44 52 35 78 40C102 45 128 38 136 54C143 69 118 79 90 76C62 73 31 77 28 60Z',
    tetes: [[124, 28, 4.5], [146, 70, 3.2], [20, 40, 2.6]],
    kilap: 'M50 50C64 45 84 44 104 47',
  },
  2: {
    d: 'M34 54C33 40 48 31 63 33L132 46C141 48 141 59 132 61L63 73C48 75 35 67 34 54Z',
    tetes: [[146, 53, 3]],
    kilap: 'M46 47C58 40 76 40 120 49',
  },
  3: {
    d: 'M24 60C20 41 45 30 70 34C96 38 118 29 136 41C151 51 146 72 124 75C100 78 80 81 55 79C35 77 26 72 24 60Z',
    tetes: [],
    kilap: 'M42 46C60 37 96 40 124 44',
    dalam: 'M40 62C56 56 96 58 128 60',
  },
  4: {
    d: 'M22 66C38 42 92 35 140 47C147 49 147 58 140 60C98 56 52 64 30 75C23 78 18 71 22 66Z',
    tetes: [],
    kilap: 'M40 56C66 45 104 44 134 50',
  },
  5: {
    d: 'M38 74C33 58 52 49 68 51C71 41 90 35 99 43C112 40 127 51 123 63C137 65 136 81 120 81L52 81C40 81 35 78 38 74Z',
    tetes: [],
    kilap: 'M60 56C72 51 84 50 96 52',
    pucuk: 'M95 44C97 34 104 29 111 25',
    dalam: 'M48 70C66 64 92 64 118 69',
  },
  6: {
    d: 'M32 78L38 50C40 41 50 37 61 39L118 43C129 44 135 51 133 59L128 78Z',
    tetes: [],
    atas: 'M38 50C40 41 50 37 61 39L118 43C129 44 135 51 133 59C110 55 72 52 38 50Z',
    gores: ['M52 60C70 58 96 59 122 63', 'M50 68C70 66 98 67 124 71'],
  },
};

function campur(a, b, t) {
  const x = a.replace('#', '').match(/../g).map((h) => parseInt(h, 16));
  const y = b.replace('#', '').match(/../g).map((h) => parseInt(h, 16));
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

export default function Olesan({ slug, className = '', judul }) {
  const p = cariProduk(slug);
  const t = p.tekstur;
  const n = Math.min(6, Math.max(1, t.kental || 6));
  const b = BENTUK[n];
  const id = useId().replace(/:/g, '');
  const keruh = 1 - t.bening;
  const isi = 0.35 + keruh * 0.6;
  const tepi = campur(t.warna, '#55625c', 0.45);
  const bawah = campur(t.warna, '#37423d', 0.25);
  return (
    <svg viewBox="0 0 160 100" className={className} role={judul ? 'img' : undefined} aria-label={judul || undefined} aria-hidden={judul ? undefined : 'true'} focusable="false">
      <defs>
        <linearGradient id={`${id}-isi`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={campur(t.warna, '#ffffff', 0.35)} stopOpacity={isi} />
          <stop offset="1" stopColor={bawah} stopOpacity={Math.min(1, isi + 0.15)} />
        </linearGradient>
        <filter id={`${id}-bayang`} x="-10%" y="-10%" width="120%" height="140%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
      <path d={b.d} transform="translate(2 5)" fill="#17201c" opacity={0.08 + keruh * 0.06} filter={`url(#${id}-bayang)`} />
      <path d={b.d} fill={`url(#${id}-isi)`} stroke={tepi} strokeOpacity={0.35 + t.bening * 0.3} strokeWidth="1.1" />
      {b.atas && <path d={b.atas} fill={campur(t.warna, '#ffffff', 0.3)} opacity="0.85" />}
      {b.dalam && <path d={b.dalam} fill="none" stroke={campur(t.warna, '#55625c', 0.2)} strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" />}
      {b.gores?.map((g) => (
        <path key={g} d={g} fill="none" stroke={campur(t.warna, '#55625c', 0.3)} strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round" />
      ))}
      {b.pucuk && <path d={b.pucuk} fill="none" stroke={campur(t.warna, '#ffffff', 0.2)} strokeWidth="7" strokeLinecap="round" />}
      {b.tetes.map(([cx, cy, r]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-isi)`} stroke={tepi} strokeOpacity="0.45" strokeWidth="0.8" />
          <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.3} fill="#ffffff" opacity={0.4 + t.kilap * 0.5} />
        </g>
      ))}
      {b.kilap && <path d={b.kilap} fill="none" stroke="#ffffff" strokeOpacity={0.25 + t.kilap * 0.6} strokeWidth={n >= 5 ? 2.2 : 3} strokeLinecap="round" />}
    </svg>
  );
}
