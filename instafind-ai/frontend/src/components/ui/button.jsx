import React from "react";

export const Button = ({ type = "button", className = "", children }) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none touch-manipulation ${className}`}
    >
      {children}
    </button>
  );
};
