import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Color, Product } from "@prisma/client";

interface ProductSelectProps {
  onChange: (value: string) => void;
  value: string;
  products: (Omit<Product, "price"> & {
    color: Color;
    price: number;
  })[];
  disabled?: boolean;
}

function ProductSelect({
  value,
  onChange,
  products,
  disabled,
}: ProductSelectProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger value={value}>
        <SelectValue placeholder="Select a product" />
      </SelectTrigger>
      <SelectContent>
        {products.map((product) => {
          return (
            <SelectItem key={product.id} value={product.id}>
              <div className="flex items-center gap-2">
                <span>{product.name}</span>
                <span
                  className="size-2 rounded-[50%]"
                  style={{ background: product.color.value }}
                ></span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
export default ProductSelect;
