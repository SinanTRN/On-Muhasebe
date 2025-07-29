export function sortTableData<T>(
  data: T[],
  orderBy: keyof T,
  order: 'asc' | 'desc'
): T[] {
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
} 
