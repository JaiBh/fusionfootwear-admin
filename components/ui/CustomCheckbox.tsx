"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface CustomCheckboxProps {
  value: boolean;
  label: string;
  text?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function CustomCheckbox({
  value,
  label,
  text,
  onChange,
  disabled,
}: CustomCheckboxProps) {
  return (
    <div className="items-top flex space-x-2 p-4 border">
      <Checkbox
        id="terms1"
        disabled={disabled}
        onClick={() => onChange((!value).toString())}
        checked={value}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
