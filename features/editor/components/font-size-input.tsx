import { Minus, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
  t: {
    decrease: string;
    increase: string;
    inputLabel: string;
  };
}

export const FontSizeInput = ({ value, onChange, t }: FontSizeInputProps) => {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange(value - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value <= 0 || !value) {
      onChange(0);
      return;
    }
    onChange(value);
  };

  return (
    <div className="flex items-center">
      <Button
        onClick={decrement}
        variant="outline"
        className="p-2 rounded-r-none border-r-0"
        size="icon"
        aria-label={t.decrease}
      >
        <Minus className="size-4" />
      </Button>
      <Input
        onChange={handleChange}
        value={value}
        aria-label={t.inputLabel}
        className="w-[50px] h-8 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none"
      />
      <Button
        onClick={increment}
        variant="outline"
        className="p-2 rounded-l-none border-l-0"
        size="icon"
        aria-label={t.increase}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
};
