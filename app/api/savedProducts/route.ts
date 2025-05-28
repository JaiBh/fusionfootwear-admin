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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId } = body;

    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    if (!process.env.STORE_ID) {
      return new NextResponse("Internal error, unable to identity store id", {
        status: 500,
      });
    }

    const isValidProduct = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!isValidProduct) {
      return new NextResponse(
        "The product linked to the product Id does not exist"
      );
    }

    const savedProduct = await prismadb.savedProduct.create({
      data: {
        storeId: process.env.STORE_ID,
        productId,
        userId,
      },
    });

    const response = NextResponse.json(savedProduct);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[SAVEDPRODUCTS_POST]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    const savedProducts = await prismadb.savedProduct.findMany({
      where: {
        storeId: process.env.STORE_ID,
        userId,
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });

    const response = NextResponse.json(savedProducts);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[SAVEDPRODUCTS_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
