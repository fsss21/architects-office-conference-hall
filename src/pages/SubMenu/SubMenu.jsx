import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCatalogFilter } from '../../context/CatalogFilterContext'
import { useSubMenuFilter } from '../../context/SubMenuFilterContext'
import { filterPoint } from '../../utils/subMenuFilter'
import ProgressLine from '../../components/ProgressLine/ProgressLine'
import Header from '../../components/Header/Header'
import SubMenuDefault from './SubMenuDefault/SubMenuDefault'
import SubMenuScientific from './SubMenuScientific/SubMenuScientific'
import SubMenuVideos from './SubMenuVideos/SubMenuVideos'
import styles from './SubMenu.module.css'
import subMenuImg from '../../assets/sub_menu_img.png'
import subMenuImg4k from '../../assets/sub_menu_img-4k.png'
import subMenuScientificImg from '../../assets/sub_menu_scientific_activity_img.png'
import subMenuScientificImg4k from '../../assets/sub_menu_scientific_activity_img-4k.png'
import subMenuVideosImg from '../../assets/sub_menu_videos_img.png'
import subMenuVideosImg4k from '../../assets/sub_menu_videos_img-4k.png'

function SubMenu() {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedItemIds } = useCatalogFilter()
  const { searchQuery } = useSubMenuFilter()
  const appliedInitialPoint = useRef(false)
  const [selectedPoint, setSelectedPoint] = useState(0)
  const [progressPoints, setProgressPoints] = useState([])
  const [imageSrc, setImageSrc] = useState(subMenuImg)
  const [scientificImageSrc, setScientificImageSrc] = useState(subMenuScientificImg)
  const [videosImageSrc, setVideosImageSrc] = useState(subMenuVideosImg)

  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? subMenuImg4k : subMenuImg)
    setScientificImageSrc(is4K ? subMenuScientificImg4k : subMenuScientificImg)
    setVideosImageSrc(is4K ? subMenuVideosImg4k : subMenuVideosImg)

    const controller = new AbortController()
    fetch('/data/progressPoints.json', { signal: controller.signal })
      .then(res => (res.ok ? res.json() : []))
      .then(data => setProgressPoints(Array.isArray(data) ? data : []))
      .catch(err => { if (err.name !== 'AbortError') console.error('Error loading progress points:', err) })
    return () => controller.abort()
  }, [])

  const [id3VideoSubsection, setId3VideoSubsection] = useState(false)

  useEffect(() => {
    if (appliedInitialPoint.current || progressPoints.length === 0) return
    const pointIndex = location.state?.pointIndex
    if (typeof pointIndex === 'number' && pointIndex >= 0 && pointIndex < progressPoints.length) {
      setSelectedPoint(pointIndex)
      if (progressPoints[pointIndex]?.id !== 3) setId3VideoSubsection(false)
    }
    appliedInitialPoint.current = true
  }, [progressPoints, location.state])

  useEffect(() => {
    if (progressPoints.length > 0 && selectedPoint >= progressPoints.length) {
      setSelectedPoint(0)
    }
  }, [progressPoints.length, selectedPoint])

  const handlePointClick = (index) => {
    if (index >= 0 && index < progressPoints.length) {
      setSelectedPoint(index)
      if (progressPoints[index]?.id !== 3) setId3VideoSubsection(false)
    }
  }

  const currentPoint = progressPoints[selectedPoint]
  const filteredPoint = useMemo(
    () => filterPoint(currentPoint, selectedItemIds, searchQuery),
    [currentPoint, selectedItemIds, searchQuery]
  )
  const pointId = currentPoint?.id
  const showHeaderFilters = true
  const useVideosBg = pointId === 3 && id3VideoSubsection
  const useScientificBg = pointId === 1 || pointId === 2 || (pointId === 3 && !useVideosBg)
  const backgroundImageSrc = useVideosBg ? videosImageSrc : useScientificBg ? scientificImageSrc : imageSrc
  const isSubMenuScientificLayout = pointId === 1 || pointId === 2 || pointId === 3

  const navProps = { onBack: () => navigate('/'), onMainMenu: () => navigate('/catalog') }

  const renderContent = () => {
    if (!currentPoint) return null
    const hasActiveFilters = (Array.isArray(selectedItemIds) && selectedItemIds.length > 0) || (searchQuery || '').trim()
    if (hasActiveFilters && !filteredPoint) {
      return (
        <div className={styles.filterEmpty}>
          По вашему запросу ничего не найдено. Измените параметры поиска или фильтров.
        </div>
      )
    }
    const pointToShow = hasActiveFilters ? filteredPoint : currentPoint
    if (!pointToShow) return null
    if (pointId === 2) return <SubMenuScientific point={pointToShow} {...navProps} />
    if (pointId === 3) return <SubMenuVideos point={pointToShow} onSubsectionChange={setId3VideoSubsection} {...navProps} />
    return <SubMenuDefault point={pointToShow} {...navProps} />
  }

  return (
    <div className={styles.subMenu}>
      <div className={styles.subMenuBackground} style={{ backgroundImage: `url(${backgroundImageSrc})` }} />
      <Header showFiltersAndSearch={showHeaderFilters} isSubMenuId2Or3={isSubMenuScientificLayout} />
      <div className={styles.subMenuContent}>
        <ProgressLine points={progressPoints} onPointClick={handlePointClick} activeIndex={selectedPoint} isSubMenuId2Or3={isSubMenuScientificLayout} />
        {renderContent()}
      </div>
    </div>
  )
}

export default SubMenu
