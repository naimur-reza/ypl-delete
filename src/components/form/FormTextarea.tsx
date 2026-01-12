import { useFieldContext } from "@/hooks/use-field-context";
import { Textarea } from "../ui/textarea";
import { FormBase, FormControlProps } from "./FormBase";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function FormTextarea(
  props: FormControlProps &
    Omit<
      ComponentProps<typeof Textarea>,
      "id" | "name" | "value" | "onBlur" | "onChange" | "aria-invalid"
    > & {
      /** Maximum character limit for the textarea */
      maxLength?: number;
      /** Show character counter */
      showCharCount?: boolean;
      /** Recommended character limit (shows warning when exceeded) */
      recommendedLength?: number;
    }
) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const { 
    label, 
    description, 
    maxLength,
    showCharCount,
    recommendedLength,
    ...textareaProps 
  } = props;

  const charCount = (field.state.value || "").length;
  const isOverRecommended = recommendedLength ? charCount > recommendedLength : false;
  const isNearMax = maxLength ? charCount >= maxLength * 0.9 : false;

  return (
    <FormBase label={label} description={description}>
      <div className="space-y-1">
        <Textarea
          className="border border-gray-200"
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          maxLength={maxLength}
          {...textareaProps}
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

