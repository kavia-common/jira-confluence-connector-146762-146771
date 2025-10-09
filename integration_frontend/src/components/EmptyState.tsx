"use client";

import React from "react";

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty gradient-surface text-center space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      {action}
    </div>
  );
}
