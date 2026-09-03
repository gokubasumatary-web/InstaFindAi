import React from "react";

export const Select = ({ onValueChange, value, children }) => {
  const handleChange = (e) => {
    onValueChange(e.target.value);
  };

  return (
    <div className="relative">
      <select
        onChange={handleChange}
        value={value}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {children}
      </select>
    </div>
  );
};

export const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};
