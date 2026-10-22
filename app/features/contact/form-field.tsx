interface FormFieldProps {
  name: string;
  label: string;
  type?: "text" | "email";
  isMultiline?: boolean;
  isRequired?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
  maxLength: number;
  minLength?: number;
}

/** Labelled input with an inline error wired up through `aria-describedby`. */
export function FormField({
  name,
  label,
  type = "text",
  isMultiline = false,
  isRequired = false,
  autoComplete,
  defaultValue,
  error,
  maxLength,
  minLength,
}: FormFieldProps) {
  const fieldId = `contact-${name}`;
  const errorId = `${fieldId}-error`;
  const sharedProps = {
    id: fieldId,
    name,
    required: isRequired,
    defaultValue,
    maxLength,
    minLength,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className:
      "w-full rounded-control border border-border bg-surface px-4 py-3 text-text placeholder:text-text-faint focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-[#ff8a7a]",
  };
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="type-label text-text-muted">
        {label}
        {isRequired ? null : <span className="normal-case tracking-normal"> (optional)</span>}
      </label>
      {isMultiline ? (
        <textarea {...sharedProps} rows={5} />
      ) : (
        <input {...sharedProps} type={type} autoComplete={autoComplete} />
      )}
      {error ? (
        <p id={errorId} className="text-sm text-[#ff8a7a]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
