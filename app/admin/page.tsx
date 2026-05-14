"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { shiftPlans } from "@/lib/shifts";

type AdminSignup = {
  id: string;
  alias: string;
  phone: string;
  location: string;
  shiftId: string;
  createdAt: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [signups, setSignups] = useState<AdminSignup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const signupsByLocationAndShift = useMemo(() => {
    return signups.reduce<Record<string, Record<string, AdminSignup[]>>>((grouped, signup) => {
      grouped[signup.location] = {
        ...(grouped[signup.location] ?? {}),
        [signup.shiftId]: [
          ...(grouped[signup.location]?.[signup.shiftId] ?? []),
          signup,
        ],
      };
      return grouped;
    }, {});
  }, [signups]);

  async function loadAdminSignups(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/signups", {
        headers: {
          "x-admin-password": password,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Admin-Daten konnten nicht geladen werden.");
      }

      setSignups(data.signups);
      setMessage("Admin-Daten geladen.");
    } catch (error) {
      setSignups([]);
      setMessage(
        error instanceof Error
          ? error.message
          : "Admin-Daten konnten nicht geladen werden.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteSignup(signup: AdminSignup) {
    const confirmed = window.confirm(
      `Eintragung von "${signup.alias}" wirklich entfernen?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(signup.id);
    setMessage("");

    try {
      const response = await fetch("/api/admin/signups", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id: signup.id }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Eintragung konnte nicht entfernt werden.");
      }

      setSignups((current) =>
        current.filter((entry) => entry.id !== signup.id),
      );
      setMessage(`Eintragung von "${signup.alias}" entfernt.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Eintragung konnte nicht entfernt werden.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#171512]">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link className="flex items-center gap-3" href="/" aria-label="TuDo Makerspace">
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
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-[#5f5a51] sm:flex">
          <Link className="transition hover:text-[#171512]" href="/schichten">
            Makerspace
          </Link>
          <Link className="transition hover:text-[#171512]" href="/schichten/zwille">
            Zwille
          </Link>
          <Link className="text-[#171512]" href="/admin">
            Admin
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-14 pt-4 md:grid-cols-[0.8fr_1.2fr] md:items-start md:pb-20">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#9b3f2f]">
            Admin · Bar-Schichten
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] text-[#171512] sm:text-6xl">
            Telefonnummern der Eintragungen.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#5f5a51]">
            Die oeffentliche Schichten-Seite zeigt nur das Anonym. Hier kannst
            du als Admin die gespeicherten Telefonnummern fuer die Orga sehen.
          </p>
        </div>

        <form
          className="rounded-lg border border-[#ded4c4] bg-[#fffaf3] p-6 shadow-2xl shadow-[#6b4b2f]/10"
          onSubmit={loadAdminSignups}
        >
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#9b3f2f]">
                Admin-Passwort
              </span>
              <input
                className="h-12 rounded-md border border-[#cfc5b5] bg-white px-3 text-[#171512] outline-none transition placeholder:text-[#9f9688] focus:border-[#154b55]"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Passwort eingeben"
                type="password"
                value={password}
              />
            </label>

            <button
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#171512] px-6 text-sm font-semibold text-white transition hover:bg-[#3a332b] disabled:cursor-not-allowed disabled:bg-[#8d8376]"
              disabled={isLoading || !password}
              type="submit"
            >
              {isLoading ? "Wird geladen..." : "Admin-Daten laden"}
            </button>

            {message ? (
              <p className="rounded-md bg-white px-4 py-3 text-sm leading-6 text-[#5f5a51]">
                {message}
              </p>
            ) : null}
          </div>
        </form>
      </section>

      <section className="border-y border-[#ded4c4] bg-white/55">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-14">
          <div className="mb-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9b3f2f]">
              Orga-Ansicht
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Schichten mit Telefonnummern
            </h2>
          </div>

          {Object.values(shiftPlans).map((plan) => (
            <div className="grid gap-4" key={plan.key}>
              <div className="pt-4">
                <h3 className="text-2xl font-semibold">{plan.title}</h3>
                <p className="mt-2 text-sm font-medium text-[#5f5a51]">
                  {plan.description}
                </p>
              </div>

              {plan.shifts.map((shift) => {
                const entries =
                  signupsByLocationAndShift[plan.key]?.[shift.id] ?? [];

                return (
              <article
                className="grid gap-4 rounded-lg border border-[#ded4c4] bg-[#fffaf3] p-5 md:grid-cols-[150px_1fr]"
                key={shift.id}
              >
                <time className="text-lg font-semibold text-[#154b55]">
                  {shift.time}
                </time>
                <div className="grid gap-3">
                  {entries.length > 0 ? (
                    entries.map((entry) => (
                      <div
                        className="grid gap-4 rounded-md bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                        key={entry.id}
                      >
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b3f2f]">
                            Anonym
                          </p>
                          <p className="mt-1 font-semibold">{entry.alias}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b3f2f]">
                            Telefon
                          </p>
                          <a
                            className="mt-1 block font-semibold text-[#154b55]"
                            href={`tel:${entry.phone}`}
                          >
                            {entry.phone}
                          </a>
                        </div>
                        <button
                          className="inline-flex h-10 items-center justify-center rounded-md border border-[#cfc5b5] px-4 text-sm font-semibold text-[#9b3f2f] transition hover:border-[#9b3f2f] disabled:cursor-not-allowed disabled:text-[#8d8376]"
                          disabled={deletingId === entry.id || !password}
                          onClick={() => deleteSignup(entry)}
                          type="button"
                        >
                          {deletingId === entry.id
                            ? "Entfernt..."
                            : "Entfernen"}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-md border border-dashed border-[#cfc5b5] px-4 py-3 text-sm font-semibold text-[#8d8376]">
                      Noch keine Eintragung.
                    </p>
                  )}
                </div>
              </article>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
