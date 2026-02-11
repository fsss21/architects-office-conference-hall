import { Routes, Route } from 'react-router-dom'
import { CatalogFilterProvider } from './context/CatalogFilterContext'
import { SubMenuFilterProvider } from './context/SubMenuFilterContext'
import MainMenu from './pages/MainMenu/MainMenu'
import Catalog from './pages/Catalog/Catalog'
import CatalogItem from './pages/CatalogItem/CatalogItem'
import SubMenu from './pages/SubMenu/SubMenu'

function AppContent() {
  return (
    <CatalogFilterProvider>
      <SubMenuFilterProvider>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/submenu" element={<SubMenu />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:id" element={<CatalogItem />} />
      </Routes>
      </SubMenuFilterProvider>
    </CatalogFilterProvider>
  )
}

function App() {
  return <AppContent />
}

export default App
