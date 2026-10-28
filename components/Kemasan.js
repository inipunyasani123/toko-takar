'use client';

// Ilustrasi kemasan Takar (SVG). Satu gaya untuk semua produk: kaca buram atau cokelat dengan garis takar
// tercetak di sisi botol, label kertas, dan tutup berwarna sesuai langkah pakai.
import { useId } from 'react';
import Image from 'next/image';
import manifest from '@/image-manifest.json';
import { cariProduk, cariLangkah } from '@/lib/data';
import { cariVarian } from '@/lib/katalog';

const TINTA = '#17201c';
const KERTAS = '#fbfaf5';
const LANTAI = 286;

const f = (n) => Math.round(n * 10) / 10;

function hexKeRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function campur(a, b, t) {
  const x = hexKeRgb(a);
  const y = hexKeRgb(b);
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

// Garis takar: tik pendek tiap 5,5 satuan, tik panjang tiap lima tik. Digambar sebagai dua path supaya DOM ringan.
function GarisTakar({ x, atas, bawah, warna, sisi = 1, angka = true }) {
  let pendek = '';
  let panjang = '';
  const teks = [];
  let n = 0;
  for (let y = bawah - 8; y > atas + 4; y -= 5.5, n++) {
    const p = n % 5 === 0;
    const d = `M${f(x)} ${f(y)}h${sisi * (p ? 9 : 5)}`;
    if (p) panjang += d;
    else pendek += d;
    if (p && angka && n > 0)
      teks.push(
        <text key={y} x={x + sisi * 12} y={f(y + 2.2)} fontSize="6.2" fill={warna} textAnchor={sisi > 0 ? 'start' : 'end'} style={{ fontFamily: 'var(--font-mono)' }}>
          {n * 2}
        </text>,
      );
  }
  return (
    <g aria-hidden="true">
      <path d={pendek} stroke={warna} strokeWidth="0.8" fill="none" />
      <path d={panjang} stroke={warna} strokeWidth="1.1" fill="none" />
      {teks}
    </g>
  );
}

// Garis-garis tegak berulang (rusuk tutup, lipatan tabung, segel kantong) sebagai satu path.
function Rusuk({ x0, jarak, jumlah, atas, bawah, warna, tebal = 0.8, opasitas = 0.5 }) {
  let d = '';
  for (let i = 0; i < jumlah; i++) d += `M${f(x0 + i * jarak)} ${f(atas)}V${f(bawah)}`;
  return <path d={d} stroke={warna} strokeOpacity={opasitas} strokeWidth={tebal} fill="none" />;
}

// Label kertas di depan wadah. Ukuran huruf dihitung supaya semua baris muat di lebar dan tinggi label.
const RASIO_SERIF = 0.5;
const RASIO_MONO = 0.6;

function Label({ x, y, w, h, p, v, warnaLangkah, isiUlang = false }) {
  const l = cariLangkah(p.langkah);
  const cx = x + w / 2;
  const pad = Math.max(4, w * 0.09);
  const lebar = w - pad * 2;
  const muat = (teks, maks, rasio) => Math.min(maks, lebar / Math.max(1, String(teks).length * rasio));
  const nama = p.label.nama;
  const angka = p.label.angka;
  const sub = p.label.sub;
  const isiTeks = v.jumlahIsi ? `${v.jumlahIsi}×${v.ukuran / v.jumlahIsi} ${v.satuan}` : `${v.ukuran} ${v.satuan}`;
  const kode = isiUlang ? 'isi ulang' : l?.no ? `0${l.no}` : `${p.pao}M`;
  const band = Math.min(5, h * 0.06);

  let kTakar = Math.min(7.4, h * 0.085);
  let kNama = Math.min(13.5, ...nama.map((n) => muat(n, 13.5, RASIO_SERIF)));
  let kAngka = angka ? muat(angka, 17, RASIO_MONO) : 0;
  let kSub = sub ? muat(sub, 6.2, RASIO_MONO) : 0;
  const kBawah = Math.min(6.2, (lebar - 3) / ((isiTeks.length + kode.length) * RASIO_MONO));
  const tinggiBawah = kBawah + 9;
  const perlu = () => band + kTakar + 5 + nama.length * kNama * 1.04 + (angka ? kAngka * 1.2 : 0) + (kSub ? kSub + 4 : 0) + tinggiBawah + 4;
  if (perlu() > h) kSub = 0;
  if (perlu() > h) {
    const k = (h - band - tinggiBawah - 8) / (kTakar + 5 + nama.length * kNama * 1.04 + (angka ? kAngka * 1.2 : 0));
    kTakar *= k;
    kNama *= k;
    kAngka *= k;
  }
  let yy = y + band + kTakar + 3.5;
  const baris = [];
  baris.push(
    <text key="merek" x={cx} y={f(yy)} fontSize={f(kTakar)} fill={TINTA} textAnchor="middle" letterSpacing="0.5" style={{ fontFamily: 'var(--font-display)' }}>
      takar
    </text>,
  );
  yy += 2;
  nama.forEach((n, i) => {
    yy += kNama * (i === 0 ? 1.08 : 1.02);
    baris.push(
      <text key={`n${i}`} x={cx} y={f(yy)} fontSize={f(kNama)} fill={TINTA} textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }}>
        {n}
      </text>,
    );
  });
  if (angka) {
    yy += kAngka * 1.16;
    baris.push(
      <text key="angka" x={cx} y={f(yy)} fontSize={f(kAngka)} fill={TINTA} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
        {angka}
      </text>,
    );
  }
  if (kSub) {
    yy += kSub + 3.5;
    baris.push(
      <text key="sub" x={cx} y={f(yy)} fontSize={f(kSub)} fill="#4a5650" textAnchor="middle" style={{ fontFamily: 'var(--font-mono)' }}>
        {sub}
      </text>,
    );
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={KERTAS} />
      <rect x={x} y={y} width={w} height={band} fill={warnaLangkah} />
      {baris}
      <line x1={x + pad} x2={x + w - pad} y1={f(y + h - tinggiBawah)} y2={f(y + h - tinggiBawah)} stroke="#cfd6d0" strokeWidth="0.7" />
      <text x={x + pad} y={f(y + h - 4.5)} fontSize={f(kBawah)} fill={TINTA} style={{ fontFamily: 'var(--font-mono)' }}>
        {isiTeks}
      </text>
      <text x={x + w - pad} y={f(y + h - 4.5)} fontSize={f(kBawah)} fill={TINTA} textAnchor="end" style={{ fontFamily: 'var(--font-mono)' }}>
        {kode}
      </text>
    </g>
  );
}

