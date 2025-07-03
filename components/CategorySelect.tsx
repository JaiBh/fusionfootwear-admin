import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@prisma/client";

interface CategorySelectProps {
  onChange: (value: string) => void;
  value: string;
  categories: Category[];
  disabled?: boolean;
}

function CategorySelect({
  value,
  onChange,
  categories,
  disabled,
}: CategorySelectProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger value={value} aria-labelledby="categoryLabel">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => {
          return (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
export default CategorySelect;
