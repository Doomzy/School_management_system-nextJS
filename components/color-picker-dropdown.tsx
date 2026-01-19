import { subjectColors } from "@/lib/constants";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function ColorPickerDropdown({
  value,
  onChange,
  label = "Color",
}: {
  value: string | undefined;
  onChange: (color: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedColor = subjectColors.find((c) => c.hex === value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              {selectedColor ? (
                <>
                  <div
                    className="w-4 h-4 rounded-sm border"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span>{selectedColor.name}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Select a color...</span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="grid grid-cols-6 gap-2">
            {subjectColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => {
                  onChange(color.hex);
                  setOpen(false);
                }}
                className="relative w-9 h-9 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{
                  backgroundColor: color.hex,
                  borderColor: value === color.hex ? "#000" : "transparent",
                }}
                title={color.name}
              >
                {value === color.hex && (
                  <Check
                    className="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow-md"
                    strokeWidth={3}
                  />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
