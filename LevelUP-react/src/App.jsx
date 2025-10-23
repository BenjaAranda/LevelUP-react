// En: src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- Outlet se queda
import AppNavbar from './components/AppNavbar.jsx';
import AppFooter from './components/AppFooter.jsx';

function App() {
  return (
    <>
      <AppNavbar />
      <main className="py-3">
        {/* Aquí se cargarán las páginas hijas (Login, Home, etc) */}
        <Outlet /> 
      </main>
      <AppFooter />
    </>
  );
}

export default App;