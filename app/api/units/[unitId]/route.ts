import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;
    const { userId } = await auth();

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 401,
      });
    }

    const unit = await prismadb.unit.delete({
      where: {
        id: unitId,
      },
    });

    const referer = req.headers.get("referer");
    if (!referer) {
      revalidatePath("/units");
    } else if (referer.slice(referer.length - 5, referer.length) === "units") {
      revalidatePath("/units");
    }

    return NextResponse.json(unit);
  } catch (error) {
    console.log(`[UNIT_DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;
    const { userId } = await auth();
    const body = await req.json();
    const { productId, sizeId, isArchived } = body;

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 401,
      });
    }

    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }

    const unit = await prismadb.unit.update({
      where: {
        id: unitId,
      },
      data: {
        productId,
        sizeId,
        isArchived,
      },
    });

    return NextResponse.json(unit);
  } catch (error) {
    console.log(`[UNIT_PATCH]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
