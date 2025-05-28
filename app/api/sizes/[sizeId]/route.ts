import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ sizeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { sizeId } = await params;

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!sizeId) {
      return new NextResponse("SizeId is required", { status: 400 });
    }

    const size = await prismadb.size.delete({
      where: {
        id: sizeId,
      },
    });

    const referer = req.headers.get("referer");
    if (!referer) {
      revalidatePath("/sizes");
    } else if (referer.slice(referer.length - 5, referer.length) === "sizes") {
      revalidatePath("/sizes");
    }

    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE_DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ sizeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value, department } = body;

    const { sizeId } = await params;

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Size value is required", { status: 400 });
    }
    if (!department) {
      return new NextResponse("Department is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("SizeId is required", { status: 400 });
    }

    const isDuplicate = await prismadb.size.findMany({
      where: {
        storeId: process.env.STORE_ID,
        value,
      },
    });

    if (isDuplicate.length && isDuplicate[0].id !== sizeId) {
      return new NextResponse(
        "This size value already exists and is being used.",
        {
          status: 400,
        }
      );
    }

    const size = await prismadb.size.update({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
        department,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`[SIZE_PATCH]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sizeId: string }> }
) {
  try {
    const { sizeId } = await params;
    if (!sizeId) {
      return new NextResponse("SizeId is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        storeId: process.env.STORE_ID,
        id: sizeId,
      },
    });

    const response = NextResponse.json(size);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[SIZE_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
