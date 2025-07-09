import { API_URL } from "@/App";
import type { User } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useSearchResults = (
  searchText: string,
  page: number,
  limit: number
) => {
  const [results, setResults] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<{
          success: boolean;
          results: User[] | null;
          noOfPages: number;
        }>(
          `${API_URL}/api/user/search?searchText=${searchText}&page=${page}&limit=${limit}`
        );
        setResults(response.data.results);
        setNoOfPages(response.data.noOfPages);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchText, page, limit]);

  return {
    results,
    isLoading,
    noOfPages,
  };
};
