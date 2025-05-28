import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ colorId: string }> }
) {
  try {
    const { colorId } = await params;
    const { userId } = await auth();

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const color = await prismadb.color.delete({
      where: {
        id: colorId,
      },
    });

    const referer = req.headers.get("referer");
    if (!referer) {
      revalidatePath("/colors");
    } else if (referer.slice(referer.length - 6, referer.length) === "colors") {
      revalidatePath("/colors");
    }

    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLOR_DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ colorId: string }> }
) {
  try {
    const { colorId } = await params;
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Color value is required", { status: 400 });
    }

    const color = await prismadb.color.update({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(`[COLOR_PATCH]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
