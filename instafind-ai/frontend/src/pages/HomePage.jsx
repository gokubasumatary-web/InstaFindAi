import React from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate("/search", { state: { query } });
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-balance">
            InstaFind AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto text-pretty">
            "Find the Instagram accounts you actually need."
          </p>
          <p className="text-base mt-4 text-gray-500">
            Describe your ideal account. Our AI finds and ranks the best matches.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 mb-12 shadow-sm">
          <SearchBar onSearch={handleSearch} defaultQuery="Find fitness coaches in India with 10K-50K followers" />
        </div>

        <div className="mb-8 p-6 bg-gray-100 rounded-xl">
          <p className="text-sm text-gray-500 mb-2">Example:</p>
          <p className="font-medium bg-white px-3 py-2 rounded text-sm">
            "Find fitness coaches in India with 10K-50K followers"
          </p>
        </div>
      </div>
    </main>
  );
};
