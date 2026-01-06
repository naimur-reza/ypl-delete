import { useFieldContext } from "@/hooks/use-field-context";
import { Input } from "../ui/input";
import { FormBase, FormControlProps } from "./FormBase";
import { ComponentProps } from "react";

export function FormInput(
  props: FormControlProps &
    Omit<
      ComponentProps<typeof Input>,
      "id" | "name" | "value" | "onBlur" | "onChange" | "aria-invalid"
    >
) {
  const field = useFieldContext<string | number | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const { label, description, type, ...inputProps } = props;

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

  return (
    <FormBase label={label} description={description}>
      <Input
      className="border border-gray-200"
        id={field.name}
        name={field.name}
        type={type}
        value={value}
        onBlur={field.handleBlur}
        onChange={handleChange}
        aria-invalid={isInvalid}
        {...inputProps}
      />
    </FormBase>
  );
}
