// Tanda Takar: tetes kunyit dengan tiga garis takar, dan nama merek huruf kecil.
export function TandaTakar({ className = '', warnaGaris = '#17201c' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path d="M16 2.6C16 2.6 6.2 14.2 6.2 20.4a9.8 9.8 0 0 0 19.6 0C25.8 14.2 16 2.6 16 2.6Z" fill="#f3b51b" stroke={warnaGaris} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.6 16.6h5M8.6 20.6h8.4M9.6 24.6h5" stroke={warnaGaris} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ className = '', ukuranTanda = 'h-8 w-8', teks = 'text-[1.7rem]', warnaGaris }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <TandaTakar className={ukuranTanda} warnaGaris={warnaGaris} />
      <span className={`font-display leading-none tracking-[-0.02em] ${teks}`}>takar</span>
    </span>
  );
}
