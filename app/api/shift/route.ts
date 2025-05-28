import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { daysPassed } = body;

    const orders = await prismadb.order.findMany({
      where: {
        storeId: process.env.STORE_ID,
      },
    });

    const updatedOrders = orders.map(async (order) => {
      const today = new Date().getDate();
      const orderDate = new Date(order.createdAt).getDate();
      if (today - orderDate >= daysPassed) {
        const newOrderDate = new Date();
        newOrderDate.setDate(orderDate + daysPassed);
        await prismadb.order.update({
          where: {
            id: order.id,
          },
          data: {
            createdAt: newOrderDate,
          },
        });
      }
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
