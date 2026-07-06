'use client';

import React, { useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteButtonProps {
  id: string;
  deleteAction: (formData: FormData) => Promise<any>;
  confirmMessage: string;
}

export function DeleteButton({ id, deleteAction, confirmMessage }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (confirm(confirmMessage)) {
      startTransition(async () => {
        const formData = new FormData();
        formData.append('id', id);
        try {
          await deleteAction(formData);
        } catch (error) {
          console.error('Delete action failed:', error);
          alert('Failed to delete item. Please try again.');
        }
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="p-2 border border-zinc-200 rounded-lg hover:bg-red-50 hover:border-red-200 text-red-500 hover:text-red-700 disabled:opacity-50 flex items-center justify-center"
      title="Delete"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
export default DeleteButton;
