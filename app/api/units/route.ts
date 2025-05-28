import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { sizeId, productId, isArchived } = body;

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }
    if (!process.env.STORE_ID) {
      return new NextResponse("Internal error, unable to identity store id", {
        status: 500,
      });
    }

    const unit = await prismadb.unit.create({
      data: {
        storeId: process.env.STORE_ID,
        productId,
        sizeId,
        isArchived,
      },
    });

    return NextResponse.json(unit);
  } catch (error) {
    console.log(`[UNITS_POST]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const sizeId = searchParams.get("sizeId") || undefined;
    let isArchived: string | boolean | null | undefined =
      searchParams.get("isArchived");

    if (isArchived === "true") {
      isArchived = true;
    } else if (isArchived === "false") {
      isArchived = false;
    } else {
      isArchived = undefined;
    }

    if (!productId) {
      return new NextResponse("ProductId is required.", {
        status: 400,
      });
    }

    const units = await prismadb.unit.findMany({
      where: {
        productId,
        isArchived,
        sizeId,
      },
      include: {
        size: true,
      },
    });

    const response = NextResponse.json(units);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[UNITS_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
