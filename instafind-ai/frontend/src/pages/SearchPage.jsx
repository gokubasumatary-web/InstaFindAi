import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AccountCard } from "@/components/AccountCard";
import { FilterPanel } from "@/components/FilterPanel";
import { SortDropdown } from "@/components/SortDropdown";
import { SearchBar } from "@/components/SearchBar";
import { useSearch } from "@/hooks/useSearch";

export const SearchPage = () => {
  const location = useLocation();
  const initialQuery = location.state?.query || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("best-match");

  const { executeSearch, clearResults, lastResults } = useSearch();

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await executeSearch(query);
      setResults(results || []);
    } catch (err) {
      setError("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <nav className="mb-6" aria-label="Breadcrumb">
          <a href="/" className="text-sm text-gray-600 hover:text-gray-900">← Back to Search</a>
          <h1 className="text-xl font-bold mt-2">Search Results</h1>
        </nav>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} defaultQuery={initialQuery} />
        </div>

        <div className="mb-4 flex items-center gap-4">
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50">
            Filters
          </button>
          <SortDropdown value={sortBy} onChange={(value) => setSortBy(value)} />
        </div>

        {loading && (
          <div className="min-h-[400px] flex flex-col items-center justify-center" aria-live="polite" aria-busy="true">
            <div className="w-16 h-16 rounded-full bg-gray-200 mb-4 animate-pulse"></div>
            <p>Searching…</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 text-center" role="alert">
            <p className="text-red-700">{error}</p>
            <button type="button" onClick={() => { setError(null); clearResults(); }} className="mt-3 px-4 py-2 border rounded hover:bg-gray-50">Try Again</button>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-500">
            <p>No accounts found matching your criteria.</p>
            <button type="button" onClick={() => setShowFilters(true)} className="mt-4 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50">Try different filters</button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((acc) => (
            <AccountCard key={acc.username} account={acc} onSave={() => {}} />
          ))}
        </div>

        <FilterPanel visible={showFilters} onClose={() => setShowFilters(false)} onSearch={(filters) => {
          setResults((prev) => prev.filter((acc) => {
            if (filters.category && acc.category !== filters.category) return false;
            if (filters.location && !acc.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
            if (filters.min_followers && acc.followers < filters.min_followers) return false;
            if (filters.max_followers && acc.followers > filters.max_followers) return false;
            return true;
          }));
          setShowFilters(false);
        }} />
      </div>
    </main>
  );
};
