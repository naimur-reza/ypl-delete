"use client";

import { useState, useCallback } from "react";

interface UseConfirmDialogOptions<T> {
  title: string;
  getDescription?: (item: T) => string;
  onConfirm: (item: T) => Promise<void>;
}

export function useConfirmDialog<T>({
  title,
  getDescription,
  onConfirm,
}: UseConfirmDialogOptions<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const openDialog = useCallback((item: T) => {
    setItemToDelete(item);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setItemToDelete(null);
    setIsLoading(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!itemToDelete) return;
    
    setIsLoading(true);
    try {
      await onConfirm(itemToDelete);
    } finally {
      closeDialog();
    }
  }, [itemToDelete, onConfirm, closeDialog]);

  const description = itemToDelete && getDescription 
    ? getDescription(itemToDelete)
    : "This action cannot be undone.";

  return {
    isOpen,
    isLoading,
    title,
    description,
    openDialog,
    closeDialog,
    handleConfirm,
    setIsOpen,
  };
}
