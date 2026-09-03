import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import api from "@/lib/api";

export const useSearch = () => {
  const [lastResults, setLastResults] = useState<any[]>([]);

  const executeSearch = useCallback(
    async (query: string) => {
      setLastResults([]);
      try {
        const response = await api.parseQuery(query);
        const filters = response;

        // Search accounts
        const searchResponse = await api.searchAccounts(filters);
        setLastResults(searchResponse.results || []);

        return searchResponse.results || [];
      } catch (error) {
        console.error("Search error:", error);
        throw error;
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setLastResults([]);
  }, []);

  return {
    executeSearch,
    clearResults,
    lastResults,
  };
};