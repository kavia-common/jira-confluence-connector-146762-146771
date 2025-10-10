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
    <div className="empty gradient-surface text-center space-y-3">
      <h3 className="text-lg font-semibold leading-7">{title}</h3>
      <p className="text-sm text-gray-600 leading-6">{description}</p>
      {action}
    </div>
  );
}
