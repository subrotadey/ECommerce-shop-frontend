import { Link } from "react-router";
import { ChevronRight, Home } from "lucide-react";

const InfoPage = ({ title, subtitle, updated, sections = [], children }) => (
  <div className="bg-white">
    <section className="bg-charcoal">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <nav className="mb-5 flex items-center gap-1.5 text-xs text-white/50">
          <Link to="/" className="flex items-center gap-1 hover:text-white">
            <Home size={12} /> Home
          </Link>
          <ChevronRight size={11} />
          <span className="text-white/80">{title}</span>
        </nav>
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base text-white/70">{subtitle}</p>}
        {updated && <p className="mt-4 text-xs text-gold">Last updated: {updated}</p>}
      </div>
    </section>

    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {sections.map((s) => (
        <section key={s.heading}>
          <h2 className="mb-3 text-xl font-bold text-charcoal">{s.heading}</h2>
          {s.paragraphs?.map((p) => (
            <p key={p} className="mb-3 text-sm leading-7 text-charcoal/75">{p}</p>
          ))}
          {s.items && (
            <ul className="space-y-2">
              {s.items.map((i) => (
                <li key={i} className="flex gap-3 text-sm leading-7 text-charcoal/75">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {i}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {children}
    </div>
  </div>
);

export default InfoPage;