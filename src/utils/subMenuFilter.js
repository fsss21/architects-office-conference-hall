/**
 * Универсальная фильтрация контента SubMenu по поиску и фильтрам.
 * Поддерживает поля: author, work, filterIds
 * filterIds — массив id из filterOptions.json (Слова, Даты, Тип документа)
 */

function itemMatchesFilter(item, selectedFilterIds, searchQuery) {
  const q = (searchQuery || '').trim().toLowerCase()
  const hasFilter = Array.isArray(selectedFilterIds) && selectedFilterIds.length > 0

  if (hasFilter) {
    const ids = item?.filterIds
    const noIds = !ids || !Array.isArray(ids) || ids.length === 0
    if (!noIds) {
      const intersects = ids.some((id) => selectedFilterIds.includes(id))
      if (!intersects) return false
    }
  }

  if (q) {
    const author = (item?.author || '').toLowerCase()
    const work = (item?.work || '').toLowerCase()
    const title = (item?.title || '').toLowerCase()
    const label = (item?.label || '').toLowerCase()
    const match =
      author.includes(q) ||
      work.includes(q) ||
      title.includes(q) ||
      (typeof label === 'string' && label.replace(/<[^>]+>/g, '').includes(q))
    if (!match) return false
  }

  return true
}

/**
 * Фильтрует подразделы: оставляет только те, что соответствуют фильтрам.
 * Для subsections с videos — фильтрует видео внутри.
 */
export function filterSubsections(subsections, selectedFilterIds, searchQuery) {
  if (!Array.isArray(subsections)) return []
  return subsections
    .map((sub) => {
      if (!itemMatchesFilter(sub, selectedFilterIds, searchQuery)) return null
      if (Array.isArray(sub.videos) && sub.videos.length > 0) {
        const filteredVideos = sub.videos.filter((v) =>
          itemMatchesFilter(v, selectedFilterIds, searchQuery)
        )
        if (filteredVideos.length === 0) return null
        return { ...sub, videos: filteredVideos }
      }
      return sub
    })
    .filter(Boolean)
}

/**
 * Фильтрует point: возвращает point с отфильтрованными subsections (если есть)
 * или null, если point не соответствует фильтрам.
 */
export function filterPoint(point, selectedFilterIds, searchQuery) {
  if (!point) return null
  if (!itemMatchesFilter(point, selectedFilterIds, searchQuery)) return null
  if (Array.isArray(point.subsections)) {
    const filtered = filterSubsections(point.subsections, selectedFilterIds, searchQuery)
    if (filtered.length === 0) return null
    return { ...point, subsections: filtered }
  }
  return point
}
