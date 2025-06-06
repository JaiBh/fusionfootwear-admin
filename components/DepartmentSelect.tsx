import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepartmentSelectProps {
  options?: string[] | undefined;
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
}

function DepartmentSelect({
  value,
  onChange,
  options,
  disabled,
}: DepartmentSelectProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger value={value}>
        <SelectValue placeholder="Select a department" />
      </SelectTrigger>
      <SelectContent>
        {options?.length &&
          options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        {!options && (
          <>
            <SelectItem value={"mens"}>Men's</SelectItem>
            <SelectItem value={"womens"}>Women's</SelectItem>
            <SelectItem value={"unisex"}>Unisex</SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
export default DepartmentSelect;
