import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  try {
    const { billboardId } = await params;
    const { userId } = await auth();
    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 401,
      });
    }

    const billboard = await prismadb.billboard.delete({
      where: {
        id: billboardId,
      },
    });

    const referer = req.headers.get("referer");
    if (!referer) {
      revalidatePath("/billboards");
    } else if (
      referer.slice(referer.length - 10, referer.length) === "billboards"
    ) {
      revalidatePath("/billboards");
    }

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD_DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  try {
    const { billboardId } = await params;
    const { userId } = await auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 401,
      });
    }

    if (!label) {
      return new NextResponse("label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("image url is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.update({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`[BILLBOARD_PATCH]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
