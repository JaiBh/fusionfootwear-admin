import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, billboardMaleId, billboardFemaleId, department, isArchived } =
      body;
    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 401,
      });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (department === "Unisex") {
      if (!billboardMaleId || !billboardFemaleId) {
        return new NextResponse(
          "billboardMaleId and billboardFemaleId is required",
          {
            status: 400,
          }
        );
      }
    }
    if (department === "Male") {
      if (!billboardMaleId) {
        return new NextResponse("billboardMaleId is required", {
          status: 400,
        });
      }
    }
    if (department === "Female") {
      if (!billboardFemaleId) {
        return new NextResponse("billboardFemaleId is required", {
          status: 400,
        });
      }
    }

    if (!department) {
      return new NextResponse("Department is required", {
        status: 400,
      });
    }
    if (!process.env.STORE_ID) {
      return new NextResponse("Internal error, unable to identity store id", {
        status: 500,
      });
    }
    const category = await prismadb.category.create({
      data: {
        storeId: process.env.STORE_ID,
        name,
        billboardMaleId: billboardMaleId || undefined,
        billboardFemaleId: billboardFemaleId || undefined,
        department,
        isArchived,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(`[CATEGORIES_POST]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    let isArchived: boolean | string | null | undefined =
      searchParams.get("isArchived");

    if (department !== "Male" && department !== "Female") {
      return new NextResponse("Department must be Male or Female", {
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

    const categories = await prismadb.category.findMany({
      where: {
        OR: [
          { storeId: process.env.STORE_ID, department: "Unisex", isArchived },
          { storeId: process.env.STORE_ID, department: department, isArchived },
        ],
      },
      include: {
        products: true,
      },
    });

    const response = NextResponse.json(categories);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[CATEGORIES_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
