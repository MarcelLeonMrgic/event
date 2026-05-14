import Image from "next/image";
import Link from "next/link";

const facts = [
  { value: "22.5.", label: "Nächste Party" },
  { value: "3", label: "Locations" },
  { value: "2", label: "Bars" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#171512]">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <a className="flex items-center gap-3" href="#" aria-label="TuDo Makerspace">
          <Image
            alt=""
            className="h-12 w-auto"
            height={48}
            src="/images/tudo-logo.svg"
            width={88}
          />
          <span className="text-lg font-semibold tracking-[0.18em]">
            Makerspace
          </span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-medium text-[#5f5a51] sm:flex">
          <a className="transition hover:text-[#171512]" href="#location">
            Location
          </a>
          <Link className="transition hover:text-[#171512]" href="/schichten">
            Schichten
          </Link>
          <Link className="transition hover:text-[#171512]" href="/schichten/zwille">
            Zwille
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-14 pt-4 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pb-20">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#9b3f2f]">
            22. Mai 2026 · TuDo Makerspace · Zwille · Atomic
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] text-[#171512] sm:text-6xl lg:text-7xl">
            KontAKT Party.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#5f5a51]">
            Eine Party an drei Orten: Zwille, TuDo Makerspace und Atomic.
            Bar-Schichten gibt es für Zwille und TuDo Makerspace; das Atomic
            hat keine Bar.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-16 items-center justify-center rounded-md bg-[#171512] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#3a332b] sm:min-w-64"
              href="/schichten"
            >
              Makerspace-Schicht eintragen
            </Link>
            <Link
              className="inline-flex min-h-16 items-center justify-center rounded-md bg-[#171512] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#3a332b] sm:min-w-64"
              href="/schichten/zwille"
            >
              Zwille-Schicht eintragen
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-[#1f1c18] p-5 shadow-2xl shadow-[#6b4b2f]/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(232,164,83,0.9),transparent_30%),linear-gradient(135deg,rgba(155,63,47,0.9),rgba(31,28,24,0.9)_55%,rgba(21,75,85,0.86))]" />
          <div className="absolute inset-x-8 top-8 h-40 rounded-full border border-white/20" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />
          <Image
            alt="TuDo Makerspace Logo"
            className="absolute left-1/2 top-[42%] w-[118%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-20 invert"
            height={765}
            priority
            src="/images/tudo-logo.svg"
            width={1400}
          />
          <div className="relative flex h-full min-h-[380px] flex-col justify-between">
            <div className="flex justify-between text-sm font-medium text-white/80">
              <span>Start 20:00 Uhr</span>
              <span>Ende 06:00 Uhr</span>
            </div>
            <div>
              <div className="mb-6 grid grid-cols-3 gap-3">
                {facts.map((fact) => (
                  <div
                    className="rounded-md border border-white/20 bg-white/10 p-4 backdrop-blur"
                    key={fact.label}
                  >
                    <p className="text-2xl font-semibold text-white">
                      {fact.value}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/70">
                      {fact.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-md bg-white p-5 text-[#171512]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9b3f2f]">
                  Nächstes Event
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                  KontAKT Party
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#5f5a51]">
                  Am 22.5.2026 in Zwille, TuDo Makerspace und Atomic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-2"
        id="location"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9b3f2f]">
            Location
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Drei Locations, zwei Bars.
          </h2>
          <p className="mt-4 max-w-xl leading-8 text-[#5f5a51]">
            Die KontAKT Party findet in der Zwille, im TuDo Makerspace und im
            Atomic statt. Für Zwille und Makerspace kannst du dich in
            Bar-Schichten eintragen; im Atomic gibt es keine Bar-Schichten.
          </p>
        </div>
        <div className="rounded-lg border border-[#ded4c4] bg-[#fffaf3] p-6">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold text-[#9b3f2f]">Location 1</dt>
              <dd className="mt-1 text-[#5f5a51]">
                Zwille
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-[#9b3f2f]">Location 2</dt>
              <dd className="mt-1 text-[#5f5a51]">
                TuDo Makerspace, EB Gebäude
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-[#9b3f2f]">Location 3</dt>
              <dd className="mt-1 text-[#5f5a51]">Atomic</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-[#9b3f2f]">Bar-Schichten</dt>
              <dd className="mt-1 text-[#5f5a51]">Zwille & Makerspace</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="bg-[#171512] px-6 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e8a453]">
              Schichten
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Hilf an einer der beiden Bars mit.
            </h2>
          </div>
          <Link
            className="inline-flex min-h-16 items-center justify-center rounded-md bg-white px-8 py-4 text-base font-semibold text-[#171512] transition hover:bg-[#f7f3ed] sm:min-w-64"
            href="/schichten"
          >
            Zum Makerspace-Schichtplan
          </Link>
          <Link
            className="inline-flex min-h-16 items-center justify-center rounded-md bg-white px-8 py-4 text-base font-semibold text-[#171512] transition hover:bg-[#f7f3ed] sm:min-w-64"
            href="/schichten/zwille"
          >
            Zum Zwille-Schichtplan
          </Link>
        </div>
      </section>
    </main>
  );
}
