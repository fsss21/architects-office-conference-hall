import { createContext, useContext, useState, useMemo } from 'react'

const SubMenuFilterContext = createContext(null)

export function SubMenuFilterProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')

  const value = useMemo(
    () => ({ searchQuery, setSearchQuery }),
    [searchQuery]
  )

  return (
    <SubMenuFilterContext.Provider value={value}>
      {children}
    </SubMenuFilterContext.Provider>
  )
}

export function useSubMenuFilter() {
  const ctx = useContext(SubMenuFilterContext)
  return ctx || { searchQuery: '', setSearchQuery: () => {} }
}
