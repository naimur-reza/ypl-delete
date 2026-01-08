import { useCallback, useRef } from "react";
import { generateSlug } from "@/lib/utils";

interface UseAutoSlugOptions {
  /** Function to get current slug value */
  getSlugValue: () => string;
  /** Function to set slug value */
  setSlugValue: (value: string) => void;
  /** Whether we're editing an existing item (slug was already set) */
  isEditing?: boolean;
}

/**
 * Hook to manage auto-generation of slugs from titles
 * Tracks whether user has manually edited the slug to avoid overwriting their changes
 *
 * @example
 * const { handleTitleChange, handleSlugChange } = useAutoSlug({
 *   getSlugValue: () => form.getFieldValue("slug"),
 *   setSlugValue: (value) => form.setFieldValue("slug", value),
 *   isEditing: !!selectedItem,
 * });
 */
export function useAutoSlug({
  getSlugValue,
  setSlugValue,
  isEditing = false,
}: UseAutoSlugOptions) {
  // Track if user has manually edited the slug
  const hasManuallyEdited = useRef(isEditing);
  // Track the last auto-generated slug to detect manual edits
  const lastAutoSlug = useRef("");

  const handleTitleChange = useCallback(
    (title: string) => {
      // Only auto-generate if user hasn't manually edited
      if (!hasManuallyEdited.current) {
        const newSlug = generateSlug(title);
        lastAutoSlug.current = newSlug;
        setSlugValue(newSlug);
      }
    },
    [setSlugValue]
  );

  const handleSlugChange = useCallback(
    (slug: string) => {
      const normalizedSlug = generateSlug(slug);
      // If slug is different from what we auto-generated, user is manually editing
      if (normalizedSlug !== lastAutoSlug.current && getSlugValue() !== "") {
        hasManuallyEdited.current = true;
      }
      // If user clears the slug, allow auto-generation again
      if (slug === "") {
        hasManuallyEdited.current = false;
      }
    },
    [getSlugValue]
  );

  const resetManualEdit = useCallback(() => {
    hasManuallyEdited.current = false;
    lastAutoSlug.current = "";
  }, []);

  return {
    handleTitleChange,
    handleSlugChange,
    resetManualEdit,
    hasManuallyEdited: hasManuallyEdited.current,
  };
}
