import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productLineId: string }> }
) {
  try {
    const { productLineId } = await params;
    const { userId } = await auth();

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const productLines = await prismadb.productLine.delete({
      where: {
        id: productLineId,
      },
    });

    const referer = req.headers.get("referer");
    if (!referer) {
      revalidatePath("/productLines");
    } else if (
      referer.slice(referer.length - 12, referer.length) === "productLines"
    ) {
      revalidatePath("/productLines");
    }

    return NextResponse.json(productLines);
  } catch (error) {
    console.log(`[PRODUCTLINE_DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productLineId: string }> }
) {
  try {
    const { productLineId } = await params;
    const { userId } = await auth();
    const body = await req.json();
    const { name, categoryId, department, isArchived } = body;

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!department) {
      return new NextResponse("Department is required", {
        status: 400,
      });
    }
    if (!categoryId) {
      return new NextResponse("categoryId is required", {
        status: 400,
      });
    }

    const productLine = await prismadb.productLine.update({
      where: {
        id: productLineId,
      },
      data: {
        name,
        categoryId,
        department,
        isArchived,
      },
    });

    return NextResponse.json(productLine);
  } catch (error) {
    console.log(`[PRODUCTLINE_PATCH]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productLineId: string }> }
) {
  try {
    const { productLineId } = await params;
    if (!productLineId) {
      return new NextResponse("ProductLineId is required.", {
        status: 400,
      });
    }

    const productLine = await prismadb.productLine.findUnique({
      where: {
        id: productLineId,
      },
      include: {
        products: {
          include: {
            images: true,
            color: true,
            units: true,
          },
        },
      },
    });

    const response = NextResponse.json(productLine);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[PRODUCTLINE_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
