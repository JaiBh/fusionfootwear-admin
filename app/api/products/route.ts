import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";
import { stemmer } from "porter-stemmer";

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
    const paginate = searchParams.get("paginate");
    const take = searchParams.get("take") || "10";
    const cursor = searchParams.get("cursor");
    const categoryId = searchParams.get("categoryId") || undefined;
    const department = searchParams.get("department") || undefined;
    const colorIds = searchParams.getAll("colorIds");
    const sizeIds = searchParams.getAll("sizeIds");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy");
    const searchTerm = searchParams.get("searchTerm") ?? "";
    const stemmed = stemmer(searchTerm);

    let isFeatured: string | null | boolean | undefined =
      searchParams.get("isFeatured");
    let isArchived: string | null | boolean | undefined =
      searchParams.get("isArchived");
    let includeOutOfStock: string | null | boolean | undefined =
      searchParams.get("includeOutOfStock");

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

    if (includeOutOfStock === "true") {
      includeOutOfStock = true;
    } else {
      includeOutOfStock = false;
    }
    if (
      department !== "Male" &&
      department !== "Female" &&
      department !== "Unisex" &&
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
            department: department ? { in: ["Unisex", department] } : undefined,
            storeId: process.env.STORE_ID,
            name: searchTerm
              ? { contains: stemmed, mode: "insensitive" }
              : undefined,
            categoryId,
            isArchived,
            isFeatured,
            colorId: colorIds.length ? { in: colorIds } : undefined,
            price: {
              gte: minPrice ? minPrice : 0,
              lte: maxPrice ? maxPrice : 1000,
            },
            units:
              includeOutOfStock === false
                ? {
                    some: {
                      isArchived: false,
                      sizeId: sizeIds.length ? { in: sizeIds } : undefined,
                    },
                  }
                : undefined,
          },
          {
            department: department ? { in: ["Unisex", department] } : undefined,
            storeId: process.env.STORE_ID,
            categoryId,
            category: searchTerm
              ? { name: { contains: stemmed, mode: "insensitive" } }
              : undefined,
            isArchived,
            isFeatured,
            colorId: colorIds.length ? { in: colorIds } : undefined,
            price: {
              gte: minPrice ? minPrice : 0,
              lte: maxPrice ? maxPrice : 1000,
            },
            units:
              includeOutOfStock === false
                ? {
                    some: {
                      isArchived: false,
                      sizeId: sizeIds.length ? { in: sizeIds } : undefined,
                    },
                  }
                : undefined,
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
      take: paginate ? Number(take) : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      skip: paginate ? (cursor ? 1 : 0) : undefined,
      orderBy:
        sortBy === "a-z"
          ? [{ name: "asc" }, { id: "desc" }]
          : sortBy === "z-a"
          ? [{ name: "desc" }, { id: "desc" }]
          : sortBy === "price-high-to-low"
          ? [{ price: "desc" }, { id: "desc" }]
          : sortBy === "price-low-to-high"
          ? [{ price: "asc" }, { id: "desc" }]
          : { createdAt: "desc" },
    });

    const distinctColors = await prismadb.color.findMany({
      where: {
        products: {
          some: {
            department: department ? { in: ["Unisex", department] } : undefined,
            storeId: process.env.STORE_ID,
            categoryId,
            isArchived: false,
          },
        },
      },
    });

    const totalCount = await prismadb.product.count({
      where: {
        OR: [
          {
            department: department ? { in: ["Unisex", department] } : undefined,
            storeId: process.env.STORE_ID,
            name: searchTerm
              ? { contains: stemmed, mode: "insensitive" }
              : undefined,
            categoryId,
            isArchived,
            isFeatured,
            colorId: colorIds.length ? { in: colorIds } : undefined,
            price: {
              gte: minPrice ? minPrice : 0,
              lte: maxPrice ? maxPrice : 1000,
            },
            units:
              includeOutOfStock === false
                ? {
                    some: {
                      isArchived: false,
                      sizeId: sizeIds.length ? { in: sizeIds } : undefined,
                    },
                  }
                : undefined,
          },
          {
            department: department ? { in: ["Unisex", department] } : undefined,
            storeId: process.env.STORE_ID,
            categoryId,
            category: searchTerm
              ? { name: { contains: stemmed, mode: "insensitive" } }
              : undefined,
            isArchived,
            isFeatured,
            colorId: colorIds.length ? { in: colorIds } : undefined,
            price: {
              gte: minPrice ? minPrice : 0,
              lte: maxPrice ? maxPrice : 1000,
            },
            units:
              includeOutOfStock === false
                ? {
                    some: {
                      isArchived: false,
                      sizeId: sizeIds.length ? { in: sizeIds } : undefined,
                    },
                  }
                : undefined,
          },
        ],
      },
    });

    const response = NextResponse.json({
      products,
      distinctColors,
      totalCount,
      nextCursor:
        products.length === Number(take)
          ? products[products.length - 1].id
          : null,
    });

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
