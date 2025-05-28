import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { isAdmin } from "@/lib/utils";

export async function POST(req: Request) {
  try {
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
    if (!process.env.STORE_ID) {
      return new NextResponse("Internal error, unable to identity store id", {
        status: 500,
      });
    }

    const duplicate = await prismadb.productLine.findMany({
      where: {
        storeId: process.env.STORE_ID,
        name,
      },
    });

    if (duplicate[0]) {
      return new NextResponse("Name already taken", {
        status: 400,
      });
    }
    const productLine = await prismadb.productLine.create({
      data: {
        storeId: process.env.STORE_ID,
        name,
        categoryId,
        department,
        isArchived,
      },
    });

    return NextResponse.json(productLine);
  } catch (error) {
    console.log(`[PRODUCTLINES_POST]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const productLines = await prismadb.productLine.findMany({
      where: {
        storeId: process.env.STORE_ID,
      },
      include: {
        products: true,
      },
    });
    return NextResponse.json(productLines);
  } catch (error) {
    console.log(`[PRODUCTLINES_GET]`, error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
