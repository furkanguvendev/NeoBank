import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
};

export const Field = ({ label, htmlFor, error, children }: FieldProps) => (
  <div className="w-full flex flex-col gap-1">
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {label}
    </label>
    {children}
    {error && (
      <span role="alert" className="field-error">
        {error}
      </span>
    )}
  </div>
);