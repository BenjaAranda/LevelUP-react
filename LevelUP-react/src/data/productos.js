// En: src/data/productos.js

// --- DATOS INICIALES (TU LISTA DE PRODUCTOS) ---
// Se usarán si localStorage está vacío.
const productosIniciales = [
  // --- Productos que ya tenías ---
  { 
    codigo: "JDM001", 
    img: '/catan.png', 
    nombre: 'Catan', 
    categoria: 'Juegos de Mesa', 
    precio: 29990,
    stock: 15 // Añadido stock (ejemplo)
  },
  { 
    codigo: "JDM002", 
    img: '/Carcassonne.png', 
    nombre: 'Carcassonne', 
    categoria: 'Juegos de Mesa', 
    precio: 24990,
    stock: 20 // Añadido stock (ejemplo)
  },
  { 
    codigo: "ACC001", 
    img: '/Controlador Xbox Series X.png', 
    nombre: 'Controlador Xbox Series X', 
    categoria: 'Accesorios', 
    precio: 59990,
    stock: 30 // Añadido stock (ejemplo)
  },
  { 
    codigo: "ACC002", 
    img: '/Auriculares HyperX Cloud II2.png', 
    nombre: 'Auriculares HyperX Cloud II', 
    categoria: 'Accesorios', 
    precio: 79990,
    stock: 18 // Añadido stock (ejemplo)
  },
  { 
    codigo: "CON001", 
    img: '/PlayStation 5.webp', 
    nombre: 'PlayStation 5', 
    categoria: 'Consolas', 
    precio: 549990,
    stock: 5 // Añadido stock (ejemplo)
  },
  { 
    codigo: "PCG001", 
    img: '/PC Gamer ASUS ROG Strix.png', 
    nombre: 'PC Gamer ASUS ROG Strix', 
    categoria: 'Computadores Gamers', 
    precio: 1299990,
    stock: 3 // Añadido stock (ejemplo)
  },
  { 
    codigo: "SIL001", 
    img: '/Silla Gamer Secretlab Titan.webp', 
    nombre: 'Silla Gamer Secretlab Titan', 
    categoria: 'Sillas Gamers', 
    precio: 349990,
    stock: 10 // Añadido stock (ejemplo)
  },
  { 
    codigo: "MOU001", 
    img: '/Mouse Logitech G502 HERO.png', 
    nombre: 'Mouse Logitech G502 HERO', 
    categoria: 'Mouse', 
    precio: 49990,
    stock: 40 // Añadido stock (ejemplo)
  },
  // --- Nuevos productos ---
  { 
    codigo: "POL001", 
    img: "/Polera Gamer 'Level-Up'.png", 
    nombre: "Polera Gamer 'Level-Up'", 
    categoria: "Poleras", 
    precio: 14990,
    stock: 50, // Añadido stock (ejemplo)
    descripcion: "Polera personalizada con diseño gamer exclusivo." // Añadida descripción
  },
  { 
    codigo: "ACC003", 
    img: '/Mousepad Razer Goliathus.png', 
    nombre: 'Mousepad Razer Goliathus', 
    categoria: 'Accesorios', 
    precio: 19990,
    stock: 60 // Añadido stock (ejemplo)
  },
  { 
    codigo: "MOU002", 
    img: '/mouseviper.png', 
    nombre: 'Mouse Razer Viper Mini', 
    categoria: 'Mouse', 
    precio: 34990,
    stock: 35 // Añadido stock (ejemplo)
  },
  { 
    codigo: "CON002", 
    img: '/ps5pro.jpg', 
    nombre: 'PlayStation 5 Pro (Rumor)', 
    categoria: 'Consolas', 
    precio: 649990,
    stock: 0 // Añadido stock (ejemplo)
  },
  { 
    codigo: "ACC004", 
    img: '/gengar.png', 
    nombre: 'Figura Gengar Pokémon', 
    categoria: 'Accesorios', 
    precio: 22990,
    stock: 22 // Añadido stock (ejemplo)
  },
  { 
    codigo: "JG003", 
    img: '/esports.jpeg', 
    nombre: 'Juego eSports Manager 2025', 
    categoria: 'Juegos', 
    precio: 29990,
    stock: 15 // Añadido stock (ejemplo)
  }
];

