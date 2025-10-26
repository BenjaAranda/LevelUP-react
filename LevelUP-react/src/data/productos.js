// En: src/data/productos.js (Versión Definitiva Completa)

// --- DATOS INICIALES ---
const productosIniciales = [
  { 
    codigo: "JDM001", 
    img: '/catan.png', 
    nombre: 'Catan', 
    categoria: 'Juegos de Mesa', 
    precio: 29990,
    stock: 15,
    descripcion: "Clásico juego de estrategia y gestión de recursos." 
  },
   { 
    codigo: "JDM002", 
    img: '/Carcassonne.png', 
    nombre: 'Carcassonne', 
    categoria: 'Juegos de Mesa', 
    precio: 24990,
    stock: 20,
    descripcion: "Construye paisajes medievales con losetas."
  },
  { 
    codigo: "ACC001", 
    img: '/Controlador Xbox Series X.png', 
    nombre: 'Controlador Xbox Series X', 
    categoria: 'Accesorios', 
    precio: 59990,
    stock: 30,
    descripcion: "Controlador inalámbrico oficial para Xbox Series X/S y PC."
  },
  { 
    codigo: "ACC002", 
    img: '/Auriculares HyperX Cloud II2.png', 
    nombre: 'Auriculares HyperX Cloud II', 
    categoria: 'Accesorios', 
    precio: 79990,
    stock: 18,
    descripcion: "Auriculares gaming con sonido envolvente 7.1 virtual."
  },
  { 
    codigo: "CON001", 
    img: '/PlayStation 5.webp', 
    nombre: 'PlayStation 5', 
    categoria: 'Consolas', 
    precio: 549990,
    stock: 5,
    descripcion: "Consola de nueva generación con SSD ultrarrápido."
  },
  { 
    codigo: "PCG001", 
    img: '/PC Gamer ASUS ROG Strix.png', 
    nombre: 'PC Gamer ASUS ROG Strix', 
    categoria: 'Computadores Gamers', 
    precio: 1299990,
    stock: 3,
    descripcion: "PC de alto rendimiento para gaming extremo."
  },
  { 
    codigo: "SIL001", 
    img: '/Silla Gamer Secretlab Titan.webp', 
    nombre: 'Silla Gamer Secretlab Titan', 
    categoria: 'Sillas Gamers', 
    precio: 349990,
    stock: 10,
    descripcion: "Silla ergonómica premium para máxima comodidad."
  },
  { 
    codigo: "MOU001", 
    img: '/Mouse Logitech G502 HERO.png', 
    nombre: 'Mouse Logitech G502 HERO', 
    categoria: 'Mouse', 
    precio: 49990,
    stock: 40,
    descripcion: "Mouse gaming con sensor HERO 25K y peso ajustable."
  },
  { 
    codigo: "POL001", 
    img: "/Polera Gamer 'Level-Up'.png", 
    nombre: "Polera Gamer 'Level-Up'", 
    categoria: "Poleras", 
    precio: 14990,
    stock: 50, 
    descripcion: "Polera personalizada con diseño gamer exclusivo." 
  },
  { 
    codigo: "ACC003", 
    img: '/Mousepad Razer Goliathus.png', 
    nombre: 'Mousepad Razer Goliathus', 
    categoria: 'Accesorios', 
    precio: 19990,
    stock: 60 
  },
  { 
    codigo: "MOU002", 
    img: '/mouseviper.png', 
    nombre: 'Mouse Razer Viper Mini', 
    categoria: 'Mouse', 
    precio: 34990,
    stock: 35 
  },
  { 
    codigo: "CON002", 
    img: '/ps5pro.jpg', 
    nombre: 'PlayStation 5 Pro (Rumor)', 
    categoria: 'Consolas', 
    precio: 649990,
    stock: 0 
  },
  { 
    codigo: "ACC004", 
    img: '/gengar.png', 
    nombre: 'Figura Gengar Pokémon', 
    categoria: 'Accesorios', 
    precio: 22990,
    stock: 22 
  },
  { 
    codigo: "JG003", 
    img: '/esports.jpeg', 
    nombre: 'Juego eSports Manager 2025', 
    categoria: 'Juegos', 
    precio: 29990,
    stock: 15 
  }
];

// --- FUNCIONES CRUD PRODUCTOS ---

export const getProductos = () => {
  const productosGuardados = localStorage.getItem("productos");
  if (!productosGuardados) {
    localStorage.setItem("productos", JSON.stringify(productosIniciales));
    return productosIniciales;
  }
  try {
    const parsedProductos = JSON.parse(productosGuardados);
    return Array.isArray(parsedProductos) ? parsedProductos : productosIniciales;
  } catch (error) {
    console.error("Error parsing productos from localStorage:", error);
    localStorage.setItem("productos", JSON.stringify(productosIniciales));
    return productosIniciales;
  }
};

export const saveProductos = (productos) => {
  if (!Array.isArray(productos)) return;
  try {
    localStorage.setItem("productos", JSON.stringify(productos));
  } catch (error) {
    console.error("Error saving productos to localStorage:", error);
  }
};

export const getProductoPorCodigo = (codigo) => {
  return getProductos().find(p => p.codigo === codigo);
};