function Bayangan({ id, lebar }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-bay`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={TINTA} stopOpacity="0.22" />
          <stop offset="100%" stopColor={TINTA} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy={LANTAI + 1} rx={lebar / 2 + 16} ry="7" fill={`url(#${id}-bay)`} />
    </>
  );
}

// Gradien kaca: tepi kiri dan kanan lebih gelap, kilap tipis di kiri.
function GradienKaca({ id, amber }) {
  return (
    <linearGradient id={`${id}-kaca`} x1="0" x2="1" y1="0" y2="0">
      {amber ? (
        <>
          <stop offset="0" stopColor="#4d2608" />
          <stop offset="0.18" stopColor="#8b4a15" />
          <stop offset="0.5" stopColor="#a35b1d" />
          <stop offset="0.82" stopColor="#7b3f10" />
          <stop offset="1" stopColor="#3e1e06" />
        </>
      ) : (
        <>
          <stop offset="0" stopColor="#c9d3cf" stopOpacity="0.95" />
          <stop offset="0.16" stopColor="#f2f5f3" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="0.86" stopColor="#dce3e0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#aebbb5" stopOpacity="0.95" />
        </>
      )}
    </linearGradient>
  );
}

function GradienTutup({ id, warna }) {
  return (
    <linearGradient id={`${id}-tutup`} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={campur(warna, '#000000', 0.32)} />
      <stop offset="0.25" stopColor={campur(warna, '#ffffff', 0.18)} />
      <stop offset="0.6" stopColor={warna} />
      <stop offset="1" stopColor={campur(warna, '#000000', 0.38)} />
    </linearGradient>
  );
}

function GradienGelap({ id }) {
  return (
    <linearGradient id={`${id}-gelap`} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#0c110f" />
      <stop offset="0.3" stopColor="#3a4741" />
      <stop offset="0.65" stopColor="#1f2925" />
      <stop offset="1" stopColor="#0a0e0c" />
    </linearGradient>
  );
}

// Lengkung label: gelap tipis di kiri-kanan supaya terlihat membungkus wadah.
function GradienLengkung({ id }) {
  return (
    <linearGradient id={`${id}-lengkung`} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={TINTA} stopOpacity="0.2" />
      <stop offset="0.12" stopColor={TINTA} stopOpacity="0" />
      <stop offset="0.85" stopColor={TINTA} stopOpacity="0" />
      <stop offset="1" stopColor={TINTA} stopOpacity="0.24" />
    </linearGradient>
  );
}

function Kilap({ x, atas, tinggi, lebar = 5 }) {
  return (
    <>
      <rect x={x} y={atas} width={lebar} height={tinggi} rx={lebar / 2} fill="#ffffff" opacity="0.55" />
      <rect x={x + lebar + 3} y={atas + tinggi * 0.1} width="1.6" height={tinggi * 0.55} rx="0.8" fill="#ffffff" opacity="0.4" />
    </>
  );
}

// ---------- Bentuk wadah ----------

