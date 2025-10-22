// En: src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './components/AppNavbar.jsx';
// import AppFooter from './components/AppFooter.jsx'; // (Descomenta cuando lo crees)

function App() {
  return (
    <>
      <AppNavbar />
      <main className="py-3">
        {/* Aquí se cargarán tus páginas */}
        <Outlet />
      </main>
      {/* <AppFooter /> */}
    </>
  );
}

export default App;