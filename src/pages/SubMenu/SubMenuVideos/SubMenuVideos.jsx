import { useState, useEffect } from 'react'
import PhotoGallery from '../../../components/PhotoGallery/PhotoGallery'
import sharedStyles from '../SubMenuShared.module.css'
import styles from './SubMenuVideos.module.css'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

const VIDEOS_PER_PAGE = 6

function SubMenuVideos({ point, onBack, onMainMenu, onSubsectionChange }) {
  const [selectedSubsection, setSelectedSubsection] = useState(null)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [videoPage, setVideoPage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const subsections = point?.subsections || []
  const content = selectedSubsection === null ? point : subsections[selectedSubsection]
  const currentVideos = content?.videos || []
  const currentPhotos = content?.photos ?? point?.photos ?? []
  const isVideoMode = currentVideos.length > 0
  const hasPhotos = currentPhotos.length > 0

  useEffect(() => {
    setSelectedSubsection(null)
    setCurrentTextIndex(0)
    setCurrentPhotoIndex(0)
    setVideoPage(0)
    onSubsectionChange?.(false)
  }, [point, onSubsectionChange])

  useEffect(() => {
    onSubsectionChange?.(selectedSubsection !== null)
  }, [selectedSubsection, onSubsectionChange])

  const paginatedVideos = currentVideos.slice(
    videoPage * VIDEOS_PER_PAGE,
    (videoPage + 1) * VIDEOS_PER_PAGE
  )
  const totalPages = Math.ceil(currentVideos.length / VIDEOS_PER_PAGE)
  const hasPrevVideoPage = videoPage > 0
  const hasNextVideoPage = videoPage < totalPages - 1

  const displayTexts = Array.isArray(content?.texts) ? content.texts : (content?.texts ? [content.texts] : [])

  const handleSubsectionClick = (idx) => {
    setSelectedSubsection(idx)
    setCurrentTextIndex(0)
    setCurrentPhotoIndex(0)
    setVideoPage(0)
  }
  const handlePrevPhoto = () => setCurrentPhotoIndex(i => (i - 1 + currentPhotos.length) % currentPhotos.length)
  const handleNextPhoto = () => setCurrentPhotoIndex(i => (i + 1) % currentPhotos.length)
  const handlePrevText = () => setCurrentTextIndex(i => Math.max(0, i - 1))
  const handleNextText = () => setCurrentTextIndex(i => Math.min(displayTexts.length - 1, i + 1))
  const handlePrevVideoPage = () => setVideoPage(p => Math.max(0, p - 1))
  const handleNextVideoPage = () => setVideoPage(p => Math.min(totalPages - 1, p + 1))

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

      {isVideoMode ? (
        <div className={styles.videoBlock}>

          <div className={styles.videoGrid}>
            {paginatedVideos.map((v) => (
              <div key={v.id} className={styles.videoCard}>
                <div className={styles.videoThumb} style={{ backgroundImage: v.url ? `url(${v.url})` : undefined }} />
                <span className={styles.videoTitle}>{v.title}</span>
              </div>
            ))}
          </div>
          <div className={styles.videoPagination}>
            <button className={styles.videoPageBtn} onClick={handlePrevVideoPage} disabled={!hasPrevVideoPage} aria-label="Предыдущая страница">
              <ArrowBackIosNewIcon />
            </button>
            <button className={styles.videoPageBtn} onClick={handleNextVideoPage} disabled={!hasNextVideoPage} aria-label="Следующая страница">
              <ArrowForwardIosIcon />
            </button>
          </div>
          <div className={styles.videoBottomNav}>
            <button className={`${sharedStyles.btn} ${sharedStyles.btnBack}`} onClick={selectedSubsection !== null ? () => handleSubsectionClick(null) : onBack}>Назад</button>
            <button className={`${sharedStyles.btn} ${sharedStyles.btnMainMenu}`} onClick={onMainMenu}>Перейти в каталог</button>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

export default SubMenuVideos
