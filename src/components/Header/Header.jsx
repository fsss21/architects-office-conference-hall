import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCatalogFilter } from '../../context/CatalogFilterContext'
import { useSubMenuFilter } from '../../context/SubMenuFilterContext'
import styles from './Header.module.css'

import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

function Header({ showFiltersAndSearch = false, isSubMenuId2Or3 = false }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { id: catalogItemId } = useParams()
  const isCatalogPage = location.pathname === '/catalog'
  const showFilters = isCatalogPage || showFiltersAndSearch
  const isCatalogItemPage = location.pathname.startsWith('/catalog/') && location.pathname !== '/catalog'

  const [catalogItems, setCatalogItems] = useState([])
  const { selectedItemIds, setSelectedItemIds } = useCatalogFilter()
  const { searchQuery, setSearchQuery } = useSubMenuFilter()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [wordsCollapsed, setWordsCollapsed] = useState(false)
  const [datesCollapsed, setDatesCollapsed] = useState(false)
  const [docTypesCollapsed, setDocTypesCollapsed] = useState(false)
  const [filterOptions, setFilterOptions] = useState({ words: [], dates: [], documentTypes: [] })

  useEffect(() => {
    if (isCatalogItemPage) {
      fetch('/data/catalogItems.json')
        .then(res => (res.ok ? res.json() : []))
        .then(data => setCatalogItems(Array.isArray(data) ? data : []))
        .catch(() => setCatalogItems([]))
    }
  }, [isCatalogItemPage])

  const catalogNav = useMemo(() => {
    if (!isCatalogItemPage || !catalogItemId || catalogItems.length === 0) {
      return { hasPrev: false, hasNext: false, prevId: null, nextId: null }
    }
    const currentId = parseInt(catalogItemId, 10)
    const filtered = selectedItemIds.length === 0
      ? catalogItems
      : catalogItems.filter(i => i.filterIds && i.filterIds.some(fid => selectedItemIds.includes(fid)))
    const idx = filtered.findIndex(i => i.id === currentId)
    if (idx < 0) return { hasPrev: false, hasNext: false, prevId: null, nextId: null }
    return {
      hasPrev: idx > 0,
      hasNext: idx < filtered.length - 1,
      prevId: filtered[idx - 1]?.id ?? null,
      nextId: filtered[idx + 1]?.id ?? null
    }
  }, [isCatalogItemPage, catalogItemId, catalogItems, selectedItemIds])

  useEffect(() => {
    if (showFilters && filtersOpen) {
      fetch('/data/filterOptions.json')
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          setFilterOptions({
            words: Array.isArray(data?.words) ? data.words : [],
            dates: Array.isArray(data?.dates) ? data.dates : [],
            documentTypes: Array.isArray(data?.documentTypes) ? data.documentTypes : []
          })
        })
        .catch((err) => console.error('Header: failed to load filter options', err))
    }
  }, [showFilters, filtersOpen])

  const allFilterIds = useMemo(() => [
    ...filterOptions.words.map(i => i.id),
    ...filterOptions.dates.map(i => i.id),
    ...filterOptions.documentTypes.map(i => i.id)
  ], [filterOptions])

  const isItemSelected = (id) => selectedItemIds.length === 0 || selectedItemIds.includes(id)

  const handleToggleItem = (id) => {
    setSelectedItemIds(prev => {
      const next = prev.length === 0 ? allFilterIds : [...prev]
      if (next.includes(id)) {
        const filtered = next.filter(i => i !== id)
        return filtered.length === 0 ? [] : filtered
      }
      return [...next, id].sort((a, b) => a - b)
    })
  }

  const handleFiltersToggle = () => {
    setSearchOpen(false)
    setFiltersOpen(prev => !prev)
  }
  const handleSearchToggle = () => {
    setFiltersOpen(false)
    setSearchOpen(prev => !prev)
  }
  const handleOverlayClick = () => {
    setFiltersOpen(false)
    setSearchOpen(false)
  }
  const handleShowFilters = () => setFiltersOpen(false)

  return (
    <>
      <header className={`${styles.header} ${isCatalogItemPage ? `${styles.headerOnItemPage} ${styles.headerCatalogItem}` : ''} ${isSubMenuId2Or3 ? styles.headerSubMenuId2Or3 : ''}`}>
        <h1 className={styles.headerTitle}>название временной выставки/конференции</h1>

        {isCatalogItemPage && (
          <div className={styles.headerItemNav}>
            <div className={styles.headerItemNavArrows}>
              <button
                type="button"
                className={styles.headerItemNavBtn}
                onClick={() => catalogNav.prevId && navigate(`/catalog/${catalogNav.prevId}`)}
                disabled={!catalogNav.hasPrev}
                aria-label="Предыдущий предмет"
              >
                <ArrowBackIosNewIcon fontSize='large' />
              </button>
              <button
                type="button"
                className={styles.headerItemNavBtn}
                onClick={() => catalogNav.nextId && navigate(`/catalog/${catalogNav.nextId}`)}
                disabled={!catalogNav.hasNext}
                aria-label="Следующий предмет"
              >
                <ArrowForwardIosIcon fontSize='large' />
              </button>
            </div>
            <button
              type="button"
              className={styles.headerItemNavClose}
              onClick={() => navigate('/catalog')}
              aria-label="Закрыть"
            >
              <CloseIcon fontSize='large' />
            </button>
          </div>
        )}

        {showFilters && (
          <div className={`${styles.headerButtons} ${isSubMenuId2Or3 ? styles.headerButtonsSubMenuId2Or3 : ''}`}>
            <div className={styles.headerDropdownWrap}>
              <button
                type="button"
                className={styles.headerBtnFilters}
                onClick={handleFiltersToggle}
                aria-expanded={filtersOpen}
                aria-haspopup="true"
                aria-label="Открыть фильтры"
              >
                <MenuIcon fontSize="large" />
              </button>
              {filtersOpen && (
                <div className={styles.headerDropdown} onClick={e => e.stopPropagation()}>
                  <div className={styles.headerDropdownHeader}>
                    <h3 className={styles.headerDropdownTitle}>Фильтры</h3>
                    <button type="button" className={styles.headerDropdownClose} onClick={() => setFiltersOpen(false)} aria-label="Закрыть фильтры">
                      <CloseIcon />
                    </button>
                  </div>

                  <div className={`${styles.headerFilterBlock} ${wordsCollapsed ? styles.headerFilterBlockCollapsed : ''}`}>
                    <div className={styles.headerFilterLabelWrap}>
                      <span className={styles.headerFilterLabel}>Слова</span>
                      <button
                        type="button"
                        className={styles.headerCollapseBtn}
                        onClick={() => setWordsCollapsed(prev => !prev)}
                        aria-expanded={!wordsCollapsed}
                      >
                        {wordsCollapsed ? 'Развернуть' : 'Свернуть'}
                        {wordsCollapsed ? <ExpandMoreIcon fontSize="small" /> : <ExpandLessIcon fontSize="small" />}
                      </button>
                    </div>
                    {!wordsCollapsed && (
                      <div className={styles.headerFilterOptions}>
                        {filterOptions.words.map(item => (
                          <label key={item.id} className={styles.headerFilterCheck}>
                            <input
                              type="checkbox"
                              checked={isItemSelected(item.id)}
                              onChange={() => handleToggleItem(item.id)}
                            />
                            {item.label}
                          </label>
                        ))}
                        {filterOptions.words.length === 0 && (
                          <span className={styles.headerFilterEmpty}>Нет элементов</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`${styles.headerFilterBlock} ${datesCollapsed ? styles.headerFilterBlockCollapsed : ''}`}>
                    <div className={styles.headerFilterLabelWrap}>
                      <span className={styles.headerFilterLabel}>Даты</span>
                      <button
                        type="button"
                        className={styles.headerCollapseBtn}
                        onClick={() => setDatesCollapsed(prev => !prev)}
                        aria-expanded={!datesCollapsed}
                      >
                        {datesCollapsed ? 'Развернуть' : 'Свернуть'}
                        {datesCollapsed ? <ExpandMoreIcon fontSize="small" /> : <ExpandLessIcon fontSize="small" />}
                      </button>
                    </div>
                    {!datesCollapsed && (
                      <div className={styles.headerFilterOptions}>
                        {filterOptions.dates.map(item => (
                          <label key={item.id} className={styles.headerFilterCheck}>
                            <input
                              type="checkbox"
                              checked={isItemSelected(item.id)}
                              onChange={() => handleToggleItem(item.id)}
                            />
                            {item.label}
                          </label>
                        ))}
                        {filterOptions.dates.length === 0 && (
                          <span className={styles.headerFilterEmpty}>Нет элементов</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`${styles.headerFilterBlock} ${docTypesCollapsed ? styles.headerFilterBlockCollapsed : ''}`}>
                    <div className={styles.headerFilterLabelWrap}>
                      <span className={styles.headerFilterLabel}>Тип документа</span>
                      <button
                        type="button"
                        className={styles.headerCollapseBtn}
                        onClick={() => setDocTypesCollapsed(prev => !prev)}
                        aria-expanded={!docTypesCollapsed}
                      >
                        {docTypesCollapsed ? 'Развернуть' : 'Свернуть'}
                        {docTypesCollapsed ? <ExpandMoreIcon fontSize="small" /> : <ExpandLessIcon fontSize="small" />}
                      </button>
                    </div>
                    {!docTypesCollapsed && (
                      <div className={styles.headerFilterOptions}>
                        {filterOptions.documentTypes.map(item => (
                          <label key={item.id} className={styles.headerFilterCheck}>
                            <input
                              type="checkbox"
                              checked={isItemSelected(item.id)}
                              onChange={() => handleToggleItem(item.id)}
                            />
                            {item.label}
                          </label>
                        ))}
                        {filterOptions.documentTypes.length === 0 && (
                          <span className={styles.headerFilterEmpty}>Нет элементов</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button type="button" className={styles.headerShowBtn} onClick={handleShowFilters}>
                    Показать
                  </button>
                </div>
              )}
            </div>
            <div className={styles.headerSearchWrap}>
              <button
                type="button"
                className={styles.headerBtnSearch}
                onClick={handleSearchToggle}
                aria-expanded={searchOpen}
                aria-haspopup="true"
                aria-label="Поиск"
              >
                <SearchIcon fontSize="large" />
              </button>
              {searchOpen && (
                <div className={styles.headerSearchPanel} onClick={e => e.stopPropagation()}>
                  <div className={styles.headerSearchForm}>
                    <button type="button" className={styles.headerSearchIconBtn} aria-label="Поиск">
                      <SearchIcon fontSize="small" />
                    </button>
                    <input
                      type="search"
                      className={styles.headerSearchInput}
                      placeholder="Поиск по автору или произведению..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      aria-label="Поле поиска"
                    />
                  </div>
                  <button type="button" className={styles.headerSearchClose} onClick={() => setSearchOpen(false)} aria-label="Закрыть поиск">
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {showFilters && (filtersOpen || searchOpen) && (
        <div className={styles.headerOverlay} onClick={handleOverlayClick} aria-hidden="true" />
      )}
    </>
  )
}

export default Header
