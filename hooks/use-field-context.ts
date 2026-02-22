import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { FormCheckbox } from "@/components/form/FormCheckbox";
import { FormSelect } from "@/components/form/FormSelect";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormMultiInput } from "@/components/form/FormMultiInput";
import { FormImageUpload } from "@/components/form/FormImageUpload";
import { FormFileUpload } from "@/components/form/FormFileUpload";
import { FormDateInput } from "@/components/form/FormDateInput";
import { FormCheckboxGroup } from "@/components/form/FormCheckboxGroup";
import { FormRichTextEditor } from "@/components/form/FormRichTextEditor";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Textarea: FormTextarea,
    Select: FormSelect,
    Checkbox: FormCheckbox,
    CheckboxGroup: FormCheckboxGroup,
    MultiInput: FormMultiInput,
    ImageUpload: FormImageUpload,
    FileUpload: FormFileUpload,
    Date: FormDateInput,
    RichText: FormRichTextEditor,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
