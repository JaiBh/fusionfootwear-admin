import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { userId } = await auth();

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 401,
      });
    }

    const product = await prismadb.product.delete({
      where: {
        id: productId,
      },
    });

    const referer = req.headers.get("referer");
    if (!referer) {
      revalidatePath("/products");
    } else if (
      referer.slice(referer.length - 8, referer.length) === "products"
    ) {
      revalidatePath("/products");
    }

    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCT_DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { userId } = await auth();
    const body = await req.json();
    const {
      name,
      price,
      desc,
      categoryId,
      colorId,
      productLineId,
      isFeatured,
      isArchived,
      department,
      images,
    } = body;

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 401,
      });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!desc) {
      return new NextResponse("Description is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("CategoryId is required", { status: 400 });
    }
    if (!productLineId) {
      return new NextResponse("ProductLineId is required", { status: 400 });
    }
    if (!department) {
      return new NextResponse("Department is required", {
        status: 400,
      });
    }
    if (!colorId) {
      return new NextResponse("ColorId is required", { status: 400 });
    }
    if (!images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    const isDuplicate = await prismadb.product.findMany({
      where: {
        storeId: process.env.STORE_ID,
        name,
        department,
        colorId,
      },
    });

    if (isDuplicate && isDuplicate[0].id !== productId) {
      return new NextResponse(
        "This product name, color and department combination already exists.",
        {
          status: 400,
        }
      );
    }

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        desc,
        categoryId,
        department,
        productLineId,
        colorId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
        },
      },
    });

    if (isArchived) {
      await prismadb.unit.updateMany({
        where: {
          productId: productId,
        },
        data: {
          isArchived: true,
        },
      });
    }

    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCT_PATCH]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    let isArchived: string | boolean | null | undefined =
      searchParams.get("isArchived");

    const { productId } = await params;
    if (!productId) {
      return new NextResponse("ProductId is required.", {
        status: 400,
      });
    }

    if (isArchived === "true") {
      isArchived = true;
    } else if (isArchived === "false") {
      isArchived = false;
    } else {
      isArchived = undefined;
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
        isArchived,
      },
      include: {
        images: true,
        category: true,
        color: true,
        units: {
          include: {
            size: true,
          },
        },
      },
    });

    const response = NextResponse.json(product);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[PRODUCT_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
