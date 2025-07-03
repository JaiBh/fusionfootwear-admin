import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Color } from "@prisma/client";

interface ColorSelectProps {
  onChange: (value: string) => void;
  value: string;
  colors: Color[];
}

function ColorSelect({ value, onChange, colors }: ColorSelectProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger value={value} aria-labelledby="colorLabel">
        <SelectValue placeholder="Select a color" />
      </SelectTrigger>
      <SelectContent>
        {colors.map((color) => {
          return (
            <SelectItem key={color.id} value={color.id}>
              <div className="flex items-center gap-2">
                {color.name}
                <span
                  className="size-2 rounded-[50%]"
                  style={{ background: color.value }}
                ></span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
export default ColorSelect;
