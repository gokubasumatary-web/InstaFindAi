import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export const FilterPanel = ({
  visible,
  onClose,
  onSearch,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleSearch = () => {
    onSearch(filters);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-start overscroll-contain">
      <div className="h-full w-80 max-w-[85vw] bg-white shadow-2xl border-r border-gray-200 overflow-y-auto overscroll-contain">
        <div className="p-6 pt-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
            aria-label="Close filters"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold mb-6 mt-8">Filters</h2>
          <div className="mb-4">
            <label htmlFor="filter-category" className="block text-sm font-medium mb-2">Category</label>
            <Select
              onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
              value={filters.category || ""}
            >
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="fitness coach">Fitness Coach</SelectItem>
              <SelectItem value="python teacher">Python Teacher</SelectItem>
              <SelectItem value="tech influencer">Tech Influencer</SelectItem>
              <SelectItem value="business coach">Business Coach</SelectItem>
              <SelectItem value="travel creator">Travel Creator</SelectItem>
            </Select>
          </div>
          <div className="mb-4">
            <label htmlFor="filter-location" className="block text-sm font-medium mb-2">Location</label>
            <Input
              placeholder="City, Country…"
              value={filters.location || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Follower Range</label>
            <Slider min={0} max={500} step={10} value={filters.min_followers?.min ?? 0} onChange={(v) => setFilters((p) => ({ ...p, min_followers: { min: v } }))} />
            <div className="mt-4"><Slider min={0} max={500} step={10} value={filters.max_followers?.max ?? 500} onChange={(v) => setFilters((p) => ({ ...p, max_followers: { max: v } }))} /></div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Engagement Rate</label>
            <Slider min={0} max={10} step={0.5} value={filters.engagement_rate || 0} onChange={(v) => setFilters((p) => ({ ...p, engagement_rate: v }))} />
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.verified !== false} onChange={(e) => setFilters((p) => ({ ...p, verified: e.target.checked }))} className="rounded border focus-visible:ring-2" />
              <span>Verified accounts only</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.business !== false} onChange={(e) => setFilters((p) => ({ ...p, business: e.target.checked }))} className="rounded border focus-visible:ring-2" />
              <span>Business/Creator account</span>
            </label>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button type="button" onClick={handleSearch} className="w-full py-3 rounded-md text-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-2 touch-manipulation">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      <button type="button" aria-label="Close filters overlay" onClick={onClose} className="flex-1 h-full" />
    </div>
  );
};
