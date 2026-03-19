import Link from "next/link";

export const dynamic = "force-dynamic";

// ── Logo (shared SVG) ─────────────────────────────────────────────────────────
function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: [160, 40], md: [192, 48], lg: [240, 60] }[size];
  const [w, h] = dims;
  const scale = w / 192;
  return (
    <svg width={w} height={h} viewBox="0 0 192 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ArchFlow">
      <defs>
        <linearGradient id="lp-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="lp-blue" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <path d="M8 38 L8 22 Q8 10 18 10 Q28 10 28 22 L28 38" stroke="url(#lp-gold)" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M20 38 L20 18 Q20 4 32 4 Q44 4 44 18 L44 38" stroke="url(#lp-gold)" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M4 42 Q10 38 16 42 Q22 46 28 42 Q34 38 40 42 Q46 46 52 42" stroke="url(#lp-blue)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M4 46 Q10 42 16 46 Q22 50 28 46 Q34 42 40 46 Q46 50 52 46" stroke="url(#lp-blue)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <text x="60" y="30" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize={22 * scale} fill="white">Arch</text>
      <text x={60 + 41 * scale} y="30" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize={22 * scale} fill="#38bdf8">Flow</text>
      <text x="60" y="44" fontFamily="system-ui, sans-serif" fontWeight="400" fontSize={9 * scale} fill="#71717a" letterSpacing="2">ARQUITECTURA</text>
    </svg>
  );
}

// ── Unsplash helper ───────────────────────────────────────────────────────────
const U = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;

// ── Architecture image components ─────────────────────────────────────────────
function ImgHeroMain() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={U("photo-1600585154340-be6161a56a0c", 1200, 640)} alt="Vivienda contemporánea" className="w-full h-full object-cover" />
  );
}
function ImgHeroVilla() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={U("photo-1560185007-cde436f6a4d0", 600, 400)} alt="Villa con piscina" className="w-full h-full object-cover" />
  );
}
function ImgHeroInterior() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={U("photo-1600210492493-0946911123ea", 600, 400)} alt="Interior minimalista" className="w-full h-full object-cover" />
  );
}
function ImgShowcase1() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={U("photo-1512917774080-9991f1c4c750", 800, 1000)} alt="Villa Sierra Nevada" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
  );
}
function ImgShowcase2() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={U("photo-1486325212027-8081e485255e", 800, 500)} alt="Edificio de oficinas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
  );
}
function ImgShowcase3() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={U("photo-1580587771525-78b9dba3b914", 800, 500)} alt="Centro cultural" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
  );
}
function ImgShowcase4() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={U("photo-1545324418-cc1a3fa10c00", 800, 500)} alt="Complejo residencial" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
  );
}
function ImgShowcase5() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={U("photo-1546519638-68e109498ffc", 800, 500)} alt="Polideportivo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
  );
}



// ── Services data ─────────────────────────────────────────────────────────────
const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Arquitectura residencial",
    desc: "Diseñamos viviendas unifamiliares, reformas integrales y ampliaciones adaptadas a tu forma de vivir y a tu presupuesto.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Edificios y promociones",
    desc: "Proyectos de obra nueva para promotoras y empresas: bloques residenciales, oficinas, locales comerciales y naves industriales.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Dirección de obra",
    desc: "Supervisamos la ejecución de tu proyecto sobre el terreno para garantizar que lo que se construye es exactamente lo que se proyectó.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Rehabilitación y reforma",
    desc: "Rehabilitamos edificios con criterio técnico y sensibilidad: mejoras de eficiencia energética, accesibilidad y actualización estética.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Licencias y trámites",
    desc: "Gestionamos visados, licencias de obra, cédulas de habitabilidad y toda la documentación técnica ante administraciones y colegios.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Diseño sostenible",
    desc: "Integramos criterios bioclimáticos, materiales de bajo impacto y soluciones de eficiencia energética desde la primera fase del proyecto.",
  },
];

