"use client";

import { Separator } from "@/components/ui/separator";
import { Order, OrderItem } from "@prisma/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface FormattedOrderItem extends OrderItem {
  quantity: number;
}

interface OrderInfoProps {
  order: Order & {
    orderItems: OrderItem[];
  };
}

function OrderInfo({ order }: OrderInfoProps) {
  const date = format(order.createdAt, "MMMM do, yyyy");
  const formattedOrderItems: FormattedOrderItem[] = order.orderItems.reduce(
    (acc: FormattedOrderItem[], curr) => {
      if (
        acc.some(
          (item) =>
            item.productId === curr.productId && item.sizeId === curr.sizeId
        )
      ) {
        return acc.map((item) => {
          if (
            item.productId === curr.productId &&
            item.sizeId === curr.sizeId
          ) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      }
      return [...acc, { ...curr, quantity: 1 }];
    },
    []
  );

  const onCopyUserId = () => {
    if (order.userId) {
      navigator.clipboard.writeText(order.userId);
      toast.success("User Id copied to clipboard.");
    }
  };
  return (
    <>
      <div className="md:flex">
        <h1 className="mt-6 text-lg md:text-xl font-bold text-wrap">
          Order Creation :{" "}
          <span className="text-base font-normal">{order.id}</span>
        </h1>
      </div>
      <Separator className="my-4"></Separator>
      <div className="grid grid-cols-2 grid-rows-5 md:grid-rows-2 md:grid-cols-4 gap-4 bg-secondary p-2">
        <div className="space-y-2 bg-card p-2">
          <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Order Date
          </h4>
          <p className="text-sm md:text-base">{date}</p>
        </div>
        <div className="space-y-2 bg-card p-2">
          <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Total Price
          </h4>
          <p className="text-sm md:text-base">
            ${Number(order.price).toFixed(2)}
          </p>
        </div>
        <div className="space-y-2 bg-card p-2">
          <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Items Price
          </h4>
          <p className="text-sm md:text-base">
            $
            {order.orderItems.reduce((acc, curr) => {
              return (acc += Number(curr.price));
            }, 0)}
          </p>
        </div>
        <div className="space-y-2 bg-card p-2">
          <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Shipping Fee
          </h4>
          <p className="text-sm md:text-base">
            ${Number(order.shippingPrice).toFixed(2)}
          </p>
        </div>
        <div className="space-y-2 bg-card p-2">
          <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Shipping Option
          </h4>
          <p className="text-sm md:text-base capitalize">
            {order.shippingOption}
          </p>
        </div>
        <div className="space-y-2 bg-card p-2">
          <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Paid
          </h4>
          <Badge
            variant={order.isPaid ? "default" : "outline"}
            className="cursor-pointer"
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </Badge>
        </div>
        <div className="space-y-2 bg-card p-2">
          <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            User
          </h4>
          {order.userId ? (
            <Badge className="cursor-pointer" onClick={onCopyUserId}>
              {order.userName ? order.userName : "User"}
            </Badge>
          ) : (
            <p className="text-sm md:text-base">Guest</p>
          )}
        </div>
        <div className="space-y-2 bg-card p-2">
          <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Address
          </h4>
          <ScrollArea className="w-full pb-2">
            <p className="text-sm md:text-base text-nowrap">
              {order.address || "n/a"}
            </p>
            <ScrollBar orientation="horizontal"></ScrollBar>
          </ScrollArea>
        </div>
        <div className="space-y-2 bg-card p-2">
          <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Phone No.
          </h4>
          <ScrollArea className="w-full pb-2">
            <p className="text-sm md:text-base text-nowrap">
              {order.phone || "n/a"}
            </p>
            <ScrollBar orientation="horizontal"></ScrollBar>
          </ScrollArea>
        </div>
      </div>
      <div className="mt-6 bg-secondary p-4 space-y-4 mx-auto max-w-[720px]">
        <h2 className="md:text-lg font-bold">Products</h2>
        <ul className="space-y-2">
          {formattedOrderItems.map((orderItem) => {
            return (
              <li
                key={orderItem.id}
                className="bg-card flex items-center justify-between py-2 px-4"
              >
                <div className="flex space-x-4 items-center">
                  <div className="aspect-square relative h-20">
                    <Link href={`/products/${orderItem.productId}`}>
                      {orderItem.imageUrl ? (
                        <Image
                          src={orderItem.imageUrl}
                          priority
                          fill
                          alt={orderItem.name}
                          className="rounded-lg object-cover"
                        ></Image>
                      ) : (
                        <div className="h-full w-full flex text-center items-center bg-gray-300 text-xs">
                          No Image Available
                        </div>
                      )}
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold">{orderItem.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Size : {orderItem.sizeName}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">
                    ${(Number(orderItem.price) * orderItem.quantity).toFixed(2)}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    quantity : {orderItem.quantity}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
export default OrderInfo;