function Pipet({ id, p, v, s, amber, warna }) {
  const w = 78 * s;
  const h = 122 * s;
  const x0 = 100 - w / 2;
  const atas = LANTAI - h;
  const bahu = 24 * s;
  const leher = 30;
  const tubuh = `M${f(x0)} ${LANTAI - 10} L${f(x0)} ${f(atas + bahu)} Q${f(x0)} ${f(atas)} ${f(x0 + bahu)} ${f(atas)} L${f(100 + w / 2 - bahu)} ${f(atas)} Q${f(100 + w / 2)} ${f(atas)} ${f(100 + w / 2)} ${f(atas + bahu)} L${f(100 + w / 2)} ${LANTAI - 10} Q${f(100 + w / 2)} ${LANTAI} ${f(100 + w / 2 - 10)} ${LANTAI} L${f(x0 + 10)} ${LANTAI} Q${f(x0)} ${LANTAI} ${f(x0)} ${LANTAI - 10} Z`;
  const cairan = atas + h * 0.2;
  const tl = { x: x0 + 6, y: atas + h * 0.36, w: w - 12, h: h * 0.5 };
  return (
    <g>
      <defs>
        <clipPath id={`${id}-tubuh`}>
          <path d={tubuh} />
        </clipPath>
        <linearGradient id={`${id}-cair`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={p.tekstur.warna} stopOpacity={amber ? 0 : 0.6} />
          <stop offset="1" stopColor={campur(p.tekstur.warna, '#7c8a84', 0.25)} stopOpacity={amber ? 0 : 0.9} />
        </linearGradient>
      </defs>
      <Bayangan id={id} lebar={w} />
      <path d={tubuh} fill={`url(#${id}-kaca)`} stroke={amber ? '#3a1c06' : '#a3b1aa'} strokeWidth="0.8" />
      <g clipPath={`url(#${id}-tubuh)`}>
        <rect x={x0} y={cairan} width={w} height={LANTAI - cairan} fill={`url(#${id}-cair)`} />
        {amber && <rect x={x0} y={cairan} width={w} height={LANTAI - cairan} fill="#2a1203" opacity="0.28" />}
        <ellipse cx="100" cy={cairan} rx={w / 2} ry="2.6" fill="#ffffff" opacity={amber ? 0.18 : 0.55} />
        {/* pipa pipet di dalam botol */}
        <rect x="96.5" y={atas - 2} width="7" height={LANTAI - atas - 14} rx="3.5" fill="#ffffff" opacity={amber ? 0.18 : 0.42} />
        <rect x="98.2" y={cairan + 4} width="3.6" height={LANTAI - cairan - 22} rx="1.8" fill={amber ? '#f0c58c' : campur(p.tekstur.warna, '#5f6d67', 0.3)} opacity="0.6" />
      </g>
      <GarisTakar x={x0 + 4} atas={atas + bahu} bawah={LANTAI} warna={amber ? '#f5d9b8' : '#55625c'} angka={false} />
      <Kilap x={x0 + 9} atas={atas + 10} tinggi={h - 26} />
      <g clipPath={`url(#${id}-tubuh)`}>
        <Label x={tl.x} y={tl.y} w={tl.w} h={tl.h} p={p} v={v} warnaLangkah={warna} />
        <rect x={tl.x} y={tl.y} width={tl.w} height={tl.h} fill={`url(#${id}-lengkung)`} />
      </g>
      {/* leher, cincin pipet, dan karet */}
      <rect x={100 - leher / 2} y={atas - 9} width={leher} height="11" fill={amber ? '#5c2d0a' : '#cfd8d4'} />
      <rect x="78" y={atas - 31} width="44" height="24" rx="3" fill={`url(#${id}-tutup)`} />
      <rect x="78" y={atas - 31} width="44" height="3" rx="1.5" fill="#ffffff" opacity="0.35" />
      <path d={`M84 ${atas - 31} L84 ${atas - 56} Q84 ${atas - 74} 100 ${atas - 74} Q116 ${atas - 74} 116 ${atas - 56} L116 ${atas - 31} Z`} fill={`url(#${id}-gelap)`} />
      <rect x="89" y={atas - 66} width="3" height="28" rx="1.5" fill="#ffffff" opacity="0.18" />
    </g>
  );
}

function Pompa({ id, p, v, s, warna }) {
  const w = 74 * s;
  const h = 150 * s;
  const x0 = 100 - w / 2;
  const atas = LANTAI - h;
  const tubuh = `M${f(x0)} ${LANTAI - 10} L${f(x0)} ${f(atas + 16)} Q${f(x0)} ${f(atas)} ${f(x0 + 16)} ${f(atas)} L${f(100 + w / 2 - 16)} ${f(atas)} Q${f(100 + w / 2)} ${f(atas)} ${f(100 + w / 2)} ${f(atas + 16)} L${f(100 + w / 2)} ${LANTAI - 10} Q${f(100 + w / 2)} ${LANTAI} ${f(100 + w / 2 - 10)} ${LANTAI} L${f(x0 + 10)} ${LANTAI} Q${f(x0)} ${LANTAI} ${f(x0)} ${LANTAI - 10} Z`;
  const cairan = atas + h * 0.16;
  const tl = { x: x0 + 7, y: atas + h * 0.3, w: w - 14, h: h * 0.52 };
  return (
    <g>
      <defs>
        <clipPath id={`${id}-tubuh`}>
          <path d={tubuh} />
        </clipPath>
        <linearGradient id={`${id}-cair`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={p.tekstur.warna} stopOpacity={0.55 + (1 - p.tekstur.bening) * 0.45} />
          <stop offset="1" stopColor={campur(p.tekstur.warna, '#7c8a84', 0.2)} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <Bayangan id={id} lebar={w} />
      <path d={tubuh} fill={`url(#${id}-kaca)`} stroke="#a3b1aa" strokeWidth="0.8" />
      <g clipPath={`url(#${id}-tubuh)`}>
        <rect x={x0} y={cairan} width={w} height={LANTAI - cairan} fill={`url(#${id}-cair)`} />
        <ellipse cx="100" cy={cairan} rx={w / 2} ry="2.6" fill="#ffffff" opacity="0.5" />
        <rect x="97.5" y={atas - 2} width="5" height={LANTAI - atas - 10} rx="2.5" fill="#ffffff" opacity="0.45" />
      </g>
      <GarisTakar x={100 + w / 2 - 4} atas={atas + 16} bawah={LANTAI} warna="#55625c" sisi={-1} angka={false} />
      <Kilap x={x0 + 8} atas={atas + 8} tinggi={h - 22} />
      <g clipPath={`url(#${id}-tubuh)`}>
        <Label x={tl.x} y={tl.y} w={tl.w} h={tl.h} p={p} v={v} warnaLangkah={warna} />
        <rect x={tl.x} y={tl.y} width={tl.w} height={tl.h} fill={`url(#${id}-lengkung)`} />
      </g>
      {/* kepala pompa */}
      <rect x="83" y={atas - 15} width="34" height="16" rx="2" fill={`url(#${id}-tutup)`} />
      <rect x="95" y={atas - 31} width="10" height="17" fill={`url(#${id}-gelap)`} />
      <path d={`M80 ${atas - 44} L118 ${atas - 44} Q122 ${atas - 44} 122 ${atas - 40} L122 ${atas - 31} L80 ${atas - 31} Q78 ${atas - 31} 78 ${atas - 33} L78 ${atas - 42} Q78 ${atas - 44} 80 ${atas - 44} Z`} fill={`url(#${id}-gelap)`} />
      <path d={`M122 ${atas - 42} L146 ${atas - 40} Q149 ${atas - 39.6} 149 ${atas - 37} L149 ${atas - 35} L122 ${atas - 34} Z`} fill={`url(#${id}-gelap)`} />
      <rect x="82" y={atas - 43} width="30" height="2" rx="1" fill="#ffffff" opacity="0.22" />
    </g>
  );
}

function Botol({ id, p, v, s, warna }) {
  const w = 70 * s;
  const h = 166 * s;
  const x0 = 100 - w / 2;
  const atas = LANTAI - h;
  const bahu = 20;
  const tubuh = `M${f(x0)} ${LANTAI - 9} L${f(x0)} ${f(atas + bahu)} Q${f(x0)} ${f(atas + 2)} ${f(x0 + 18)} ${f(atas)} L${f(100 + w / 2 - 18)} ${f(atas)} Q${f(100 + w / 2)} ${f(atas + 2)} ${f(100 + w / 2)} ${f(atas + bahu)} L${f(100 + w / 2)} ${LANTAI - 9} Q${f(100 + w / 2)} ${LANTAI} ${f(100 + w / 2 - 9)} ${LANTAI} L${f(x0 + 9)} ${LANTAI} Q${f(x0)} ${LANTAI} ${f(x0)} ${LANTAI - 9} Z`;
  const cairan = atas + h * 0.14;
  const tl = { x: x0 + 6, y: atas + h * 0.34, w: w - 12, h: h * 0.44 };
  return (
    <g>
      <defs>
        <clipPath id={`${id}-tubuh`}>
          <path d={tubuh} />
        </clipPath>
        <linearGradient id={`${id}-cair`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={p.tekstur.warna} stopOpacity={0.5 + (1 - p.tekstur.bening) * 0.4} />
          <stop offset="1" stopColor={campur(p.tekstur.warna, '#7c8a84', 0.22)} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <Bayangan id={id} lebar={w} />
      <path d={tubuh} fill={`url(#${id}-kaca)`} stroke="#a3b1aa" strokeWidth="0.8" />
      <g clipPath={`url(#${id}-tubuh)`}>
        <rect x={x0} y={cairan} width={w} height={LANTAI - cairan} fill={`url(#${id}-cair)`} />
        <ellipse cx="100" cy={cairan} rx={w / 2} ry="2.4" fill="#ffffff" opacity="0.5" />
      </g>
      <GarisTakar x={x0 + 4} atas={atas + bahu} bawah={LANTAI} warna="#55625c" angka={false} />
      <Kilap x={x0 + 8} atas={atas + 10} tinggi={h - 24} />
      <g clipPath={`url(#${id}-tubuh)`}>
        <Label x={tl.x} y={tl.y} w={tl.w} h={tl.h} p={p} v={v} warnaLangkah={warna} />
        <rect x={tl.x} y={tl.y} width={tl.w} height={tl.h} fill={`url(#${id}-lengkung)`} />
      </g>
      <rect x="86" y={atas - 8} width="28" height="9" fill="#d3dbd7" />
      <rect x="80" y={atas - 40} width="40" height="34" rx="3" fill={`url(#${id}-tutup)`} />
      <Rusuk x0={83} jarak={5.6} jumlah={7} atas={atas - 37} bawah={atas - 9} warna="#000000" tebal={1} opasitas={0.1} />
      <rect x="80" y={atas - 40} width="40" height="3" rx="1.5" fill="#ffffff" opacity="0.32" />
    </g>
  );
}

function Tabung({ id, p, v, s, warna }) {
  const wa = 80 * s;
  const wb = 50;
  const h = 176 * s;
  const tutupH = 30;
  const bawahTabung = LANTAI - tutupH;
  const atas = LANTAI - h;
  const tubuh = `M${f(100 - wb / 2)} ${bawahTabung} L${f(100 - wa / 2)} ${f(atas + 14)} L${f(100 + wa / 2)} ${f(atas + 14)} L${f(100 + wb / 2)} ${bawahTabung} Z`;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-tubuh`}>
          <path d={tubuh} />
        </clipPath>
        <linearGradient id={`${id}-putih`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#d8ded9" />
          <stop offset="0.2" stopColor="#fbfbf8" />
          <stop offset="0.6" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c8d0cb" />
        </linearGradient>
      </defs>
      <Bayangan id={id} lebar={wb + 10} />
      {/* tutup di bawah */}
      <rect x={100 - wb / 2 - 3} y={bawahTabung} width={wb + 6} height={tutupH} rx="4" fill={`url(#${id}-tutup)`} />
      <rect x={100 - wb / 2 - 3} y={LANTAI - 4} width={wb + 6} height="4" rx="2" fill="#000000" opacity="0.12" />
      <path d={tubuh} fill={`url(#${id}-putih)`} stroke="#b7c1bb" strokeWidth="0.8" />
      <g clipPath={`url(#${id}-tubuh)`}>
        <rect x="0" y={atas + 14} width="200" height="7" fill={warna} />
        <Label x={100 - wa / 2 + 9} y={atas + 30} w={wa - 18} h={h * 0.5} p={p} v={v} warnaLangkah={warna} />
      </g>
      <rect x={100 - wa / 2 + 6} y={atas + 22} width="4" height={h - tutupH - 34} rx="2" fill="#ffffff" opacity="0.6" />
      {/* lipatan ujung tabung */}
      <rect x={100 - wa / 2 - 2} y={atas} width={wa + 4} height="15" rx="1.5" fill="#eef1ee" stroke="#b7c1bb" strokeWidth="0.8" />
      <Rusuk x0={100 - wa / 2 + 1} jarak={4} jumlah={Math.round(wa / 4)} atas={atas + 2} bawah={atas + 13} warna="#9aa6a0" />
    </g>
  );
}

function Jar({ id, p, v, s, warna }) {
  const w = 112 * s;
  const h = 70 * s;
  const x0 = 100 - w / 2;
  const atas = LANTAI - h;
  const isiGelap = p.tekstur.bening < 0.3;
  const tubuh = `M${f(x0)} ${LANTAI - 9} L${f(x0)} ${f(atas + 6)} Q${f(x0)} ${f(atas)} ${f(x0 + 6)} ${f(atas)} L${f(100 + w / 2 - 6)} ${f(atas)} Q${f(100 + w / 2)} ${f(atas)} ${f(100 + w / 2)} ${f(atas + 6)} L${f(100 + w / 2)} ${LANTAI - 9} Q${f(100 + w / 2)} ${LANTAI} ${f(100 + w / 2 - 9)} ${LANTAI} L${f(x0 + 9)} ${LANTAI} Q${f(x0)} ${LANTAI} ${f(x0)} ${LANTAI - 9} Z`;
  const tl = { x: x0 + 14, y: atas + 10, w: w - 28, h: h - 18 };
  return (
    <g>
      <defs>
        <clipPath id={`${id}-tubuh`}>
          <path d={tubuh} />
        </clipPath>
      </defs>
      <Bayangan id={id} lebar={w} />
      <path d={tubuh} fill={`url(#${id}-kaca)`} stroke="#a3b1aa" strokeWidth="0.8" />
      <g clipPath={`url(#${id}-tubuh)`}>
        <rect x={x0} y={atas + 6} width={w} height={h} fill={p.tekstur.warna} opacity={isiGelap ? 0.95 : 0.7} />
        <rect x={x0} y={atas + 6} width={w} height="4" fill="#ffffff" opacity="0.35" />
      </g>
      <Kilap x={x0 + 6} atas={atas + 8} tinggi={h - 18} lebar={4} />
      <g clipPath={`url(#${id}-tubuh)`}>
        <Label x={tl.x} y={tl.y} w={tl.w} h={tl.h} p={p} v={v} warnaLangkah={warna} />
        <rect x={tl.x} y={tl.y} width={tl.w} height={tl.h} fill={`url(#${id}-lengkung)`} />
      </g>
      {/* tutup */}
      <rect x={x0 - 4} y={atas - 30} width={w + 8} height="32" rx="5" fill={`url(#${id}-tutup)`} />
      <rect x={x0 - 4} y={atas - 30} width={w + 8} height="4" rx="2" fill="#ffffff" opacity="0.3" />
      <rect x={x0 - 4} y={atas - 2} width={w + 8} height="3" fill="#000000" opacity="0.12" />
    </g>
  );
}

function Kantong({ id, p, v, s }) {
  const w = 104 * s;
  const h = 168 * s;
  const x0 = 100 - w / 2;
  const atas = LANTAI - h;
  const tubuh = `M${f(x0 + 4)} ${f(atas + 10)} Q${f(x0)} ${f(atas + 10)} ${f(x0)} ${f(atas + 20)} L${f(x0 + 3)} ${LANTAI - 18} Q${f(x0 + 6)} ${LANTAI - 2} ${f(x0 + 22)} ${LANTAI} L${f(100 + w / 2 - 22)} ${LANTAI} Q${f(100 + w / 2 - 6)} ${LANTAI - 2} ${f(100 + w / 2 - 3)} ${LANTAI - 18} L${f(100 + w / 2)} ${f(atas + 20)} Q${f(100 + w / 2)} ${f(atas + 10)} ${f(100 + w / 2 - 4)} ${f(atas + 10)} Z`;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-tubuh`}>
          <path d={tubuh} />
        </clipPath>
        <linearGradient id={`${id}-kantong`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#d9dfda" />
          <stop offset="0.25" stopColor="#f6f7f3" />
          <stop offset="0.55" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfd6d1" />
        </linearGradient>
      </defs>
      <Bayangan id={id} lebar={w} />
      <path d={tubuh} fill={`url(#${id}-kantong)`} stroke="#b4beb8" strokeWidth="0.8" />
      <g clipPath={`url(#${id}-tubuh)`}>
        {/* segel atas dan lipatan bawah */}
        <rect x={x0 - 2} y={atas + 10} width={w + 4} height="11" fill="#e5e9e5" />
        <Rusuk x0={x0} jarak={3.5} jumlah={Math.round(w / 3.5)} atas={atas + 11} bawah={atas + 20} warna="#a9b4ae" tebal={0.7} opasitas={0.45} />
        <path d={`M${f(x0)} ${LANTAI - 20} Q100 ${LANTAI - 34} ${f(100 + w / 2)} ${LANTAI - 20}`} fill="none" stroke="#aab4ae" strokeWidth="0.9" />
        <rect x={x0 + 12} y={atas + 34} width={w - 24} height="9" fill={p.tekstur.warna} opacity="0.95" />
        <Label x={x0 + 12} y={atas + 46} w={w - 24} h={h * 0.5} p={p} v={v} warnaLangkah={cariLangkah(p.langkah).warna} isiUlang />
        <rect x={x0 + 8} y={atas + 26} width="5" height={h - 60} rx="2.5" fill="#ffffff" opacity="0.7" />
      </g>
      {/* garis gunting di sudut kiri */}
      <path d={`M${f(x0 + 2)} ${f(atas + 32)} L${f(x0 + 20)} ${f(atas + 12)}`} stroke={TINTA} strokeWidth="0.9" strokeDasharray="2.4 2" opacity="0.55" />
      {/* corong dan tutup di kanan atas */}
      <rect x={100 + w / 2 - 34} y={atas - 6} width="18" height="18" rx="2" fill={`url(#${id}-tutup)`} />
      <rect x={100 + w / 2 - 31} y={atas - 14} width="12" height="9" rx="1.5" fill={`url(#${id}-tutup)`} />
    </g>
  );
}

function Pod({ id, p, v, s, warna }) {
  const w = 98 * s;
  const h = 52 * s;
  const x0 = 100 - w / 2;
  const atas = LANTAI - h;
  const tubuh = `M${f(x0)} ${f(atas)} L${f(100 + w / 2)} ${f(atas)} L${f(100 + w / 2 - 6)} ${LANTAI - 6} Q${f(100 + w / 2 - 7)} ${LANTAI} ${f(100 + w / 2 - 13)} ${LANTAI} L${f(x0 + 13)} ${LANTAI} Q${f(x0 + 7)} ${LANTAI} ${f(x0 + 6)} ${LANTAI - 6} Z`;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-tubuh`}>
          <path d={tubuh} />
        </clipPath>
        <linearGradient id={`${id}-foil`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f3f5f4" />
          <stop offset="0.45" stopColor="#c9d0cd" />
          <stop offset="1" stopColor="#eef1ef" />
        </linearGradient>
      </defs>
      <Bayangan id={id} lebar={w} />
      <path d={tubuh} fill="#f4f6f3" stroke="#aeb8b2" strokeWidth="0.8" />
      <g clipPath={`url(#${id}-tubuh)`}>
        <Label x={x0 + 10} y={atas + 6} w={w - 20} h={h - 10} p={p} v={v} warnaLangkah={warna} isiUlang />
        <rect x={x0} y={atas} width={w} height={h} fill={`url(#${id}-lengkung)`} />
      </g>
      {/* tutup foil dengan lidah tarik */}
      <ellipse cx="100" cy={atas} rx={w / 2 + 2} ry="9" fill={`url(#${id}-foil)`} stroke="#aeb8b2" strokeWidth="0.8" />
      <path d={`M${f(100 + w / 2 - 4)} ${f(atas - 2)} L${f(100 + w / 2 + 14)} ${f(atas - 12)} L${f(100 + w / 2 + 18)} ${f(atas - 4)} L${f(100 + w / 2 + 2)} ${f(atas + 4)} Z`} fill={`url(#${id}-foil)`} stroke="#aeb8b2" strokeWidth="0.8" />
    </g>
  );
}

function Stik({ id, p, v, s, warna }) {
  const w = 44 * s;
  const h = 134 * s;
  const x0 = 100 - w / 2;
  const atas = LANTAI - h;
  const potong = atas + h * 0.34;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-karton`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#a98f6c" />
          <stop offset="0.25" stopColor="#dcc7a6" />
          <stop offset="0.6" stopColor="#e6d4b6" />
          <stop offset="1" stopColor="#9c8361" />
        </linearGradient>
      </defs>
      <Bayangan id={id} lebar={w} />
      <rect x={x0} y={atas} width={w} height={h} rx="3" fill={`url(#${id}-karton)`} />
      <ellipse cx="100" cy={atas + 1} rx={w / 2} ry="3.4" fill="#ecdcc1" />
      <rect x={x0} y={potong} width={w} height="1.4" fill="#7d6748" opacity="0.6" />
      <rect x={x0} y={potong + 6} width={w} height="6" fill={warna} />
      <text x="100" y={potong + 26} fontSize="7.4" fill={TINTA} textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }}>
        takar
      </text>
      {p.label.nama.join(' ').split(' ').map((kata, i) => (
        <text key={kata} x="100" y={potong + 38 + i * 10.5} fontSize="9.2" fill={TINTA} textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }}>
          {kata}
        </text>
      ))}
      {p.label.sub && (
        <text x="100" y={potong + 61} fontSize="5.6" fill="#4a3d2a" textAnchor="middle" style={{ fontFamily: 'var(--font-mono)' }}>
          {p.label.sub}
        </text>
      )}
      <text x="100" y={LANTAI - 7} fontSize="5.8" fill={TINTA} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)' }}>
        {v.ukuran} {v.satuan}
      </text>
      <rect x={x0 + 4} y={atas + 6} width="3" height={h - 14} rx="1.5" fill="#ffffff" opacity="0.35" />
    </g>
  );
}

