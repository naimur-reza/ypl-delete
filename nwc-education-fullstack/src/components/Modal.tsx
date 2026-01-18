"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>> | (() => void);
  title: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (typeof onClose === "function" && onClose.length === 0) {
      (onClose as () => void)();
    } else {
      (onClose as Dispatch<SetStateAction<boolean>>)(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-7xl max-h-[90vh]   bg-white rounded-xl shadow-2xl border-0 p-0">
        <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="px-8 py-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