export const agregarProducto = (nuevoProducto) => {
  const productos = getProductos();
  if (productos.some(p => p.codigo === nuevoProducto.codigo)) {
    throw new Error(`El código ${nuevoProducto.codigo} ya existe.`);
  }
  nuevoProducto.precio = Number(nuevoProducto.precio) || 0;
  nuevoProducto.stock = Number(nuevoProducto.stock) || 0;
  const nuevaLista = [...productos, nuevoProducto];
  saveProductos(nuevaLista);
  return nuevaLista; 
};

export const actualizarProducto = (productoActualizado) => {
  const productos = getProductos();
  const index = productos.findIndex(p => p.codigo === productoActualizado.codigo);
  if (index === -1) {
    throw new Error(`Producto con código ${productoActualizado.codigo} no encontrado.`);
  }
  productoActualizado.precio = Number(productoActualizado.precio) || 0;
  productoActualizado.stock = Number(productoActualizado.stock) || 0;
  const nuevaLista = [...productos];
  nuevaLista[index] = productoActualizado;
  saveProductos(nuevaLista);
  return nuevaLista; 
};

export const eliminarProducto = (codigo) => {
  const productos = getProductos();
  const nuevaLista = productos.filter(p => p.codigo !== codigo);
  saveProductos(nuevaLista);
  return nuevaLista; 
};

// --- FUNCIONES CRUD CATEGORÍAS ---

const CATEGORIAS_KEY = 'categorias'; 

// Obtener todas las categorías guardadas
export const getCategorias = () => {
  const categoriasGuardadas = localStorage.getItem(CATEGORIAS_KEY);
  if (categoriasGuardadas) {
    try {
      const parsed = JSON.parse(categoriasGuardadas);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed.sort(); 
      }
    } catch (error) {
      console.error("Error parsing categorías:", error);
    }
  }
  // Fallback: extraer de productos iniciales y guardar
  const categoriasIniciales = [...new Set(productosIniciales.map(p => p.categoria))].sort();
  localStorage.setItem(CATEGORIAS_KEY, JSON.stringify(categoriasIniciales));
  return categoriasIniciales;
};

// Guardar la lista completa de categorías
const saveCategorias = (categorias) => {
  if (!Array.isArray(categorias)) return [];
  const categoriasUnicasOrdenadas = [...new Set(categorias)].sort();
  try {
    localStorage.setItem(CATEGORIAS_KEY, JSON.stringify(categoriasUnicasOrdenadas));
  } catch (error) {
    console.error("Error saving categorías:", error);
  }
  return categoriasUnicasOrdenadas; 
};

// --- ¡ASEGÚRATE QUE ESTAS FUNCIONES ESTÉN EXPORTADAS! ---
// Agregar una nueva categoría
export const agregarCategoria = (nuevaCategoriaNombre) => {
  if (!nuevaCategoriaNombre || typeof nuevaCategoriaNombre !== 'string' || nuevaCategoriaNombre.trim() === '') {
      throw new Error("El nombre de la categoría no puede estar vacío.");
  }
  const nombreLimpio = nuevaCategoriaNombre.trim();
  const categoriasActuales = getCategorias();
  if (categoriasActuales.some(cat => cat.toLowerCase() === nombreLimpio.toLowerCase())) {
    throw new Error(`La categoría "${nombreLimpio}" ya existe.`);
  }
  const nuevaLista = [...categoriasActuales, nombreLimpio];
  return saveCategorias(nuevaLista); 
};

// Eliminar una categoría
export const eliminarCategoria = (categoriaAEliminar) => {
  const categoriasActuales = getCategorias();
  const nuevaLista = categoriasActuales.filter(cat => cat !== categoriaAEliminar);
  return saveCategorias(nuevaLista); 
};

// Actualizar el nombre de una categoría existente
export const actualizarCategoria = (nombreViejo, nombreNuevo) => {
  if (!nombreViejo || !nombreNuevo || typeof nombreNuevo !== 'string' || nombreNuevo.trim() === '') {
      throw new Error("Los nombres de categoría no pueden estar vacíos.");
  }
  const nombreLimpioNuevo = nombreNuevo.trim();
  const categoriasActuales = getCategorias();

  // Verificar si el nombre viejo existe
  const index = categoriasActuales.findIndex(cat => cat === nombreViejo);
  if (index === -1) {
    throw new Error(`La categoría "${nombreViejo}" no existe y no se puede actualizar.`);
  }

  // Verificar si el nombre nuevo ya existe (y no es el mismo que el viejo)
  if (nombreViejo.toLowerCase() !== nombreLimpioNuevo.toLowerCase() && categoriasActuales.some(cat => cat.toLowerCase() === nombreLimpioNuevo.toLowerCase())) {
    throw new Error(`La categoría "${nombreLimpioNuevo}" ya existe.`);
  }

  // Actualizar la lista
  const nuevaLista = [...categoriasActuales];
  nuevaLista[index] = nombreLimpioNuevo; // Reemplaza el nombre viejo por el nuevo
  return saveCategorias(nuevaLista); // Guarda y devuelve la lista actualizada
};
// --- FIN FUNCIONES CATEGORÍAS ---

// Obtener categorías únicas (ahora usa getCategorias)
export const obtenerCategoriasUnicas = () => {
  return getCategorias(); 
};

// --- NO EXPORTAR 'productos' DIRECTAMENTE ---