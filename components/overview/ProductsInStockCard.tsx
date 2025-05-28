"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductsInStockCardProps {
  productsInStock: number;
}

function ProductsInStockCard({ productsInStock }: ProductsInStockCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Products In Stock</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl font-bold text-green-500">
          {productsInStock.toLocaleString()}
        </h1>
      </CardContent>
    </Card>
  );
}
export default ProductsInStockCard;
