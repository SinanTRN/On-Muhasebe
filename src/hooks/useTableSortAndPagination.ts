import { useState, useMemo } from 'react'

export function useTableSortAndPagination<T>(
  data: T[],
  defaultOrderBy: keyof T,
  defaultOrder: 'asc' | 'desc' = 'desc',
  defaultRowsPerPage = 10
) {
  const [order, setOrder] = useState<'asc' | 'desc'>(defaultOrder)
  const [orderBy, setOrderBy] = useState<keyof T>(defaultOrderBy)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)

  const handleSort = (property: keyof T) => {
    if (orderBy === property) setOrder(order === 'asc' ? 'desc' : 'asc')
    else {
      setOrder('asc')
      setOrderBy(property)
    }
  }

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[orderBy]
      const bVal = b[orderBy]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return order === 'asc' ? aVal - bVal : bVal - aVal
      }
      const aStr = (aVal ?? '').toString().toLowerCase()
      const bStr = (bVal ?? '').toString().toLowerCase()
      if (aStr < bStr) return order === 'asc' ? -1 : 1
      if (aStr > bStr) return order === 'asc' ? 1 : -1
      return 0
    })
  }, [data, order, orderBy])

  const pagedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [sortedData, page, rowsPerPage])

  return {
    order,
    setOrder,
    orderBy,
    setOrderBy,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    handleSort,
    pagedData,
    sortedData,
    totalCount: data.length
  }
} 
