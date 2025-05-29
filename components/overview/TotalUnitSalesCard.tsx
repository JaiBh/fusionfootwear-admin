"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Order, OrderItem } from "@prisma/client";

interface TotalUnitSalesCardProps {
  orders: (Omit<Order, "price" | "shippingPrice"> & {
    orderItems: (Omit<OrderItem, "price"> & { price: number })[];
    price: number;
    shippingPrice: number;
  })[];
}

function TotalUnitSalesCard({ orders }: TotalUnitSalesCardProps) {
  const [timeFrame, setTimeFrame] = useState<
    "30-days" | "3-months" | "6-months" | "1-year" | "all-time"
  >("30-days");
  const [totalUnitSales, setTotalUnitSales] = useState(0);

  useEffect(() => {
    const now = new Date();

    let filteredOrders = orders;

    if (timeFrame === "30-days") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 30);
      filteredOrders = orders.filter(
        (order) => new Date(order.createdAt) >= cutoff
      );
    }
    if (timeFrame === "3-months") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 91);
      filteredOrders = orders.filter(
        (order) => new Date(order.createdAt) >= cutoff
      );
    }

    if (timeFrame === "6-months") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 183);
      filteredOrders = orders.filter(
        (order) => new Date(order.createdAt) >= cutoff
      );
    }

    if (timeFrame === "1-year") {
      const cutoff = new Date();
      cutoff.setDate(now.getDate() - 365);
      filteredOrders = orders.filter(
        (order) => new Date(order.createdAt) >= cutoff
      );
    }

    const units = filteredOrders.reduce((acc, curr) => {
      return (acc += curr.orderItems.length);
    }, 0);

    setTotalUnitSales(units);
  }, [timeFrame, orders]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Units Sold</CardTitle>
          <Select
            onValueChange={(
              value: "30-days" | "3-months" | "6-months" | "1-year" | "all-time"
            ) => setTimeFrame(value)}
          >
            <SelectTrigger className="w-[110px] capitalize">
              {timeFrame}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30-days">30-Days</SelectItem>
              <SelectItem value="3-months">3-Months</SelectItem>
              <SelectItem value="6-months">6-Months</SelectItem>
              <SelectItem value="1-year">1-Year</SelectItem>
              <SelectItem value="all-time">All-Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl font-bold">
          {totalUnitSales.toLocaleString()}
        </h1>
      </CardContent>
    </Card>
  );
}
export default TotalUnitSalesCard;
