"use client";

export function OutputFormatPicker({
  formats,
  value,
  onChange,
  label = "Convert to",
}: {
  formats: string[];
  value: string;
  onChange: (fmt: string) => void;
  label?: string;
}) {
  if (!formats.length) return null;
  return (
    <fieldset className="output-format-picker">
      <legend>{label}</legend>
      <div className="output-format-chips" role="listbox" aria-label={label}>
        {formats.map((fmt) => (
          <button
            key={fmt}
            type="button"
            role="option"
            aria-selected={value === fmt}
            className={`output-format-chip ${value === fmt ? "output-format-chip--active" : ""}`}
            onClick={() => onChange(fmt)}
          >
            {fmt}
          </button>
        ))}
      </div>
      <select
        className="output-format-select"
        aria-label={`${label} (compact)`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {formats.map((fmt) => (
          <option key={fmt} value={fmt}>
            {fmt}
          </option>
        ))}
      </select>
    </fieldset>
  );
}