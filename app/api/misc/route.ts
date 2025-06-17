import prismadb from "@/lib/prismadb";
import products from "@/Product_with_Keywords.json";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    products.map(async (product) => {
      await prismadb.product.update({
        where: {
          id: product.id,
        },
        data: {
          keywords: product.keywords,
        },
      });
    });

    const response = NextResponse.json(null);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[ORDERS_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
