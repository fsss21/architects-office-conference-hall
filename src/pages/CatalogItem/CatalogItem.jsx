import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery'
import Header from '../../components/Header/Header'
import styles from './CatalogItem.module.css'
import catalogItemImg from '../../assets/catalog_item_img.png'
import catalogItemImg4k from '../../assets/catalog_item_img-4k.png'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

function CatalogItem() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [imageSrc, setImageSrc] = useState(catalogItemImg)
  const [imageByIdLoadError, setImageByIdLoadError] = useState(false)


  useEffect(() => {
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? catalogItemImg4k : catalogItemImg)

    setLoading(true)
    setNotFound(false)
    const controller = new AbortController()
    fetch('/data/catalogItems.json', { signal: controller.signal })
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        const list = Array.isArray(data) ? data : []
        const foundItem = list.find(i => i.id === parseInt(id, 10))
        setItem(foundItem ?? null)
        setNotFound(!foundItem)
        setCurrentTextIndex(0)
        setCurrentPhotoIndex(0)
        setImageByIdLoadError(false)
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.error('Error loading catalog item:', err)
        setNotFound(true)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [id])

  const handleBack = () => {
    navigate('/catalog')
  }

  const handleFullscreen = () => {
    setShowFullscreen(true)
  }

  const handleCloseFullscreen = () => {
    setShowFullscreen(false)
  }

  const handleNextText = () => {
    if (item && item.texts && item.texts.length > 0) {
      if (currentTextIndex < item.texts.length - 1) {
        setCurrentTextIndex((prev) => prev + 1)
      }
    }
  }

  const handlePrevText = () => {
    if (currentTextIndex > 0) {
      setCurrentTextIndex((prev) => prev - 1)
    }
  }

  const hasPhotosFromData = Array.isArray(item?.photos) && item.photos.length > 0
  const imageByIdPath = item ? `/images/${item.id}.jpg` : null

  const handleNextPhoto = () => {
    if (hasPhotosFromData && item.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % item.photos.length)
    }
  }

  const handlePrevPhoto = () => {
    if (hasPhotosFromData && item.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + item.photos.length) % item.photos.length)
    }
  }

  if (loading) {
    return (
      <div className={styles.catalogItemPage}>
        <Header />
        <div className={styles.catalogItemContent}>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  if (notFound || !item) {
    return (
      <div className={styles.catalogItemPage}>
        <Header />
        <div className={styles.catalogItemContent}>
          <p>Произведение не найдено.</p>
          <button type="button" className={styles.catalogItemBackLink} onClick={() => navigate('/catalog')}>
            Вернуться в каталог
          </button>
        </div>
      </div>
    )
  }

  const currentTexts = item.texts || [item.description || '']

  return (
    <div className={styles.catalogItemPage}>
      <div
        className={styles.catalogItemBackground}
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <Header />
      <div className={styles.catalogItemContent}>
        <div className={styles.catalogItemMain}>
          {/* Левая колонка - текст */}
          <div className={styles.catalogItemTextBlock}>
            <h1 className={styles.catalogItemName}>{item.name}</h1>

            {item.sculptor && (
              <div className={styles.catalogItemInfoRow}>
                <span className={styles.catalogItemInfoLabel}>Скульптор:</span>
                <span className={styles.catalogItemInfoValue}>{item.sculptor}</span>
              </div>
            )}

            {item.creationTime && (
              <div className={styles.catalogItemInfoRow}>
                <span className={styles.catalogItemInfoLabel}>Время создания:</span>
                <span className={styles.catalogItemInfoValue}>{item.creationTime}</span>
              </div>
            )}

            {item.location && (
              <div className={styles.catalogItemInfoRow}>
                <span className={styles.catalogItemInfoLabel}>Место:</span>
                <span className={styles.catalogItemInfoValue}>{item.location}</span>
              </div>
            )}

            <div
              className={styles.catalogItemDescription}
              dangerouslySetInnerHTML={{ __html: `<p>${currentTexts[currentTextIndex] || ''}</p>` }}
            />

            {/* Навигация текста */}
            {currentTexts.length > 1 && (
              <div className={styles.catalogItemTextNavigation}>
                <div className={styles.catalogItemTextCounter}>
                  {currentTextIndex + 1} / {currentTexts.length}
                </div>
                <div className={styles.catalogItemTextArrows}>
                  <button
                    className={styles.catalogItemTextNavBtn}
                    onClick={handlePrevText}
                    disabled={currentTextIndex === 0}
                    aria-label="Предыдущий текст"
                  >
                    <ArrowBackIosNewIcon />
                  </button>
                  <button
                    className={styles.catalogItemTextNavBtn}
                    onClick={handleNextText}
                    disabled={currentTextIndex === currentTexts.length - 1}
                    aria-label="Следующий текст"
                  >
                    <ArrowForwardIosIcon />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Правая колонка - фото (60-65% ширины) */}
          <div className={styles.catalogItemPhotoBlock}>
            <div className={styles.catalogItemGallery}>
              {hasPhotosFromData ? (
                <PhotoGallery
                  photos={item.photos}
                  showFullscreen={showFullscreen}
                  onCloseFullscreen={handleCloseFullscreen}
                  showControls={false}
                  showArrows={false}
                  currentIndex={currentPhotoIndex}
                  onIndexChange={setCurrentPhotoIndex}
                />
              ) : imageByIdPath && !imageByIdLoadError ? (
                <img
                  src={imageByIdPath}
                  alt={item.name}
                  className={styles.catalogItemImageById}
                  onError={() => setImageByIdLoadError(true)}
                />
              ) : (
                <div className={styles.catalogItemPhotoEmpty}>Нет фотографии</div>
              )}
            </div>
            {hasPhotosFromData && (
              <div className={styles.catalogItemPhotoNavigation}>
                {item.photos.length > 1 && (
                  <>
                    <button
                      className={styles.catalogItemPhotoNavBtn}
                      onClick={handlePrevPhoto}
                      aria-label="Предыдущее фото"
                    >
                      <ArrowBackIosNewIcon />
                    </button>
                    <div className={styles.catalogItemPhotoCounter}>
                      {currentPhotoIndex + 1} / {item.photos.length}
                    </div>
                    <button
                      className={styles.catalogItemPhotoNavBtn}
                      onClick={handleNextPhoto}
                      aria-label="Следующее фото"
                    >
                      <ArrowForwardIosIcon />
                    </button>
                  </>
                )}
                <button
                  className={styles.catalogItemFullscreenBtn}
                  onClick={handleFullscreen}
                  aria-label="Полноэкранный режим"
                >
                  <FullscreenIcon fontSize='large' />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatalogItem
