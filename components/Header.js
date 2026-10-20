'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { nav } from '@/lib/data';
import { useKeranjang, useTerpasang } from '@/lib/store';

const navTambahan = [
  { href: '/lacak', label: 'Lacak pesanan' },
  { href: '/bantuan', label: 'Bantuan' },
  { href: '/tentang', label: 'Tentang Takar' },
  { href: '/kontak', label: 'Kontak' },
];

function IkonTas({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M5.2 8.6h13.6l-1 11.1a1.6 1.6 0 0 1-1.6 1.4H7.8a1.6 1.6 0 0 1-1.6-1.4l-1-11.1Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.9 8.6V7.2a3.1 3.1 0 0 1 6.2 0v1.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const path = usePathname();
  const [buka, setBuka] = useState(false);
  const keranjang = useKeranjang();
  const terpasang = useTerpasang();
  const jumlah = terpasang ? keranjang.reduce((n, it) => n + it.qty, 0) : 0;

  useEffect(() => {
    setBuka(false);
  }, [path]);

  useEffect(() => {
    if (!buka) return undefined;
    const tutup = (e) => {
      if (e.key === 'Escape') setBuka(false);
    };
    window.addEventListener('keydown', tutup);
    return () => window.removeEventListener('keydown', tutup);
  }, [buka]);

  const aktif = (href) => path === href || path.startsWith(`${href}/`);

  return (
    <header data-situs className="sticky top-0 z-40 border-b border-garis bg-ubin">
      <div aria-hidden="true" className="pita h-[6px]" />
      <div className="wadah flex h-16 items-center gap-3">
        <Link href="/" className="shrink-0 rounded-md" aria-label="Takar, ke beranda">
          <Logo ukuranTanda="h-7 w-7 sm:h-8 sm:w-8" teks="text-[1.6rem] sm:text-[1.75rem]" />
        </Link>

        <nav aria-label="Navigasi utama" className="ms-auto hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={aktif(n.href) ? 'page' : undefined}
                  className="relative rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-tinta-2 hover:bg-kabut hover:text-tinta aria-[current=page]:bg-tinta aria-[current=page]:text-kertas"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/lacak"
          aria-current={aktif('/lacak') ? 'page' : undefined}
          className="ms-auto hidden min-h-11 items-center rounded-full px-3 text-[0.95rem] font-medium text-tinta-2 hover:text-tinta hover:underline xl:ms-2 xl:flex aria-[current=page]:text-tinta aria-[current=page]:underline"
        >
          Lacak
        </Link>

        <Link
          href="/keranjang"
          className="ms-auto flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-2.5 py-2 font-medium hover:bg-kabut lg:ms-2 xl:ms-0"
          aria-current={path === '/keranjang' ? 'page' : undefined}
        >
          {/* Nama tautan dirakit dari isinya ("Keranjang 0 barang"), jadi selalu memuat teks yang terlihat. */}
          <IkonTas className="h-6 w-6" />
          <span className="sr-only sm:not-sr-only">Keranjang</span>{' '}
          <span
            className={`data inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[0.75rem] font-medium ${
              jumlah ? 'bg-kunyit text-tinta' : 'bg-kabut-2 text-tinta-2'
            }`}
          >
            {jumlah}
          </span>
          <span className="sr-only"> barang</span>
        </Link>

        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-2.5 py-2 font-medium hover:bg-kabut lg:hidden"
          aria-expanded={buka}
          aria-controls="menu-ponsel"
          onClick={() => setBuka((b) => !b)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
            {buka ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
          <span className="max-[359px]:sr-only">Menu</span>
        </button>
      </div>

      <nav id="menu-ponsel" aria-label="Navigasi utama (ponsel)" hidden={!buka} className="border-t border-garis bg-ubin lg:hidden">
        <ul className="wadah grid pt-2">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={aktif(n.href) ? 'page' : undefined}
                className="flex min-h-12 items-center justify-between border-b border-garis py-3 font-display text-[1.35rem] aria-[current=page]:text-daun"
                onClick={() => setBuka(false)}
              >
                {n.label}
                <span aria-hidden="true" className="text-tinta-3">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="wadah grid grid-cols-2 gap-x-4 py-3">
          {navTambahan.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="flex min-h-11 items-center text-[0.95rem] text-tinta-2 hover:underline" onClick={() => setBuka(false)}>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
