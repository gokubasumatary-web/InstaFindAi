import React, { useState } from "react";

export const SearchBar = ({ onSearch, defaultQuery = "" }) => {
  const [query, setQuery] = useState(defaultQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="search-input" className="sr-only">Search Instagram accounts</label>
      <div className="flex gap-2">
        <input
          id="search-input"
          type="search"
          name="search"
          placeholder="What Instagram accounts are you looking for…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg shadow-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};
