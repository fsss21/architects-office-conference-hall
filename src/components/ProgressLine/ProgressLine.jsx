import { useState } from 'react'
import styles from './ProgressLine.module.css'

function ProgressLine({ points = [], onPointClick, activeIndex, isSubMenuId2Or3 }) {
  const [internalActive, setInternalActive] = useState(0)
  const isControlled = activeIndex !== undefined && activeIndex !== null
  const activePoint = isControlled ? activeIndex : internalActive

  const handlePointClick = (index) => {
    if (!isControlled) setInternalActive(index)
    if (onPointClick) onPointClick(index)
  }

  return (
    <div className={`${styles.progressLine} ${isSubMenuId2Or3 ? styles.progressLineSubMenuId2Or3 : ''}`}>
      <div className={styles.progressLineLine}>
        {points.map((point, index) => (
          <div
            key={point.id || index}
            className={`${styles.progressLinePoint} ${activePoint === index ? styles.progressLinePointActive : ''
              }`}
            onClick={() => handlePointClick(index)}
          >
            <div
              className={styles.progressLineLabel}
              dangerouslySetInnerHTML={{ __html: point.label || `Точка ${index + 1}` }}
              onClick={(e) => {
                e.stopPropagation()
                handlePointClick(index)
              }}
            />
            <div className={styles.progressLineDot}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressLine

