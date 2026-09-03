import React from "react";
import { Select, SelectItem } from "@/components/ui/select";

export const SortDropdown = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Select onValueChange={(v) => onChange(v)} value={value}>
        <SelectItem value="best-match">Best Match</SelectItem>
        <SelectItem value="followers-desc">Followers (High to Low)</SelectItem>
        <SelectItem value="followers-asc">Followers (Low to High)</SelectItem>
        <SelectItem value="engagement-desc">Engagement (High to Low)</SelectItem>
        <SelectItem value="recent">Recently Active</SelectItem>
      </Select>
    </div>
  );
};
