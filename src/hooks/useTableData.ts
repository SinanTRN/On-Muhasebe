import { useState, useMemo, useEffect } from 'react';

interface UseTableDataProps<T> {
  data: T[];
  filterFn?: (item: T) => boolean;
  orderByDefault: keyof T;
  orderDefault?: 'asc' | 'desc';
  pageDefault?: number;
  rowsPerPageDefault?: number;
}

export function useTableData<T>({
  data,
  filterFn,
  orderByDefault,
  orderDefault = 'asc',
  pageDefault = 0,
  rowsPerPageDefault = 10
}: UseTableDataProps<T>) {
  const [orderBy, setOrderBy] = useState<keyof T>(orderByDefault);
  const [order, setOrder] = useState<'asc' | 'desc'>(orderDefault);
  const [page, setPage] = useState(pageDefault);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);

  // Filtreleme
  const filteredData = useMemo(
    () => (filterFn ? data.filter(filterFn) : data),
    [data, filterFn]
  );

  // Sıralama
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return order === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredData, order, orderBy]);

  // Sayfalama
  const pagedData = useMemo(
    () => sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage]
  );

  // Sayfa sınırı kontrolü
  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(sortedData.length / rowsPerPage) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [sortedData.length, rowsPerPage, page]);

  const handleSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  const maxPage = Math.max(0, Math.ceil(sortedData.length / rowsPerPage) - 1);

  return {
    pagedData,
    sortedData,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    orderBy,
    handleSort,
    maxPage
  };
} 
