import React from "react";

export const Input = ({
  placeholder,
  value,
  onChange,
  isFocused,
  onFocus,
  onBlur,
  className,
}) => {
  const baseClasses = "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${baseClasses} ${className}`}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};
