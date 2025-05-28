"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductsOutStockCardProps {
  productsOutOfStock: number;
}

function ProductsOutStockCard({
  productsOutOfStock,
}: ProductsOutStockCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Products Out of Stock</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl font-bold text-red-500">
          {productsOutOfStock.toLocaleString()}
        </h1>
      </CardContent>
    </Card>
  );
}
export default ProductsOutStockCard;
