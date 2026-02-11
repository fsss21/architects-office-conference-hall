import { createContext, useContext, useState, useMemo } from 'react'

const CatalogFilterContext = createContext(null)

export function CatalogFilterProvider({ children }) {
  const [selectedItemIds, setSelectedItemIds] = useState([])

  const value = useMemo(
    () => ({ selectedItemIds, setSelectedItemIds }),
    [selectedItemIds]
  )

  return (
    <CatalogFilterContext.Provider value={value}>
      {children}
    </CatalogFilterContext.Provider>
  )
}

export function useCatalogFilter() {
  const ctx = useContext(CatalogFilterContext)
  if (!ctx) {
    throw new Error('useCatalogFilter must be used within CatalogFilterProvider')
  }
  return ctx
}
