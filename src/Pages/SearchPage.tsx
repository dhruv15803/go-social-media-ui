import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SEARCH_RESULTS_PER_PAGE } from "@/consts";
import { useDebounced } from "@/Hooks/useDebounced";
import { useSearchResults } from "@/Hooks/useSearchResults";
import { UserIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const SearchPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState<string>("");
  const debouncedSearchText = useDebounced(searchText);
  const {
    results,
    noOfPages,
    isLoading: isResultsLoading,
  } = useSearchResults(debouncedSearchText, page, SEARCH_RESULTS_PER_PAGE);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center w-full">
          <Input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="search"
            className="m-4"
          />
        </div>

        <div className="flex flex-col gap-2 items-center justify-center w-full">
          {isResultsLoading && (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
                return (
                  <Skeleton key={val} className="rounded-lg w-full h-16" />
                );
              })}
            </>
          )}

          {results !== null && results.length !== 0 && (
            <>
              {results.map((result) => {
                return (
                  <div
                    onClick={() => navigate(`/user/${result.id}/profile`)}
                    key={result.id}
                    className={`border-2 border-b p-4 flex items-center justify-between w-full hover:bg-gray-50 group-hover:duration-300 hover:cursor-pointer`}
                  >
                    <div className="flex items-center gap-2">
                      {result.image_url !== null && result.image_url !== "" ? (
                        <img
                          src={result.image_url}
                          className="rounded-full w-12 h-12"
                        />
                      ) : (
                        <UserIcon />
                      )}

                      <span className="font-semibold">{result.username}</span>
                    </div>
                  </div>
                );
              })}

              {noOfPages > 1 && (
                <Pagination
                  setPage={setPage}
                  noOfPages={noOfPages}
                  currentPage={page}
                />
              )}
            </>
          )}

          {(results === null || results.length === 0) && (
            <>
              <div className="flex items-center justify-center font-semibold">
                {debouncedSearchText === ""
                  ? "Search for users"
                  : `No results for ${debouncedSearchText} found `}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
