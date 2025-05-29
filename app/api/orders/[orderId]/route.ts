import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const { userId } = await auth();

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 401,
      });
    }

    const order = await prismadb.order.delete({
      where: {
        id: orderId,
      },
    });

    const referer = req.headers.get("referer");
    if (!referer) {
      revalidatePath("/orders");
    } else if (referer.slice(referer.length - 6, referer.length) === "orders") {
      revalidatePath("/orders");
    }

    return NextResponse.json(order);
  } catch (error) {
    console.log(`[ORDER_DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
