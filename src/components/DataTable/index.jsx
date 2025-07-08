import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function Pagination({ metaData, handlePageChange }) {
  const currentPage = Number(metaData?.page);
  const totalPages = Number(metaData?.totalPages);

  const getPageNumbers = () => {
    const pages = new Set();

    pages.add(1);

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.add(i);
      }
    }

    if (totalPages > 1) {
      pages.add(totalPages);
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);

    const displayPages = [];

    for (let i = 0; i < sortedPages.length; i++) {
      const current = sortedPages[i];
      const prev = sortedPages[i - 1];

      if (i > 0 && current - prev > 1) {
        displayPages.push("ellipsis");
      }

      displayPages.push(current);
    }

    return displayPages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) handlePageChange(currentPage - 1);
            }}
            className={
              currentPage == 1
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page == currentPage}
                className={
                  page == currentPage ? "pointer-events-none" : "cursor-pointer"
                }
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (currentPage < totalPages) handlePageChange(currentPage + 1);
            }}
            className={
              currentPage == totalPages
                ? "pointer-events-none opacity-50 "
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
