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
    <>
      <label htmlFor="years" className="mb-2 text-md font-medium text-gray-900">
        Select a year:
      </label>
      <select
        id="years"
        defaultValue={defaultValue}
        className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={(e) => onYearChange(Number(e.target.value))}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </>
  );
}
