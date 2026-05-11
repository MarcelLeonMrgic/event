import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getShift, shifts } from "@/lib/shifts";

type PublicSignup = {
  id: string;
  alias: string;
  shiftId: string;
  createdAt: string;
};

function mapSignup(signup: {
  id: string;
  alias: string;
  shiftId: string;
  createdAt: Date;
}): PublicSignup {
  return {
    id: signup.id,
    alias: signup.alias,
    shiftId: signup.shiftId,
    createdAt: signup.createdAt.toISOString(),
  };
}

export async function GET() {
  const signups = await prisma.signup.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      alias: true,
      shiftId: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    shifts,
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
  const shiftId = typeof body.shiftId === "string" ? body.shiftId.trim() : "";
  const shift = getShift(shiftId);

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
          where: { shiftId },
        });

        if (taken >= shift.capacity) {
          throw new Error("SHIFT_FULL");
        }

        return tx.signup.create({
          data: {
            alias,
            phone,
            shiftId,
          },
          select: {
            id: true,
            alias: true,
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
