import { useState, useEffect } from 'react'
import PhotoGallery from '../../../components/PhotoGallery/PhotoGallery'
import sharedStyles from '../SubMenuShared.module.css'
import styles from './SubMenuDefault.module.css'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

function SubMenuDefault({ point, onBack, onMainMenu }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    setCurrentTextIndex(0)
    setCurrentPhotoIndex(0)
  }, [point])

  const photos = point?.photos || []
  const texts = point?.texts || []
  const displayTexts = Array.isArray(texts) ? texts : texts.length ? [texts] : []

  const handlePrevText = () => setCurrentTextIndex(i => Math.max(0, i - 1))
  const handleNextText = () => setCurrentTextIndex(i => Math.min(displayTexts.length - 1, i + 1))
  const handlePrevPhoto = () => setCurrentPhotoIndex(i => (i - 1 + photos.length) % photos.length)
  const handleNextPhoto = () => setCurrentPhotoIndex(i => (i + 1) % photos.length)

  const hasPhotos = photos.length > 0

  return (
    <div className={styles.mainContent}>
      <div className={styles.leftColumn}>
        <div className={styles.leftPlaceholder} aria-hidden="true" />
      </div>
      <div className={styles.menu}>
        <div className={`${styles.textBlock} ${sharedStyles.textBlock}`}>
          <h2 dangerouslySetInnerHTML={{ __html: point?.label || '' }} />
          {displayTexts.length > 0 && (
            <p dangerouslySetInnerHTML={{ __html: displayTexts[currentTextIndex] || '' }} />
          )}
          <div className={`${sharedStyles.bottomNav} ${sharedStyles.bottomNavSubMenuId2Or3}`}>
            {!hasPhotos ? (
              <>
                <button className={`${sharedStyles.btn} ${sharedStyles.btnBack}`} onClick={onBack}>Назад</button>
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
              </>
            ) : (
              <>
                <div className={sharedStyles.controlsNavMenu}>
                  <button className={`${sharedStyles.btn} ${sharedStyles.btnBack}`} onClick={onBack}>Назад</button>
                  <button className={`${sharedStyles.btn} ${sharedStyles.btnMainMenu}`} onClick={onMainMenu}>Перейти в каталог</button>
                </div>
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
              </>
            )}
          </div>
        </div>
      </div>
      <div className={sharedStyles.galleryBlock}>
        <div className={sharedStyles.galleryWrapper}>
          {hasPhotos ? (
            <PhotoGallery
              photos={photos}
              showControls={false}
              showArrows={isFullscreen}
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
            <div className={sharedStyles.galleryNav}>
              <button className={sharedStyles.galleryNavBtn} onClick={handlePrevPhoto} disabled={photos.length <= 1} aria-label="Предыдущее фото">
                <ArrowBackIosNewIcon />
              </button>
              <span className={sharedStyles.galleryCounter}>{currentPhotoIndex + 1} / {photos.length}</span>
              <button className={sharedStyles.galleryNavBtn} onClick={handleNextPhoto} disabled={photos.length <= 1} aria-label="Следующее фото">
                <ArrowForwardIosIcon />
              </button>
            </div>
            <button className={sharedStyles.fullscreenBtn} onClick={() => setIsFullscreen(true)} aria-label="Полноэкранный режим">
              <FullscreenIcon fontSize="large" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubMenuDefault
