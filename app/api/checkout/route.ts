import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const { unitIds, price, userId, userName, shippingPrice, shippingOption } =
    await req.json();

  if (!unitIds || unitIds === 0) {
    return new NextResponse("Unit ids are required", { status: 400 });
  }
  if (!price) {
    return new NextResponse("A price for the order is required", {
      status: 400,
    });
  }
  if (!shippingPrice) {
    return new NextResponse("Shipping price for the order is required", {
      status: 400,
    });
  }
  if (!process.env.STORE_ID) {
    return new NextResponse("Internal error, unable to identity store id", {
      status: 500,
    });
  }

  const units = await prismadb.unit.findMany({
    where: {
      id: {
        in: unitIds,
      },
    },
    include: {
      product: {
        include: {
          color: true,
          images: true,
        },
      },
      size: true,
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  units.forEach((unit) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: unit.product.name,
        },
        unit_amount: unit.product.price.toNumber() * 100,
      },
    });
  });
  line_items.push({
    quantity: 1,
    price_data: {
      currency: "USD",
      product_data: {
        name: "Shipping",
      },
      unit_amount: Number(shippingPrice) * 100,
    },
  });

  const order = await prismadb.order.create({
    data: {
      storeId: process.env.STORE_ID,
      price: Number(price),
      shippingPrice: Number(shippingPrice),
      shippingOption,
      isPaid: false,
      status: "processing",
      userId,
      userName,
      orderItems: {
        create: units.map((unit) => {
          const { productId, sizeId, product, size, id: unitId } = unit;
          const { colorId, color, price, name, images } = product;
          const { name: colorName } = color;
          const { name: sizeName } = size;
          return {
            productId,
            unitId,
            sizeId,
            colorId,
            name,
            colorName,
            sizeName,
            price,
            imageUrl: images[0].url,
          };
        }),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
