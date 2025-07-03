import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NumberSelectProps {
  onChange: (value: string) => void;
  value: number;
  min: number;
  max: number;
}

function NumberSelect({ value, onChange, min, max }: NumberSelectProps) {
  const numbersArray = Array.from({ length: max - min + 1 }, (_, i) => ({
    number: min + i,
  }));
  return (
    <Select onValueChange={onChange} value={value.toString()}>
      <SelectTrigger value={value} aria-labelledby="quantityLabel">
        <SelectValue placeholder="Select number of units" />
      </SelectTrigger>
      <SelectContent>
        {numbersArray.map((num, index) => (
          <SelectItem key={index} value={num.number.toString()}>
            {num.number}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export default NumberSelect;