// --- FUNCIONES CRUD PARA LOCALSTORAGE ---

// Obtener todos los productos
export const getProductos = () => {
  const productosGuardados = localStorage.getItem("productos");
  // Si no hay nada guardado o no es un array válido, guarda y devuelve los iniciales
  if (!productosGuardados) {
    console.log("No se encontraron productos en localStorage, cargando iniciales.");
    localStorage.setItem("productos", JSON.stringify(productosIniciales));
    return productosIniciales;
  }
  try {
    const parsedProductos = JSON.parse(productosGuardados);
    // Verificación extra: Asegura que sea un array
    if (!Array.isArray(parsedProductos)) {
        console.warn("Datos en localStorage para 'productos' no son un array, cargando iniciales.");
        localStorage.setItem("productos", JSON.stringify(productosIniciales));
        return productosIniciales;
    }
    return parsedProductos;
  } catch (error) {
    console.error("Error al parsear productos de localStorage:", error);
    // Si hay error al parsear, devuelve los iniciales como fallback
    localStorage.setItem("productos", JSON.stringify(productosIniciales));
    return productosIniciales;
  }
};

// Guardar la lista completa de productos
export const saveProductos = (productos) => {
  // Asegura que siempre se guarde un array
  if (!Array.isArray(productos)) {
      console.error("Se intentó guardar algo que no es un array en localStorage para 'productos'.");
      return;
  }
  try {
    localStorage.setItem("productos", JSON.stringify(productos));
  } catch (error) {
    console.error("Error al guardar productos en localStorage:", error);
  }
};

// Obtener un producto por su código
export const getProductoPorCodigo = (codigo) => {
  const productos = getProductos();
  return productos.find(p => p.codigo === codigo);
};

// Agregar un nuevo producto
export const agregarProducto = (nuevoProducto) => {
  const productos = getProductos();
  // Validación para evitar duplicados
  if (productos.some(p => p.codigo === nuevoProducto.codigo)) {
    throw new Error(`El código ${nuevoProducto.codigo} ya existe.`);
  }
  // Asegura que stock y precio sean números válidos
  nuevoProducto.precio = Number(nuevoProducto.precio) || 0;
  nuevoProducto.stock = Number(nuevoProducto.stock) || 0;

  const nuevaLista = [...productos, nuevoProducto];
  saveProductos(nuevaLista);
  return nuevaLista; // Devuelve la lista actualizada
};

// Actualizar un producto existente
export const actualizarProducto = (productoActualizado) => {
  const productos = getProductos();
  const index = productos.findIndex(p => p.codigo === productoActualizado.codigo);
  if (index === -1) {
    throw new Error(`Producto con código ${productoActualizado.codigo} no encontrado para actualizar.`);
  }
  // Asegura que stock y precio sean números válidos
  productoActualizado.precio = Number(productoActualizado.precio) || 0;
  productoActualizado.stock = Number(productoActualizado.stock) || 0;

  const nuevaLista = [...productos];
  nuevaLista[index] = productoActualizado;
  saveProductos(nuevaLista);
  return nuevaLista; // Devuelve la lista actualizada
};

// Eliminar un producto por código
export const eliminarProducto = (codigo) => {
  const productos = getProductos();
  const nuevaLista = productos.filter(p => p.codigo !== codigo);
  if (nuevaLista.length === productos.length) {
     console.warn(`Producto con código ${codigo} no encontrado para eliminar.`);
  }
  saveProductos(nuevaLista);
  return nuevaLista; // Devuelve la lista actualizada
};


// Obtener categorías únicas
export const obtenerCategoriasUnicas = () => {
  const productos = getProductos(); 
  const todasLasCategorias = productos.map(p => p.categoria);
  const categoriasUnicas = [...new Set(todasLasCategorias)];
  return categoriasUnicas.sort();
};

// Exportamos también la lista actual para componentes que la necesiten directamente
// OJO: Esta variable 'productos' solo refleja el estado al momento de importar el archivo.
// Es MEJOR usar getProductos() dentro de los componentes para asegurar datos actualizados.
export const productos = getProductos();