function Batang({ id, p, v }) {
  // Tampak tiga perempat: muka atas, muka depan, dan sisi kanan.
  const isi3 = v.jumlahIsi > 1;
  const satu = (dx, dy, k) => (
    <g key={k} transform={`translate(${dx} ${dy})`}>
      <path d="M40 228 L132 228 L160 212 L68 212 Z" fill="#f3efcf" />
      <path d="M40 228 L132 228 L132 270 L40 270 Z" fill={p.tekstur.warna} />
      <path d="M132 228 L160 212 L160 254 L132 270 Z" fill={campur(p.tekstur.warna, '#6f6a3e', 0.25)} />
      {/* pita kertas */}
      <path d="M70 228 L104 228 L104 270 L70 270 Z" fill={KERTAS} />
      <path d="M70 228 L104 228 L132 212 L98 212 Z" fill="#f0efe8" />
      <rect x="70" y="228" width="34" height="5" fill={cariLangkah(p.langkah).warna} />
      <text x="87" y="245" fontSize="6.4" fill={TINTA} textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }}>
        takar
      </text>
      <text x="87" y="256" fontSize="7" fill={TINTA} textAnchor="middle" style={{ fontFamily: 'var(--font-display)' }}>
        Sereh
      </text>
      <text x="87" y="265" fontSize="5" fill={TINTA} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)' }}>
        100 g
      </text>
    </g>
  );
  return (
    <g>
      <Bayangan id={id} lebar={isi3 ? 150 : 120} />
      {isi3 ? [satu(-4, -84, 'a'), satu(4, -42, 'b'), satu(0, 0, 'c')] : satu(0, 0, 'a')}
    </g>
  );
}

