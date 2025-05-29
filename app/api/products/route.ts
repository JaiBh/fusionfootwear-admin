import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const {
      name,
      price,
      desc,
      department,
      productLineId,
      categoryId,
      colorId,
      isFeatured,
      isArchived,
      images,
    } = body;
    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 400,
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
    if (!department) {
      return new NextResponse("Department is required", {
        status: 400,
      });
    }
    if (!productLineId) {
      return new NextResponse("ProductLineId is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("ColorId is required", { status: 400 });
    }
    if (!images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }
    if (!process.env.STORE_ID) {
      return new NextResponse("Internal error, unable to identity store id", {
        status: 500,
      });
    }

    const isDuplicate = await prismadb.product.findMany({
      where: {
        storeId: process.env.STORE_ID,
        name,
        department,
        colorId,
      },
    });

    if (isDuplicate.length) {
      return new NextResponse(
        "This product name, color and department combination already exists.",
        {
          status: 400,
        }
      );
    }

    const product = await prismadb.product.create({
      data: {
        storeId: process.env.STORE_ID,
        name,
        department,
        desc,
        productLineId,
        price,
        categoryId,
        colorId,
        isFeatured,
        isArchived,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`[PRODUCTS_POST]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const department = searchParams.get("department") || undefined;
    let isFeatured: string | null | boolean | undefined =
      searchParams.get("isFeatured");
    let isArchived: string | null | boolean | undefined =
      searchParams.get("isArchived");

    if (isFeatured === "true") {
      isFeatured = true;
    } else if (isFeatured === "false") {
      isFeatured = false;
    } else {
      isFeatured = undefined;
    }

    if (isArchived === "true") {
      isArchived = true;
    } else if (isArchived === "false") {
      isArchived = false;
    } else {
      isArchived = undefined;
    }
    if (
      department !== "Male" &&
      department !== "Female" &&
      department !== undefined
    ) {
      return new NextResponse("Invalid department", {
        status: 400,
      });
    }
    const products = await prismadb.product.findMany({
      where: {
        OR: [
          {
            storeId: process.env.STORE_ID,
            department: "Unisex",
            colorId,
            categoryId,
            isArchived,
            isFeatured,
          },
          {
            storeId: process.env.STORE_ID,
            department: department,
            colorId,
            categoryId,
            isArchived,
            isFeatured,
          },
        ],
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

    const response = NextResponse.json(products);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[PRODUCTS_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
