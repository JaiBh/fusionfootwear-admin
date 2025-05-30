import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH() {
  try {
    const orders = await prismadb.order.findMany({
      where: {
        storeId: process.env.STORE_ID,
      },
    });

    orders.forEach(async (order) => {
      const date = new Date();
      date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
      await prismadb.order.update({
        where: {
          id: order.id,
        },
        data: {
          createdAt: date,
        },
      });
    });

    const shiftDate = await prismadb.shiftDate.update({
      where: {
        id: "123",
      },
      data: {
        createdAt: new Date(),
      },
    });

    return NextResponse.json(shiftDate);
  } catch (error) {
    console.log(`[SHIFT_PATCH]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
