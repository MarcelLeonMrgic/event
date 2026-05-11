import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { shifts } from "@/lib/shifts";

function isAuthorized(request: Request) {
  const adminPassword =
    process.env.ADMIN_PASSWORD ??
    (process.env.NODE_ENV === "production" ? undefined : "admin");
  const submittedPassword = request.headers.get("x-admin-password");

  return Boolean(
    adminPassword &&
      submittedPassword &&
      submittedPassword === adminPassword,
  );
}

export async function GET(request: Request) {
  if (!process.env.ADMIN_PASSWORD && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD ist noch nicht konfiguriert." },
      { status: 503 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Admin-Passwort ist falsch." },
      { status: 401 },
    );
  }

  const signups = await prisma.signup.findMany({
    orderBy: [{ shiftId: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      alias: true,
      phone: true,
      shiftId: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    shifts,
    signups: signups.map((signup) => ({
      ...signup,
      createdAt: signup.createdAt.toISOString(),
    })),
  });
}

export async function DELETE(request: Request) {
  if (!process.env.ADMIN_PASSWORD && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD ist noch nicht konfiguriert." },
      { status: 503 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Admin-Passwort ist falsch." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const id = body && typeof body.id === "string" ? body.id.trim() : "";

  if (!id) {
    return NextResponse.json(
      { error: "Keine Eintragung ausgewaehlt." },
      { status: 400 },
    );
  }

  try {
    await prisma.signup.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json(
      { error: "Diese Eintragung wurde nicht gefunden." },
      { status: 404 },
    );
  }
}
