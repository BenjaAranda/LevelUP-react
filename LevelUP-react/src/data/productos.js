// En: src/data/productos.js
// Base de datos actualizada con las rutas de imagen correctas (desde /public/)

export const productos = [
  // --- Productos que ya tenías ---
  { 
    codigo: "JDM001", 
    img: '/catan.png', 
    nombre: 'Catan', 
    categoria: 'Juegos de Mesa', 
    precio: 29990 
  },
  { 
    codigo: "JDM002", 
    img: '/Carcassonne.png', 
    nombre: 'Carcassonne', 
    categoria: 'Juegos de Mesa', 
    precio: 24990 
  },
  { 
    codigo: "ACC001", 
    img: '/Controlador Xbox Series X.png', 
    nombre: 'Controlador Xbox Series X', 
    categoria: 'Accesorios', 
    precio: 59990 
  },
  { 
    codigo: "ACC002", 
    img: '/Auriculares HyperX Cloud II2.png', 
    nombre: 'Auriculares HyperX Cloud II', 
    categoria: 'Accesorios', 
    precio: 79990 
  },
  { 
    codigo: "CON001", 
    img: '/PlayStation 5.webp', 
    nombre: 'PlayStation 5', 
    categoria: 'Consolas', 
    precio: 549990 
  },
  { 
    codigo: "PCG001", 
    img: '/PC Gamer ASUS ROG Strix.png', 
    nombre: 'PC Gamer ASUS ROG Strix', 
    categoria: 'Computadores Gamers', 
    precio: 1299990 
  },
  { 
    codigo: "SIL001", 
    img: '/Silla Gamer Secretlab Titan.webp', 
    nombre: 'Silla Gamer Secretlab Titan', 
    categoria: 'Sillas Gamers', 
    precio: 349990 
  },
  { 
    codigo: "MOU001", 
    img: '/Mouse Logitech G502 HERO.png', 
    nombre: 'Mouse Logitech G502 HERO', 
    categoria: 'Mouse', 
    precio: 49990 
  },

  // --- Nuevos productos de tu carpeta /public/ ---
  { 
    codigo: "POL001", 
    img: "/Polera Gamer 'Level-Up'.png", 
    nombre: "Polera Gamer 'Level-Up'", 
    categoria: "Poleras", 
    precio: 14990, 
  },
  { 
    codigo: "ACC003", 
    img: '/Mousepad Razer Goliathus.png', 
    nombre: 'Mousepad Razer Goliathus', 
    categoria: 'Accesorios', 
    precio: 19990 
  },
  { 
    codigo: "MOU002", 
    img: '/mouseviper.png', 
    nombre: 'Mouse Razer Viper Mini', 
    categoria: 'Mouse', 
    precio: 34990 
  },
  { 
    codigo: "CON002", 
    img: '/ps5pro.jpg', 
    nombre: 'PlayStation 5 Pro (Rumor)', 
    categoria: 'Consolas', 
    precio: 649990 
  },
  { 
    codigo: "ACC004", 
    img: '/gengar.png', 
    nombre: 'Figura Gengar Pokémon', 
    categoria: 'Accesorios', 
    precio: 22990 
  },
  { 
    codigo: "JG003", 
    img: '/esports.jpeg', 
    nombre: 'Juego eSports Manager 2025', 
    categoria: 'Juegos', 
    precio: 29990 
  }
];

// --- FUNCIÓN PARA OBTENER CATEGORÍAS ---
export const obtenerCategoriasUnicas = () => {
  const todasLasCategorias = productos.map(p => p.categoria);
  const categoriasUnicas = [...new Set(todasLasCategorias)];
  return categoriasUnicas.sort();
};