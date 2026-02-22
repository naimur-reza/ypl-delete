import { FormBase, FormControlProps } from "./FormBase";
import { useFieldContext } from "@/hooks/use-field-context";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { X, Plus } from "lucide-react";

export function FormMultiInput(props: FormControlProps) {
  const field = useFieldContext<string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const values = Array.isArray(field.state.value) ? field.state.value : [];

  const handleAddInput = () => {
    field.handleChange([...values, ""]);
  };

  const handleRemoveInput = (index: number) => {
    field.handleChange(values.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, newValue: string) => {
    const updated = [...values];
    updated[index] = newValue;
    field.handleChange(updated);
  };

  return (
    <FormBase {...props}>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onBlur={field.handleBlur}
              className="border border-gray-200"
              aria-invalid={isInvalid}
              id={`${field.name}-${index}`}
              placeholder={`Item ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveInput(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddInput}
          className="border-gray-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    </FormBase>
  );
}
