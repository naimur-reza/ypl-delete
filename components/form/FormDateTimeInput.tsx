import { FormBase, FormControlProps } from "./FormBase";
import { useFieldContext } from "@/hooks/use-field-context";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export function FormDateTimeInput(props: FormControlProps) {
  const field = useFieldContext<Date>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      field.handleChange(date);
    }
  };

  const dateTimeValue =
    field.state.value instanceof Date && !isNaN(field.state.value.getTime())
      ? format(field.state.value, "yyyy-MM-dd'T'HH:mm")
      : "";

  return (
    <FormBase {...props}>
      <div className="relative">
        <div className="flex items-center gap-2">
          <input
            type="datetime-local"
            value={dateTimeValue}
            onChange={handleDateTimeChange}
            onBlur={field.handleBlur}
            id={field.name}
            aria-invalid={isInvalid}
            className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
          />
          <Calendar className="h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>
        {field.state.value instanceof Date && !isNaN(field.state.value.getTime()) && (
          <p className="text-sm text-muted-foreground mt-1">
            {format(field.state.value, "EEEE, MMMM d, yyyy 'at' h:mm a")}
          </p>
        )}
      </div>
    </FormBase>
  );
}
