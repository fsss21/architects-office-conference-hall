import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCatalogFilter } from '../../context/CatalogFilterContext'
import Header from '../../components/Header/Header'
import styles from './Catalog.module.css'
import catalogImg from '../../assets/catalog_img.png'
import catalogImg4k from '../../assets/catalog_img-4k.png'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const COLUMNS = { desktop: 4, tablet: 3, mobile: 2, small: 1 }

function useColumns() {
  const [cols, setCols] = useState(4)
  useEffect(() => {
    const mq = (w) => window.matchMedia(`(max-width: ${w}px)`)
    const update = () => {
      if (mq(480).matches) setCols(COLUMNS.small)
      else if (mq(768).matches) setCols(COLUMNS.mobile)
      else if (mq(1200).matches) setCols(COLUMNS.tablet)
      else setCols(COLUMNS.desktop)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return cols
}

function Catalog() {
  const navigate = useNavigate()
  const columns = useColumns()
  const { selectedItemIds } = useCatalogFilter()
  const [currentPage, setCurrentPage] = useState(0)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(catalogImg)
  const [items, setItems] = useState([])

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? catalogImg4k : catalogImg)

    const controller = new AbortController()
    fetch('/data/catalogItems.json', { signal: controller.signal })
      .then(res => (res.ok ? res.json() : []))
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(err => { if (err.name !== 'AbortError') console.error('Error loading catalog items:', err) })
    return () => controller.abort()
  }, [])

  const filteredItems = useMemo(() => {
    if (selectedItemIds.length === 0) return items
    return items.filter((item) => {
      const ids = item?.filterIds
      if (!ids || !Array.isArray(ids)) return false
      return ids.some((id) => selectedItemIds.includes(id))
    })
  }, [items, selectedItemIds])

  const PAGE_SIZE = 8
  const visibleItems = useMemo(
    () => filteredItems.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE),
    [filteredItems, currentPage]
  )

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE)

  useEffect(() => {
    if (filteredItems.length === 0) {
      setCurrentPage(0)
    } else if (totalPages > 0 && currentPage >= totalPages) {
      setCurrentPage(totalPages - 1)
    }
    setCurrentItemIndex((prev) => Math.min(prev, Math.max(0, visibleItems.length - 1)))
  }, [filteredItems.length, totalPages, currentPage, visibleItems.length])

  const handleNextItem = () => {
    if (visibleItems.length === 0) return
    if (currentItemIndex < visibleItems.length - 1) {
      setCurrentItemIndex((prev) => prev + 1)
    } else if ((currentPage + 1) * PAGE_SIZE < filteredItems.length) {
      setCurrentPage((prev) => prev + 1)
      setCurrentItemIndex(0)
    }
  }

  const handlePrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex((prev) => prev - 1)
    } else if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
      setCurrentItemIndex(PAGE_SIZE - 1)
    }
  }

  const handleItemClick = (item) => {
    navigate(`/catalog/${item.id}`)
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className={styles.catalog}>
      <div 
        className={styles.catalogBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <Header />
      <div className={styles.catalogContent}>
        {/* Центральная область с предметами */}
        <div className={styles.catalogCenter}>
          <div className={styles.catalogItemsContainer}>
            {filteredItems.length === 0 ? (
              <p className={styles.catalogEmpty}>По вашему запросу ничего не найдено. Измените фильтры.</p>
            ) : (
            visibleItems.flatMap((item, index) => {
              const imgSrc = (item.photos && item.photos[0]) || `/images/${item.id}.jpg`
              const itemEl = (
                <div
                  key={item.id}
                  className={`${styles.catalogItem} ${
                    index === currentItemIndex ? styles.catalogItemActive : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className={styles.catalogItemImage}>
                    <img
                      src={imgSrc}
                      alt={item.name}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const placeholder = e.target.parentElement?.querySelector('[data-photo-placeholder]')
                        if (placeholder) placeholder.style.display = 'flex'
                      }}
                    />
                    <span className={styles.catalogItemNoPhoto} data-photo-placeholder>Нет фотографии</span>
                  </div>
                  <h3
                    className={styles.catalogItemTitle}
                    dangerouslySetInnerHTML={{ __html: item?.title || '' }}
                  />
                </div>
              )
              const isLastInRow = columns === 1 || (index + 1) % columns === 0
              const isEndOfRow = isLastInRow && index < visibleItems.length - 1
              const result = [itemEl]
              if (!isLastInRow && columns > 1) result.push(<span key={`v-${index}`} className={styles.dividerVertical} />)
              if (isEndOfRow) result.push(<span key={`h-${index}`} className={styles.divider} />)
              return result
            })
            )}
          </div>

          {/* Стрелочки для переключения между предметами - по середине страницы */}
          <div className={styles.catalogControls}>
            <button 
              className={styles.catalogArrow}
              onClick={handlePrevItem}
                  disabled={filteredItems.length === 0 || (currentPage === 0 && currentItemIndex === 0)}
              aria-label="Предыдущий предмет"
            >
              <ArrowBackIosNewIcon/>
            </button>
            <button
              className={styles.catalogArrow}
              onClick={handleNextItem}
              disabled={
                filteredItems.length === 0 ||
                (currentPage === totalPages - 1 && currentItemIndex === visibleItems.length - 1)
              }
              aria-label="Следующий предмет"
            >
              <ArrowForwardIosIcon/>
            </button>
          </div>
        </div>

        <div className={styles.catalogBottomNavigation}>
          <button className={styles.catalogBackBtn} onClick={handleBack}>
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}

export default Catalog
