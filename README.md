# Конкурсный зал — React + CSS Modules
**2.07 Конференц Зал**
Приложение «Конкурсный зал» (архитектурный музей) на React, Vite, CSS Modules и MUI.

## Запуск

```bash
npm install
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173` (или следующему свободному порту).

## Сборка

```bash
npm run build
```

Результат сборки — папка `build/`.

## Сервер (продакшен)

После сборки можно запустить локальный сервер для раздачи статики:

```bash
npm run build
npm run server
```

Сервер запустится на `http://localhost:3001` и автоматически откроет браузер в отдельном окне.

### Сборка exe для Windows

```bash
npm run build:win
```

Создаётся `build/launch.exe` — автономный запускатель приложения (Node + статика внутри).

## Структура проекта

```
src/
├── components/     — Header, PhotoGallery, ProgressLine, VideoPreview
├── pages/          — MainMenu, SubMenu, Catalog, CatalogItem
├── context/        — CatalogFilterContext, SubMenuFilterContext
├── utils/          — subMenuFilter
├── assets/         — изображения для меню и каталога
└── server/         — сервер для раздачи build/ (Express)
```

## Маршруты

- `/` — главное меню
- `/submenu` — подменю (разделы: по умолчанию, научная деятельность, видео)
- `/catalog` — каталог с фильтрами
- `/catalog/:id` — карточка предмета каталога

## Данные

Файлы в `public/data/`:

- `catalogItems.json` — элементы каталога
- `progressPoints.json` — пункты прогресса на главном меню
- `filterOptions.json` — опции фильтров (слова, даты, типы документов)
