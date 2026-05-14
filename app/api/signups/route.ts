import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getShift, getShiftPlan } from "@/lib/shifts";

type PublicSignup = {
  id: string;
  alias: string;
  location: string;
  shiftId: string;
  createdAt: string;
};

function mapSignup(signup: {
  id: string;
  alias: string;
  location: string;
  shiftId: string;
  createdAt: Date;
}): PublicSignup {
  return {
    id: signup.id,
    alias: signup.alias,
    location: signup.location,
    shiftId: signup.shiftId,
    createdAt: signup.createdAt.toISOString(),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plan = getShiftPlan(searchParams.get("location"));

  const signups = await prisma.signup.findMany({
    where: { location: plan.key },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      alias: true,
      location: true,
      shiftId: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    location: plan.key,
    shifts: plan.shifts,
    signups: signups.map(mapSignup),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Ungueltige Anfrage." },
      { status: 400 },
    );
  }

  const alias = typeof body.alias === "string" ? body.alias.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const shiftId = typeof body.shiftId === "string" ? body.shiftId.trim() : "";
  const plan = getShiftPlan(location);
  const shift = getShift(plan.key, shiftId);

  if (!shift) {
    return NextResponse.json(
      { error: "Diese Schicht existiert nicht." },
      { status: 400 },
    );
  }

  if (alias.length < 2 || alias.length > 40) {
    return NextResponse.json(
      { error: "Bitte gib ein Anonym mit 2 bis 40 Zeichen an." },
      { status: 400 },
    );
  }

  if (phone.length < 6 || phone.length > 40) {
    return NextResponse.json(
      { error: "Bitte gib eine gueltige Telefonnummer an." },
      { status: 400 },
    );
  }

  try {
    const signup = await prisma.$transaction(
      async (tx) => {
        const taken = await tx.signup.count({
          where: {
            location: plan.key,
            shiftId,
          },
        });

        if (taken >= shift.capacity) {
          throw new Error("SHIFT_FULL");
        }

        return tx.signup.create({
          data: {
            alias,
            phone,
            location: plan.key,
            shiftId,
          },
          select: {
            id: true,
            alias: true,
            location: true,
            shiftId: true,
            createdAt: true,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return NextResponse.json(
      {
        signup: mapSignup(signup),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "SHIFT_FULL") {
      return NextResponse.json(
        { error: "Diese Schicht ist bereits voll." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Die Anmeldung konnte nicht gespeichert werden." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Ungueltige Anfrage." },
      { status: 400 },
    );
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const plan = getShiftPlan(location);

  if (!id) {
    return NextResponse.json(
      { error: "Keine Eintragung ausgewaehlt." },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.signup.deleteMany({
      where: {
        id,
        location: plan.key,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Diese Eintragung wurde nicht gefunden." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json(
      { error: "Diese Eintragung wurde nicht gefunden." },
      { status: 404 },
    );
  }
}
