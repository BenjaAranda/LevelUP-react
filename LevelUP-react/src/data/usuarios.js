// En: src/data/usuarios.js

const USUARIOS_KEY = 'usuarios'; // Clave en localStorage

// --- DATOS INICIALES (Integrados desde tu archivo usuariosDePrueba.js) ---
const usuariosIniciales = [
  {
    nombre: "Admin",
    email: "admin@levelup.com",
    password: "admin123",
    isAdmin: true,
    edad: 99, // Añadida edad por consistencia
    descuento: false // Añadido descuento por consistencia
  },
  {
    nombre: "Exsairs", // Añadido tu otro admin
    email: "exsairs@gmail.com",
    password: "Dreikdreik1",
    isAdmin: true,
    edad: 99, // Añadida edad por consistencia
    descuento: false // Añadido descuento por consistencia
  },
  {
    nombre: "Benja",
    edad: 20,
    email: "benjaprogramador@gmail.com",
    password: "Contraseña123",
    descuento: false,
    isAdmin: false
  },
  {
    nombre: "Estudiante DUOC",
    edad: 20,
    email: "estudianteDuoc@duocuc.cl",
    password: "Contraseña123",
    descuento: true,
    isAdmin: false
  }
];


// --- FUNCIONES CRUD PARA USUARIOS ---

// Obtener todos los usuarios
export const getUsuarios = () => {
  const data = localStorage.getItem(USUARIOS_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.every(u => u && u.email)) {
           // Asegurar que todos tengan isAdmin y descuento
           parsed.forEach(u => {
               if (u.isAdmin === undefined) { u.isAdmin = (u.email === "admin@levelup.com" || u.email === "exsairs@gmail.com"); } // Ajustado para ambos admins
               if (u.descuento === undefined) { u.descuento = u.email.endsWith("@duocuc.cl"); }
               if (u.edad === undefined && u.isAdmin) { u.edad = 99; } // Añadir edad a admins si falta
           });
           return parsed;
       }
    } catch (e) { console.error("Error parsing usuarios:", e); }
  }
  // Si no hay datos o están corruptos, inicializa con los de prueba
  console.log("Inicializando usuarios en localStorage.");
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosIniciales));
  return usuariosIniciales;
};

// Guardar la lista completa de usuarios
export const saveUsuarios = (usuarios) => {
  if (!Array.isArray(usuarios)) return;
  try {
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  } catch (e) { console.error("Error saving usuarios:", e); }
};

// Actualizar un usuario (usado por Admin)
export const actualizarUsuarioAdmin = (usuarioActualizado) => {
    const usuarios = getUsuarios();
    const index = usuarios.findIndex(u => u.email === usuarioActualizado.email);
    if (index === -1) {
        throw new Error(`Usuario con email ${usuarioActualizado.email} no encontrado.`);
    }
    // Solo actualizamos campos permitidos
    const usuarioGuardado = usuarios[index];
    const datosActualizados = {
        ...usuarioGuardado,
        nombre: usuarioActualizado.nombre,
        edad: Number(usuarioActualizado.edad) || 18,
    };
    const nuevaLista = [...usuarios];
    nuevaLista[index] = datosActualizados;
    saveUsuarios(nuevaLista);
    return nuevaLista;
};

// Eliminar un usuario (usado por Admin)
export const eliminarUsuarioAdmin = (email) => {
    const usuarios = getUsuarios();
    // Prevenir eliminar a los admins principales
    if (email === "admin@levelup.com" || email === "exsairs@gmail.com") {
        throw new Error("No se puede eliminar a los administradores principales.");
    }
    const nuevaLista = usuarios.filter(u => u.email !== email);
    if (nuevaLista.length === usuarios.length) {
        console.warn(`Usuario con email ${email} no encontrado para eliminar.`);
    }
    saveUsuarios(nuevaLista);
    return nuevaLista;
};

// Encontrar un usuario por email y contraseña (para Login)
export const findUsuarioParaLogin = (email, password) => {
    const usuarios = getUsuarios();
    return usuarios.find(u => u.email === email && u.password === password);
};

 // Verificar si un email ya existe (para Registro)
export const emailExiste = (email) => {
    const usuarios = getUsuarios();
    return usuarios.some(u => u.email === email);
};

// Agregar un nuevo usuario (para Registro)
export const agregarUsuario = (nuevoUsuario) => {
    const usuarios = getUsuarios();
    if (emailExiste(nuevoUsuario.email)) {
        throw new Error("Este correo ya está registrado.");
    }
    // Aseguramos valores por defecto si no vienen
    nuevoUsuario.isAdmin = nuevoUsuario.isAdmin || false;
    nuevoUsuario.descuento = nuevoUsuario.descuento || nuevoUsuario.email.endsWith("@duocuc.cl"); // Calcula descuento si no viene
    nuevoUsuario.edad = Number(nuevoUsuario.edad) || 18;

    usuarios.push(nuevoUsuario);
    saveUsuarios(usuarios);
    return nuevoUsuario; // Devuelve el usuario agregado
};