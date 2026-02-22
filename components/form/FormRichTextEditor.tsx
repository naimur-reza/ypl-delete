import { useFieldContext } from "@/hooks/use-field-context";
 
import { FormBase, FormControlProps } from "./FormBase";
import RichTextEditor from "../ui/rich-text-editor";

export function FormRichTextEditor(
  props: FormControlProps & {
    placeholder?: string;
  }
) {
  const field = useFieldContext<string>();
  const { label, description, placeholder } = props;

  return (
    <FormBase label={label} description={description}>
      <RichTextEditor
        value={field.state.value || ""}
        onChange={(val) => field.handleChange(val)}
        placeholder={placeholder}
      />
    </FormBase>
  );
}
