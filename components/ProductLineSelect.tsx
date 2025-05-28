import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, ProductLine } from "@prisma/client";

interface ProductLineSelectProps {
  onChange: (value: string) => void;
  value: string;
  productLines: (ProductLine & {
    category: Category;
  })[];
  disabled?: boolean;
}

function ProductLineSelect({
  value,
  onChange,
  productLines,
  disabled,
}: ProductLineSelectProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger value={value}>
        <SelectValue placeholder="Select a product line" />
      </SelectTrigger>
      <SelectContent>
        {productLines.map((productLine) => {
          return (
            <SelectItem key={productLine.id} value={productLine.id}>
              {productLine.name} -{" "}
              <span className="text-xs">{productLine.category.name}</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
export default ProductLineSelect;