const BENTUK = {
  pipet: Pipet,
  'pipet-amber': Pipet,
  pompa: Pompa,
  botol: Botol,
  tabung: Tabung,
  jar: Jar,
  kantong: Kantong,
  pod: Pod,
  stik: Stik,
  batang: Batang,
};

// Skala ukuran: varian terbesar digambar paling tinggi.
function skalaVarian(p, v) {
  const sama = p.varian.filter((x) => x.kemasan === v.kemasan && !x.jumlahIsi);
  if (sama.length < 2) return 0.94;
  const min = Math.min(...sama.map((x) => x.ukuran));
  const max = Math.max(...sama.map((x) => x.ukuran));
  return 0.86 + (0.14 * (v.ukuran - min)) / Math.max(1, max - min);
}

// Tinggi dan lebar tiap bentuk (untuk bingkai "pas" yang memotong ruang kosong di atasnya).
function ukuranBentuk(kemasan, s, v) {
  switch (kemasan) {
    case 'pipet':
    case 'pipet-amber':
      return { atas: LANTAI - 122 * s - 74, lebar: 78 * s };
    case 'pompa':
      return { atas: LANTAI - 150 * s - 44, lebar: 74 * s + 54 };
    case 'botol':
      return { atas: LANTAI - 166 * s - 40, lebar: 70 * s };
    case 'tabung':
      return { atas: LANTAI - 176 * s, lebar: 84 * s };
    case 'jar':
      return { atas: LANTAI - 70 * s - 30, lebar: 120 * s };
    case 'kantong':
      return { atas: LANTAI - 168 * s - 14, lebar: 104 * s };
    case 'pod':
      return { atas: LANTAI - 52 * s - 14, lebar: 136 * s };
    case 'stik':
      return { atas: LANTAI - 134 * s, lebar: 44 * s };
    case 'batang':
      return { atas: v.jumlahIsi > 1 ? 120 : 204, lebar: 130 };
    default:
      return { atas: 40, lebar: 120 };
  }
}

