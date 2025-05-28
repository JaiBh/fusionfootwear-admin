import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value, department } = body;
    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }
    if (!department) {
      return new NextResponse("Department is required", { status: 400 });
    }
    if (!process.env.STORE_ID) {
      return new NextResponse("Internal error, unable to identity store id", {
        status: 500,
      });
    }
    const isDuplicate = await prismadb.size.findMany({
      where: {
        storeId: process.env.STORE_ID,
        value,
      },
    });

    if (isDuplicate.length) {
      return new NextResponse(
        "This size value already exists and is being used",
        {
          status: 400,
        }
      );
    }

    const size = await prismadb.size.create({
      data: {
        storeId: process.env.STORE_ID,
        name,
        value,
        department,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZES_POST]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department") || undefined;

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: process.env.STORE_ID,
        department,
      },
    });

    const response = NextResponse.json(sizes);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[SIZES_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
