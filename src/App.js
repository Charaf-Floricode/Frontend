import React, { useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GpcAutomation from './pages/GpcAutomation';
import Biocertificate from './pages/Biocertificate';
import RoyalFloraHolland from './pages/RFH';
import PlantionCode from './pages/Plantion';
import EdiBulbCodering from './pages/Edibulb'
import OmzetDashboard from './pages/OmzetDashboard';
import { AuthProvider } from "./Authentication/AuthContext";
import RequireAuth      from "./Authentication/RequireAuth";
import Login from "./pages/Login"
import FinancienPage from "./pages/Financien";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="app-layout">
      <Header
        isOpen={sidebarOpen}
        onBurgerClick={() => setSidebarOpen(o => !o)}
      />
        <div className="content-area">
          <Sidebar isOpen={sidebarOpen} />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* everything BELOW is protected */}
              <Route element={<RequireAuth> <Home /> </RequireAuth>} path="/" />
              <Route element={<RequireAuth> <GpcAutomation /> </RequireAuth>}      path="/gpc-automatisering" />
              <Route element={<RequireAuth> <Biocertificate /> </RequireAuth>}      path="/biocertificaat" />
              <Route element={<RequireAuth> <RoyalFloraHolland/> </RequireAuth>}    path="/bedrijflocatie" />
              <Route element={<RequireAuth> <PlantionCode/> </RequireAuth>}         path="/plantion" />
              <Route element={<RequireAuth> <OmzetDashboard/> </RequireAuth>}       path="/omzet" />
               <Route element={<RequireAuth> <FinancienPage/> </RequireAuth>} path="/financien" />
               <Route element={<RequireAuth> <EdiBulbCodering/> </RequireAuth>} path="/edibulb" />
               
            </Routes>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
