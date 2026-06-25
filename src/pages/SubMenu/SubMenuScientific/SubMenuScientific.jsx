import { useState, useEffect } from 'react'
import PhotoGallery from '../../../components/PhotoGallery/PhotoGallery'
import sharedStyles from '../SubMenuShared.module.css'
import styles from './SubMenuScientific.module.css'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

function SubMenuScientific({ point, onBack, onMainMenu }) {
  const [selectedSubsection, setSelectedSubsection] = useState(null)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const subsections = point?.subsections || []
  const content = selectedSubsection === null ? point : subsections[selectedSubsection]
  const currentPhotos = content?.photos ?? point?.photos ?? []

  useEffect(() => {
    setSelectedSubsection(null)
    setCurrentTextIndex(0)
    setCurrentPhotoIndex(0)
  }, [point])

  const hasPhotos = currentPhotos.length > 0
  const displayTexts = Array.isArray(content?.texts) ? content.texts : (content?.texts ? [content.texts] : [])

  const handleSubsectionClick = (idx) => {
    setSelectedSubsection(idx)
    setCurrentTextIndex(0)
    setCurrentPhotoIndex(0)
  }
  const handlePrevText = () => setCurrentTextIndex(i => Math.max(0, i - 1))
  const handleNextText = () => setCurrentTextIndex(i => Math.min(displayTexts.length - 1, i + 1))
  const handlePrevPhoto = () => setCurrentPhotoIndex(i => (i - 1 + currentPhotos.length) % currentPhotos.length)
  const handleNextPhoto = () => setCurrentPhotoIndex(i => (i + 1) % currentPhotos.length)

  return (
    <div className={styles.mainContent}>
      <div className={styles.leftColumn}>
        <div className={styles.subsectionButtons}>
          {subsections.map((sub, idx) => (
            <button
              key={sub.key}
              type="button"
              className={`${styles.subsectionBtn} ${selectedSubsection === idx ? styles.subsectionBtnActive : ''}`}
              onClick={() => handleSubsectionClick(idx)}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>
      <div className={`${styles.textBlock} ${sharedStyles.textBlock}`}>
        {content && (
          <>
            <h2 dangerouslySetInnerHTML={{ __html: content.label }} />
            {displayTexts.length > 0 && (
              <p dangerouslySetInnerHTML={{ __html: displayTexts[currentTextIndex] || '' }} />
            )}
            <div className={`${sharedStyles.bottomNav} ${sharedStyles.bottomNavSubMenuId2Or3}`}>
              <button className={`${sharedStyles.btn} ${sharedStyles.btnBack}`} onClick={selectedSubsection !== null ? () => handleSubsectionClick(null) : onBack}>Назад</button>
              {displayTexts.length > 1 && (
                <div className={sharedStyles.textNav}>
                  <button className={sharedStyles.textNavBtn} onClick={handlePrevText} disabled={currentTextIndex === 0} aria-label="Предыдущий текст">
                    <ArrowBackIosNewIcon />
                  </button>
                  <button className={sharedStyles.textNavBtn} onClick={handleNextText} disabled={currentTextIndex === displayTexts.length - 1} aria-label="Следующий текст">
                    <ArrowForwardIosIcon />
                  </button>
                </div>
              )}
              <button className={`${sharedStyles.btn} ${sharedStyles.btnMainMenu}`} onClick={onMainMenu}>Перейти в каталог</button>
            </div>
          </>
        )}
      </div>
      <div className={sharedStyles.galleryBlock}>
        <div className={sharedStyles.galleryWrapper}>
          {hasPhotos ? (
            <PhotoGallery
              photos={currentPhotos}
              showControls={false}
              showArrows={isFullscreen && currentPhotos.length > 1}
              showFullscreen={isFullscreen}
              onCloseFullscreen={() => setIsFullscreen(false)}
              currentIndex={currentPhotoIndex}
              onIndexChange={setCurrentPhotoIndex}
            />
          ) : (
            <div className={sharedStyles.galleryEmpty}>Нет фотографии</div>
          )}
        </div>
        {hasPhotos && (
          <div className={sharedStyles.galleryControls}>
            {currentPhotos.length > 1 && (
              <div className={sharedStyles.galleryNav}>
                <button className={sharedStyles.galleryNavBtn} onClick={handlePrevPhoto} aria-label="Предыдущее фото">
                  <ArrowBackIosNewIcon />
                </button>
                <span className={sharedStyles.galleryCounter}>{currentPhotoIndex + 1} / {currentPhotos.length}</span>
                <button className={sharedStyles.galleryNavBtn} onClick={handleNextPhoto} aria-label="Следующее фото">
                  <ArrowForwardIosIcon />
                </button>
              </div>
            )}
            <button className={sharedStyles.fullscreenBtn} onClick={() => setIsFullscreen(true)} aria-label="Полноэкранный режим">
              <FullscreenIcon fontSize="large" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubMenuScientific
