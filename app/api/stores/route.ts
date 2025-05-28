import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name } = body;
    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    const store = await prismadb.store.updateMany({
      where: {
        id: process.env.STORE_ID,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log(`[STORE_PATCH]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
