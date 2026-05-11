"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { shifts } from "@/lib/shifts";

type Signup = {
  id: string;
  alias: string;
  shiftId: string;
};

export default function ShiftPage() {
  const [selectedShift, setSelectedShift] = useState(shifts[0].id);
  const [alias, setAlias] = useState("");
  const [phone, setPhone] = useState("");
  const [signups, setSignups] = useState<Signup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSignups() {
      try {
        const response = await fetch("/api/signups");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Schichtplan konnte nicht geladen werden.");
        }

        setSignups(data.signups);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Schichtplan konnte nicht geladen werden.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSignups();
  }, []);

  const signupsByShift = useMemo(() => {
    return signups.reduce<Record<string, Signup[]>>((grouped, signup) => {
      grouped[signup.shiftId] = [...(grouped[signup.shiftId] ?? []), signup];
      return grouped;
    }, {});
  }, [signups]);

  const activeShift = useMemo(
    () => shifts.find((shift) => shift.id === selectedShift) ?? shifts[0],
    [selectedShift],
  );
  const activeSignups = signupsByShift[activeShift.id] ?? [];
  const freeSpots = activeShift.capacity - activeSignups.length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanAlias = alias.trim();
    const cleanPhone = phone.trim();

    if (!cleanAlias || !cleanPhone) {
      setMessage("Bitte gib ein Anonym und eine Telefonnummer an.");
      return;
    }

    if (freeSpots <= 0) {
      setMessage("Diese Schicht ist bereits voll.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/signups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alias: cleanAlias,
          phone: cleanPhone,
          shiftId: activeShift.id,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Die Anmeldung konnte nicht gespeichert werden.");
      }

      setSignups((current) => [...current, data.signup]);
      setAlias("");
      setPhone("");
      setMessage(
        "Eingetragen. Im Schichtplan ist nur dein Anonym sichtbar; die Telefonnummer wurde gespeichert und wird nicht öffentlich angezeigt.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Die Anmeldung konnte nicht gespeichert werden.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#171512]">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link className="text-lg font-semibold tracking-[0.18em]" href="/">
          TuDo
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-[#5f5a51] sm:flex">
          <Link className="transition hover:text-[#171512]" href="/#programm">
            Programm
          </Link>
          <Link className="transition hover:text-[#171512]" href="/#location">
            Location
          </Link>
          <Link className="text-[#171512]" href="/schichten">
            Schichten
          </Link>
          
        </div>
      </nav>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-14 pt-4 md:grid-cols-[0.95fr_1.05fr] md:items-start md:pb-20">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#9b3f2f]">
            Bar-Schichten · 22. Mai 2026
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] text-[#171512] sm:text-6xl">
            Schichtplan für die naechste Party.
          </h1>
          
        </div>

        <form
          className="rounded-lg border border-[#ded4c4] bg-[#fffaf3] p-6 shadow-2xl shadow-[#6b4b2f]/10"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#9b3f2f]">
                Schicht
              </span>
              <select
                className="h-12 rounded-md border border-[#cfc5b5] bg-white px-3 text-[#171512] outline-none transition focus:border-[#154b55]"
                onChange={(event) => {
                  setSelectedShift(event.target.value);
                  setMessage("");
                }}
                value={selectedShift}
              >
                {shifts.map((shift) => {
                  const taken = signupsByShift[shift.id]?.length ?? 0;
                  const isFull = taken >= shift.capacity;

                  return (
                    <option disabled={isFull} key={shift.id} value={shift.id}>
                      {shift.time} · {shift.capacity - taken} frei
                    </option>
                  );
                })}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#9b3f2f]">
                Anonym
              </span>
              <input
                className="h-12 rounded-md border border-[#cfc5b5] bg-white px-3 text-[#171512] outline-none transition placeholder:text-[#9f9688] focus:border-[#154b55]"
                onChange={(event) => setAlias(event.target.value)}
                placeholder="Name, Spitzname oder Alias"
                type="text"
                value={alias}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#9b3f2f]">
                Telefonnummer
              </span>
              <input
                className="h-12 rounded-md border border-[#cfc5b5] bg-white px-3 text-[#171512] outline-none transition placeholder:text-[#9f9688] focus:border-[#154b55]"
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+49 ..."
                type="tel"
                value={phone}
              />
            </label>

            <button
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#171512] px-6 text-sm font-semibold text-white transition hover:bg-[#3a332b] disabled:cursor-not-allowed disabled:bg-[#8d8376]"
              disabled={freeSpots <= 0 || isSubmitting || isLoading}
              type="submit"
            >
              {isSubmitting ? "Wird gespeichert..." : "In Schicht eintragen"}
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
              Plan
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Sichtbare Eintragungen
            </h2>
          </div>

          {shifts.map((shift) => {
            const entries = signupsByShift[shift.id] ?? [];
            const openSlots = shift.capacity - entries.length;

            return (
              <article
                className="grid gap-4 rounded-lg border border-[#ded4c4] bg-[#fffaf3] p-5 md:grid-cols-[150px_1fr_120px]"
                key={shift.id}
              >
                <time className="text-lg font-semibold text-[#154b55]">
                  {shift.time}
                </time>
                <div className="flex flex-wrap gap-2">
                  {entries.map((entry) => (
                    <span
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#171512]"
                      key={entry.id}
                    >
                      {entry.alias}
                    </span>
                  ))}
                  {Array.from({ length: openSlots }).map((_, index) => (
                    <span
                      className="rounded-md border border-dashed border-[#cfc5b5] px-3 py-2 text-sm font-semibold text-[#8d8376]"
                      key={`${shift.id}-open-${index}`}
                    >
                      frei
                    </span>
                  ))}
                </div>
                <p className="text-sm font-semibold text-[#5f5a51] md:text-right">
                  {openSlots} / {shift.capacity} frei
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
