import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;
    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 401,
      });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }
    if (!process.env.STORE_ID) {
      return new NextResponse("Internal error, unable to identity store id", {
        status: 500,
      });
    }
    const color = await prismadb.color.create({
      data: {
        storeId: process.env.STORE_ID,
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLORS_POST]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
