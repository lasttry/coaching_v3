// app/api/clubs/default/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { clubId } = await req.json();
  if (!clubId) {
    return NextResponse.json({ error: "No clubId provided" }, { status: 400 });
  }
  await prisma.user.update({
    where: { id: session.user.id },
    data: { defaultClubId: clubId },
  });
  return NextResponse.json({ message: "Default club updated" });
}