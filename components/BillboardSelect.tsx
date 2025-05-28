import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Billboard } from "@prisma/client";

interface BillboardSelectProps {
  onChange: (value: string) => void;
  value: string;
  billboards: Billboard[];
}

function BillboardSelect({
  value,
  onChange,
  billboards,
}: BillboardSelectProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger value={value}>
        <SelectValue placeholder="Select a billboard" />
      </SelectTrigger>
      <SelectContent>
        {billboards.map((billboard) => {
          return (
            <SelectItem key={billboard.id} value={billboard.id}>
              {billboard.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
export default BillboardSelect;
