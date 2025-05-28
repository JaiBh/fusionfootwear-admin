import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

    const { productId } = await params;

    if (!productId) {
      return new NextResponse("productId is required", {
        status: 401,
      });
    }
    if (!userId) {
      return new NextResponse("userId is required", {
        status: 402,
      });
    }
    const savedProduct = await prismadb.savedProduct.deleteMany({
      where: {
        productId: productId,
        userId,
      },
    });

    const response = NextResponse.json(savedProduct);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, OPTIONS, DELETE"
    );
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[SAVEDPRODUCT_DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const { productId } = await params;

    if (!productId) {
      return new NextResponse("productId is required", {
        status: 401,
      });
    }
    if (!userId) {
      return new NextResponse("userId is required", {
        status: 402,
      });
    }

    const savedProduct = await prismadb.savedProduct.findMany({
      where: {
        storeId: process.env.STORE_ID,
        userId,
        productId,
      },
    });

    const response = NextResponse.json(savedProduct);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[SAVEDPRODUCT_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
