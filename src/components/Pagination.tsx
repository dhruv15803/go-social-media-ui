import React, { type SetStateAction } from "react";

type Props = {
  noOfPages: number;
  currentPage: number;
  setPage: React.Dispatch<SetStateAction<number>>;
};

const Pagination = ({ currentPage, noOfPages, setPage }: Props) => {
  let pages = [];

  for (let i = 1; i <= noOfPages; i++) {
    pages.push(i);
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {pages.map((page) => {
          return (
            <div
              onClick={() => setPage(page)}
              key={page}
              className={`border-2 rounded-lg border-teal-500 text-teal-500 p-2 ${
                page === currentPage ? "bg-teal-500 text-white" : ""
              }`}
            >
              {page}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Pagination;
