import { FormBase, FormControlProps } from "./FormBase";
import { useFieldContext } from "@/hooks/use-field-context";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export function FormDateInput(props: FormControlProps) {
  const field = useFieldContext<Date>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    field.handleChange(date);
  };

  const dateValue =
    field.state.value instanceof Date
      ? format(field.state.value, "yyyy-MM-dd")
      : "";

  return (
    <FormBase {...props}>
      <div className="relative">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateValue}
            onChange={handleDateChange}
            onBlur={field.handleBlur}
            id={field.name}
            aria-invalid={isInvalid}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Calendar className="h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        {field.state.value && (
          <p className="text-sm text-gray-500 mt-1">
            {format(field.state.value, "EEEE, MMMM d, yyyy")}
          </p>
        )}
      </div>
    </FormBase>
  );
}
