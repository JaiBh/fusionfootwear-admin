import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 401,
      });
    }
    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image url is required", { status: 400 });
    }
    if (!process.env.STORE_ID) {
      return new NextResponse("Internal error, unable to identity store id", {
        status: 500,
      });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        storeId: process.env.STORE_ID,
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARDS_POST]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: process.env.STORE_ID,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log(`[BILLBOARDS_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
