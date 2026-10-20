// Piktogram takaran pakai: tetes, pompa, seukuran kacang, dua ruas jari, dan seterusnya.
const garis = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

function Tetes({ isi = true }) {
  return <path d="M12 3.2S6.6 9.6 6.6 13.6a5.4 5.4 0 0 0 10.8 0C17.4 9.6 12 3.2 12 3.2Z" {...garis} fill={isi ? 'currentColor' : 'none'} />;
}

const IKON = {
  tetes: Tetes,
  pompa: () => (
    <g {...garis}>
      <path d="M8 9h8v12H8z" />
      <path d="M10 9V6h4v3M14 4.6H6.6M10 4.6V6" />
    </g>
  ),
  almond: () => <path d="M12 4c4.2 2.4 6 6.4 5 10.2-.8 3-2.8 5.4-5 5.8-2.2-.4-4.2-2.8-5-5.8C6 10.4 7.8 6.4 12 4Z" {...garis} />,
  kacang: () => (
    <g {...garis}>
      <circle cx="12" cy="13" r="4.6" />
      <path d="M10.4 11.6a1.8 1.8 0 0 1 2-1" />
    </g>
  ),
  jari: () => (
    <g {...garis}>
      <rect x="5.4" y="3.6" width="5.6" height="17" rx="2.8" />
      <rect x="13" y="5" width="5.6" height="15.6" rx="2.8" />
      <path d="M6.6 9.6h3.2M14.2 10.6h3.2" />
    </g>
  ),
  telapak: () => (
    <g {...garis}>
      <path d="M5 13.5c0 4 3.2 7 7 7s7-3 7-7v-2H5Z" />
      <path d="M8.6 11.5V8M12 11.5V6.5M15.4 11.5V8" />
    </g>
  ),
  kapas: () => (
    <g {...garis}>
      <circle cx="12" cy="12" r="7.4" />
      <path d="M8.4 10.2c1.6-.8 2.8.8 4.2 0s2.6-.4 3.2.4M8.4 13.8c1.6-.8 2.8.8 4.2 0s2.6-.4 3.2.4" />
    </g>
  ),
  oles: () => <path d="M4 16c3-4.6 6-5.2 8.6-3.8S17 15.2 20 9" {...garis} strokeWidth="2.4" />,
};

export default function Takaran({ takaran, className = '', ringkas = false }) {
  const Ikon = IKON[takaran.ikon] || IKON.oles;
  const ulang = takaran.ikon === 'tetes' ? Math.min(takaran.n, 6) : 1;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="inline-flex" aria-hidden="true">
        {Array.from({ length: ulang }, (_, i) => (
          <svg key={i} viewBox="0 0 24 24" className={`h-5 w-5 ${i ? '-ms-2' : ''}`} focusable="false">
            <Ikon />
          </svg>
        ))}
      </span>
      {!ringkas && <span>{takaran.label}</span>}
    </span>
  );
}
