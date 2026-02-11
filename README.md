# Конкурсный зал — React + CSS Modules

Приложение «Конкурсный зал» на React с Vite и CSS Modules.

## Запуск

```bash
npm install
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`.

## Сборка

```bash
npm run build
```

## Структура

- `src/` — исходный код React-приложения
  - `components/` — компоненты (Header, PhotoGallery, ProgressLine, VideoPreview)
  - `pages/` — страницы (MainMenu, Catalog, CatalogItem)
  - `context/` — контекст фильтров каталога
  - `assets/` — изображения
- `public/data/catalogItems.json` — данные каталога

## Заставка (VideoPreview)

По умолчанию заставка загружает `public/main_page_img.jpg` и `public/main_page_img-4k.jpg`.  
Если файлов нет, отображается кнопка «Пропустить». Можно добавить свои изображения в `public/`.
