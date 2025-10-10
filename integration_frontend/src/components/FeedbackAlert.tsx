"use client";

import React from "react";

export default function FeedbackAlert({
  type,
  message,
  onClose,
}: {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}) {
  const styles =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-800"
      : type === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-blue-50 border-blue-200 text-blue-800";

  return (
    <div
      className={`fade-in border ${styles} px-4 py-3 rounded-md text-sm leading-6 flex items-start justify-between`}
      role="status"
      aria-live="polite"
    >
      <div>{message}</div>
      {onClose && (
        <button className="ml-4 text-xs underline focus-ring" onClick={onClose} aria-label="Dismiss">
          Dismiss
        </button>
      )}
    </div>
  );
}
