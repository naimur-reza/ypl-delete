import { FormBase, FormControlProps } from "./FormBase";
import { useFieldContext } from "@/hooks/use-field-context";
import { Checkbox } from "../ui/checkbox";
import { Loader2 } from "lucide-react";

export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface FormCheckboxGroupProps extends FormControlProps {
  options: CheckboxOption[];
  isLoading?: boolean;
  columns?: 1 | 2 | 3;
}

export function FormCheckboxGroup({
  options,
  isLoading = false,
  columns = 2,
  ...props
}: FormCheckboxGroupProps) {
  const field = useFieldContext<string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <FormBase {...props}>
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-gray-600">Loading options...</span>
        </div>
      ) : options.length === 0 ? (
        <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-600">
          No options available.
        </div>
      ) : (
        <div
          className={`grid ${gridColsClass[columns]} gap-3 p-4 bg-gray-50 rounded-md`}
          role="group"
          aria-invalid={isInvalid}
        >
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
            >
              <Checkbox
                checked={
                  (field.state.value || []).includes(option.value) || false
                }
                onCheckedChange={(checked) => {
                  const currentValues = field.state.value || [];
                  if (checked) {
                    field.handleChange([...currentValues, option.value]);
                  } else {
                    field.handleChange(
                      currentValues.filter((id: string) => id !== option.value),
                    );
                  }
                }}
                onBlur={field.handleBlur}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">
                  {option.label}
                </p>
                {option.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
      )}
    </FormBase>
  );
}