// ── Steps data ────────────────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    title: "Consulta inicial",
    desc: "Nos reunimos para entender tu proyecto, tus necesidades y tu presupuesto. Sin compromiso y sin coste.",
  },
  {
    number: "02",
    title: "Proyecto y diseño",
    desc: "Desarrollamos el proyecto completo: planos, memoria, presupuesto y toda la documentación técnica necesaria.",
  },
  {
    number: "03",
    title: "Ejecución y entrega",
    desc: "Dirigimos la obra y te mantenemos informado en cada fase hasta la entrega de llaves.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <Link
            href="/login"
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            Acceder
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-10 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
          <div className="w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-3xl mt-10" />
        </div>
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #52525b 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Estudio de arquitectura · Granada
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
            Diseñamos espacios que{" "}
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              transforman tu entorno
            </span>
          </h1>

          <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Arquitectura residencial, rehabilitación y obra nueva en Granada y provincia.
            Proyectamos con rigor técnico, compromiso y atención personalizada desde el primer día.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contacto"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              Solicitar presupuesto
            </a>
            <a
              href="#servicios"
              className="w-full sm:w-auto border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              Ver servicios
            </a>
          </div>
        </div>

      </section>

      {/* ── Hero mosaic ── */}
      <div className="px-6 pb-16">
        <div className="relative max-w-5xl mx-auto grid grid-cols-3 gap-3">
          {/* Large image left */}
          <div className="col-span-2 rounded-2xl overflow-hidden relative" style={{ height: 320 }}>
            <ImgHeroMain />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
            <span className="absolute bottom-4 left-4 text-sm text-white/80 font-medium">Vivienda contemporánea · Granada</span>
          </div>
          {/* Two stacked right */}
          <div className="flex flex-col gap-3" style={{ height: 320 }}>
            <div className="flex-1 rounded-2xl overflow-hidden relative">
              <ImgHeroVilla />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs text-white/70">Villa · La Zubia</span>
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden relative">
              <ImgHeroInterior />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs text-white/70">Interior · Albolote</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="border-y border-zinc-800 bg-zinc-900/40 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "+15", label: "Años de experiencia" },
            { value: "+180", label: "Proyectos realizados" },
            { value: "12", label: "Municipios en Granada" },
            { value: "100%", label: "Clientes satisfechos" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-amber-400 mb-1">{s.value}</p>
              <p className="text-zinc-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Project showcase ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">Portfolio</p>
            <h2 className="text-4xl font-bold mb-4">Proyectos que hablan por sí solos</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Una selección de nuestros trabajos recientes en la provincia de Granada.
            </p>
          </div>

          {/* Main showcase grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Feature image — spans 2 rows */}
            <div className="row-span-2 rounded-2xl overflow-hidden relative group" style={{ minHeight: 480 }}>
              <ImgShowcase1 />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wide">Residencial</span>
                <h3 className="text-white font-bold text-xl mt-1">Villa Sierra Nevada</h3>
                <p className="text-zinc-400 text-sm mt-1">280 m² · Cenes de la Vega</p>
              </div>
            </div>

            {/* Image 2 */}
            <div className="rounded-2xl overflow-hidden relative group" style={{ minHeight: 228 }}>
              <ImgShowcase2 />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-xs text-sky-400 font-semibold uppercase tracking-wide">Oficinas</span>
                <h3 className="text-white font-semibold mt-1">Parque Tecnológico</h3>
                <p className="text-zinc-400 text-xs mt-0.5">La Zubia · 7 plantas</p>
              </div>
            </div>

            {/* Image 3 */}
            <div className="rounded-2xl overflow-hidden relative group" style={{ minHeight: 228 }}>
              <ImgShowcase3 />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">Cultural</span>
                <h3 className="text-white font-semibold mt-1">Centro Cultural Albolote</h3>
                <p className="text-zinc-400 text-xs mt-0.5">350 butacas · Albolote</p>
              </div>
            </div>

            {/* Image 4 */}
            <div className="rounded-2xl overflow-hidden relative group" style={{ minHeight: 228 }}>
              <ImgShowcase4 />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wide">Residencial</span>
                <h3 className="text-white font-semibold mt-1">Complejo Las Acacias</h3>
                <p className="text-zinc-400 text-xs mt-0.5">120 viviendas · Maracena</p>
              </div>
            </div>

            {/* Image 5 */}
            <div className="rounded-2xl overflow-hidden relative group" style={{ minHeight: 228 }}>
              <ImgShowcase5 />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-xs text-violet-400 font-semibold uppercase tracking-wide">Deportivo</span>
                <h3 className="text-white font-semibold mt-1">Polideportivo Huétor Vega</h3>
                <p className="text-zinc-400 text-xs mt-0.5">Estructura CLT · 6.100 m²</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="servicios" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">Servicios</p>
            <h2 className="text-4xl font-bold mb-4">¿En qué podemos ayudarte?</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Cubrimos todas las fases del proceso arquitectónico, desde la idea inicial hasta la entrega de la obra.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((f) => (
              <div
                key={f.title}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors group"
              >
                <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-3">Cómo trabajamos</p>
            <h2 className="text-4xl font-bold mb-4">Un proceso claro, de principio a fin</h2>
            <p className="text-zinc-400 text-lg">Sabemos que embarcarse en una obra genera dudas. Por eso te acompañamos en cada etapa.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden sm:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            <div className="hidden sm:block absolute top-10 left-2/3 right-0 h-px bg-gradient-to-r from-zinc-700 to-transparent" />

            {steps.map((step) => (
              <div key={step.number} className="text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center mx-auto mb-5 relative z-10">
                  <span className="text-3xl font-bold text-amber-500/70">{step.number}</span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="contacto" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-12 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

            <h2 className="text-4xl font-bold mb-4 relative">
              ¿Tienes un proyecto{" "}
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                en mente?
              </span>
            </h2>
            <p className="text-zinc-400 text-lg mb-3 relative">
              Cuéntanos qué necesitas. La primera consulta es gratuita y sin compromiso.
            </p>
            <p className="text-zinc-500 text-sm mb-8 relative">
              📍 Granada · ✉️ hola@archflow.es · 📞 958 000 000
            </p>
            <a
              href="mailto:hola@archflow.es"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold px-10 py-4 rounded-xl text-base transition-colors relative"
            >
              Solicitar presupuesto gratuito
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} ArchFlow Arquitectura · Granada
          </p>
          <Link href="/login" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">
            Acceder
          </Link>
        </div>
      </footer>

    </div>
  );
}
