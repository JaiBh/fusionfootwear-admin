import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    let isPaid: string | null | boolean | undefined =
      searchParams.get("isPaid");

    if (!userId) {
      return new NextResponse("User Id is required", { status: 400 });
    }

    if (isPaid === "true") {
      isPaid = true;
    } else if (isPaid === "false") {
      isPaid = false;
    } else {
      isPaid = undefined;
    }

    const orders = await prismadb.order.findMany({
      where: {
        userId,
        isPaid,
      },
      include: {
        orderItems: true,
      },
    });

    const response = NextResponse.json(orders);

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
