import { useFieldContext } from "@/hooks/use-field-context";
import { Input } from "../ui/input";
import { FormBase, FormControlProps } from "./FormBase";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function FormInput(
  props: FormControlProps &
    Omit<
      ComponentProps<typeof Input>,
      "id" | "name" | "value" | "onBlur" | "onChange" | "aria-invalid"
    > & {
      /** Maximum character limit for the input */
      maxLength?: number;
      /** Show character counter */
      showCharCount?: boolean;
      /** Recommended character limit (shows warning when exceeded) */
      recommendedLength?: number;
    }
) {
  const field = useFieldContext<string | number | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const { 
    label, 
    description, 
    type, 
    maxLength,
    showCharCount,
    recommendedLength,
    ...inputProps 
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (type === "number") {
      field.handleChange(val ? parseInt(val, 10) : null);
    } else {
      field.handleChange(val);
    }
  };

  const value =
    type === "number"
      ? field.state.value?.toString() ?? ""
      : field.state.value ?? "";

  const charCount = value.toString().length;
  const isOverRecommended = recommendedLength ? charCount > recommendedLength : false;
  const isNearMax = maxLength ? charCount >= maxLength * 0.9 : false;

  return (
    <FormBase label={label} description={description}>
      <div className="space-y-1">
        <Input
          className="border border-gray-200"
          id={field.name}
          name={field.name}
          type={type}
          value={value}
          onBlur={field.handleBlur}
          onChange={handleChange}
          aria-invalid={isInvalid}
          maxLength={maxLength}
          {...inputProps}
        />
        {showCharCount && (
          <div className="flex justify-end">
            <span
              className={cn(
                "text-xs transition-colors",
                isNearMax || isOverRecommended
                  ? "text-orange-600 font-medium"
                  : "text-gray-500"
              )}
            >
              {charCount}
              {maxLength && ` / ${maxLength}`}
              {recommendedLength && !maxLength && (
                <span className={cn("ml-1", isOverRecommended && "text-orange-600")}>
                  (recommended: {recommendedLength})
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </FormBase>
  );
}

