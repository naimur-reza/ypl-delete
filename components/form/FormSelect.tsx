import { FormBase, FormControlProps } from "./FormBase";
import { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFieldContext } from "@/hooks/use-field-context";

export function FormSelect({
  children,
  disabled,
  onValueChange,
  ...props
}: FormControlProps & { children: ReactNode; disabled?: boolean; onValueChange?: (value: string) => void }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Select
        disabled={disabled}
        onValueChange={(e) => {
          field.handleChange(e);
          onValueChange?.(e);
        }}
        value={field.state.value}
      >
        <SelectTrigger
          className="border border-gray-200"
          aria-invalid={isInvalid}
          id={field.name}
          onBlur={field.handleBlur}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent   className="border border-gray-200">{children}</SelectContent>
      </Select>
    </FormBase>
  );
}