// bingkai: 'rak' = skala sebenarnya di bingkai 200 × 300 (untuk jajaran di rak);
// 'pas' = dipotong ke bentuknya dengan rasio 4:5 (untuk kartu produk).
// Foto kemasan (CC0/PD, tanpa merek) per bentuk wadah; label Takar ditempel di atasnya lewat HTML.
// Bentuk yang tidak punya foto yang cocok (kantong, wadah dalam, tabung kertas) tetap ilustrasi SVG.
const FOTO = {
  pipet: ['pipet-1', 'pipet-2'],
  'pipet-amber': ['amber'],
  botol: ['amber'],
  pompa: ['pompa'],
  tabung: ['tabung'],
  jar: ['jar'],
  batang: ['sabun'],
};
const RASIO = { rak: '2 / 3', 'rak-dekat': '200 / 222', 'rak-rendah': '200 / 196', pas: '4 / 5' };

function berkasFoto(p, v) {
  const daftar = FOTO[v.kemasan];
  if (!daftar) return null;
  const n = [...p.slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const src = `/images/kemasan/${daftar[n % daftar.length]}.jpg`;
  return manifest[src] ? src : null;
}

export const punyaFoto = (slug, varian) => {
  const p = cariProduk(slug);
  return Boolean(berkasFoto(p, cariVarian(p, varian)));
};

function KemasanFoto({ src, p, v, l, judul, className, style, bingkai, sizes }) {
  const isiTeks = v.jumlahIsi ? `${v.jumlahIsi}×${v.ukuran / v.jumlahIsi} ${v.satuan}` : `${v.ukuran} ${v.satuan}`;
  return (
    <div
      className={`relative overflow-hidden rounded-[10px] bg-kertas ${className}`}
      style={{ aspectRatio: RASIO[bingkai] || RASIO.pas, containerType: 'inline-size', ...style }}
      role={judul ? 'img' : undefined}
      aria-label={judul || undefined}
      aria-hidden={judul ? undefined : 'true'}
    >
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
      <div className="absolute bottom-[6cqw] left-[6cqw] w-[38cqw] overflow-hidden bg-[#fbfaf5] shadow-[0_1px_3px_rgba(23,32,28,0.35)]" style={{ fontSize: '10cqw' }}>
        <div className="h-[1.6cqw]" style={{ background: l.warna }} />
        <div className="px-[2.4cqw] pb-[2cqw] pt-[1.4cqw] text-center leading-none text-[#17201c]">
          <div className="text-[3.6cqw] tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>takar</div>
          <div className="mt-[0.8cqw] text-[5.4cqw] leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>{p.label.nama.join(' ')}</div>
          {p.label.angka ? (
            <div className="mt-[0.8cqw] text-[6.4cqw] font-medium" style={{ fontFamily: 'var(--font-mono)' }}>{p.label.angka}</div>
          ) : null}
          <div className="mt-[1cqw] border-t border-[#cfd6d0] pt-[0.8cqw] text-[3cqw]" style={{ fontFamily: 'var(--font-mono)' }}>{isiTeks}</div>
        </div>
      </div>
    </div>
  );
}

export default function Kemasan({ slug, varian, judul, className = '', bingkai = 'rak', style, sizes = '(min-width: 1024px) 320px, 45vw' }) {
  const id = useId().replace(/:/g, '');
  const p = cariProduk(slug);
  const v = cariVarian(p, varian);
  const foto = berkasFoto(p, v);
  if (foto) return <KemasanFoto src={foto} p={p} v={v} l={cariLangkah(p.langkah)} judul={judul} className={className} style={style} bingkai={bingkai} sizes={sizes} />;
  const l = cariLangkah(p.langkah);
  const Bentuk = BENTUK[v.kemasan] || Pipet;
  const amber = v.kemasan === 'pipet-amber';
  const s = skalaVarian(p, v);
  let viewBox = '0 0 200 300';
  if (bingkai === 'rak-dekat') viewBox = '0 78 200 222';
  if (bingkai === 'rak-rendah') viewBox = '0 104 200 196';
  if (bingkai === 'pas') {
    const u = ukuranBentuk(v.kemasan, s, v);
    const bawah = LANTAI + 12;
    let tinggi = bawah - u.atas + 22;
    let lebar = Math.max(u.lebar + 44, tinggi * 0.8);
    if (lebar > tinggi * 0.8) tinggi = lebar / 0.8;
    viewBox = `${f(100 - lebar / 2)} ${f(bawah - tinggi)} ${f(lebar)} ${f(tinggi)}`;
  }
  return (
    <svg viewBox={viewBox} className={className} style={style} role={judul ? 'img' : undefined} aria-label={judul || undefined} aria-hidden={judul ? undefined : 'true'} focusable="false">
      <defs>
        <GradienKaca id={id} amber={amber} />
        <GradienTutup id={id} warna={l.warna} />
        <GradienGelap id={id} />
        <GradienLengkung id={id} />
      </defs>
      <Bentuk id={id} p={p} v={v} s={s} amber={amber} warna={l.warna} />
    </svg>
  );
}
