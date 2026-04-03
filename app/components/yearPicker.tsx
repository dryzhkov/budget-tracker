import { Label } from "~/components/ui/label";

interface YearPickerProps {
  years: number[];
  onYearChange: (year: number) => void;
  defaultValue: number;
}

export function YearPicker({
  years,
  defaultValue,
  onYearChange,
}: YearPickerProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="years">Select a year</Label>
      <select
        id="years"
        defaultValue={defaultValue}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onChange={(e) => onYearChange(Number(e.target.value))}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
