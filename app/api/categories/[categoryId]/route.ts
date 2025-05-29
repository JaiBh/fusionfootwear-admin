import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    const { userId } = await auth();

    if (!userId || !isAdmin(userId)) {
      return new NextResponse("Unauthenticated, must be admin", {
        status: 401,
      });
    }

    const category = await prismadb.category.delete({
      where: {
        id: categoryId,
      },
    });

    const referer = req.headers.get("referer");
    if (!referer) {
      revalidatePath("/categories");
    } else if (
      referer.slice(referer.length - 10, referer.length) === "categories"
    ) {
      revalidatePath("/categories");
    }

    return NextResponse.json(category);
  } catch (error) {
    console.log(`[CATEGORY_DELETE]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
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
      return new NextResponse("name is required", { status: 400 });
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

    const category = await prismadb.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardMaleId: billboardMaleId || null,
        billboardFemaleId: billboardFemaleId || null,
        department,
        isArchived,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(`[CATEGORY_PATCH]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    let isArchived: string | boolean | null | undefined =
      searchParams.get("isArchived");

    const { categoryId } = await params;
    if (!categoryId) {
      return new NextResponse("CategoryId is required.", {
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

    const category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
        isArchived,
      },
      include: {
        billboardFemale: true,
        billboardMale: true,
      },
    });

    const response = NextResponse.json(category);

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.log(`[CATEGORY_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
