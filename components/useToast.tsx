"use client";

import { useCallback, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState<{ message: string; isSuccess: boolean } | null>(null);

  const showToast = useCallback((message: string, isSuccess = false) => {
    setToast({ message, isSuccess });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const Toast = toast ? (
    <div
      className={`fixed top-5 right-5 text-white px-4 py-2 rounded-lg shadow-lg z-50 ${
        toast.isSuccess ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {toast.message}
    </div>
  ) : null;

  return { showToast, Toast };
}
