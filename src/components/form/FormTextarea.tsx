import { useFieldContext } from "@/hooks/use-field-context";
import { Textarea } from "../ui/textarea";
import { FormBase, FormControlProps } from "./FormBase";
import { ComponentProps } from "react";

export function FormTextarea(
  props: FormControlProps &
    Omit<
      ComponentProps<typeof Textarea>,
      "id" | "name" | "value" | "onBlur" | "onChange" | "aria-invalid"
    >
) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const { label, description, ...textareaProps } = props;

  return (
    <FormBase label={label} description={description}>
      <Textarea
      className="border border-gray-200"
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        {...textareaProps}
      />
    </FormBase>
  );
}
