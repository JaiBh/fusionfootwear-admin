import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Size } from "@prisma/client";

interface SizeSelectProps {
  onChange: (value: string) => void;
  value: string;
  sizes: Size[];
}

function SizeSelect({ value, onChange, sizes }: SizeSelectProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger value={value} aria-labelledby="sizeLabel">
        <SelectValue placeholder="Select a size" />
      </SelectTrigger>
      <SelectContent>
        {sizes
          .sort((a, b) => Number(a.value) - Number(b.value))
          .map((size) => {
            return (
              <SelectItem key={size.id} value={size.id}>
                {size.name}
              </SelectItem>
            );
          })}
      </SelectContent>
    </Select>
  );
}
export default SizeSelect;
