import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RemoveConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isPackage?: boolean;
}

export const RemoveConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isPackage = false
}: RemoveConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent className="rounded-3xl max-w-[340px] md:max-w-[360px] p-6 gap-6 bg-white border border-slate-100 shadow-xl">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-lg font-bold text-slate-800 text-left">
            {isPackage ? "Remove Package" : "Remove Test"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 text-sm leading-relaxed text-left">
            Are you sure you want to remove this {isPackage ? "package" : "test"} from cart?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-end items-center gap-6 sm:space-x-0 mt-2">
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors focus:outline-none"
          >
            No
          </button>
          <button 
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="text-[#003B73] hover:text-[#002b54] font-black text-sm transition-colors focus:outline-none"
          >
            Yes
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
