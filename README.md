# Frontend CRUD - Usuarios y Direcciones

Interfaz web moderna y atractiva para gestionar usuarios y direcciones, construida con HTML, Tailwind CSS y JavaScript vanilla.

## 🎨 Características

- ✅ Diseño moderno y responsivo con Tailwind CSS
- ✅ Interfaz intuitiva y atractiva
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Gestión completa de direcciones (CRUD)
- ✅ Indicadores visuales de direcciones activas/inactivas
- ✅ Modales para crear y editar registros
- ✅ Iconos de Font Awesome
- ✅ Animaciones y transiciones suaves

## 🚀 Cómo usar

### Prerrequisitos

Asegúrate de que los servidores backend estén corriendo:

1. **CRUD Usuarios** en `http://localhost:3000`
2. **CRUD Direcciones** en `http://localhost:3001`

### Iniciar el frontend

**Opción 1: Abrir directamente el archivo**
- Simplemente abre `index.html` en tu navegador

**Opción 2: Usar un servidor local (recomendado)**

Con Python:
```bash
cd "C:\Users\Usuario\Desktop\frontend Crud"
python -m http.server 8080
```

Con Node.js (http-server):
```bash
npx http-server -p 8080
```

Luego abre: `http://localhost:8080`

## 📋 Funcionalidades

### Usuarios
- **Ver todos los usuarios** con sus direcciones
- **Crear nuevo usuario** con nombre, email y edad
- **Editar usuario** existente
- **Eliminar usuario** (elimina también sus direcciones)
- **Ver direcciones** asociadas a cada usuario con indicador activo/inactivo

### Direcciones
- **Ver todas las direcciones** con información del usuario
- **Crear nueva dirección** (desactiva automáticamente las anteriores del mismo usuario)
- **Editar dirección** existente
- **Eliminar dirección**
- **Indicador visual** de dirección activa (verde) o inactiva (gris)

## 🎯 Características visuales

- **Gradientes modernos** en encabezados de tablas
- **Badges de estado** para direcciones activas/inactivas
- **Iconos intuitivos** para todas las acciones
- **Hover effects** en botones y filas de tablas
- **Modales elegantes** para formularios
- **Diseño responsivo** que se adapta a diferentes pantallas

## 🔧 Configuración

Si tus APIs están en puertos diferentes, edita las URLs en `app.js`:

```javascript
const API_USERS = 'http://localhost:3000/api/users';
const API_DIRECCIONES = 'http://localhost:3001/api/direcciones';
```

## 📱 Compatibilidad

- Chrome, Firefox, Safari, Edge (versiones modernas)
- Diseño responsivo para móviles, tablets y desktop

## 🎨 Tecnologías

- **HTML5**
- **Tailwind CSS** (CDN)
- **JavaScript** (Vanilla)
- **Font Awesome** (iconos)
- **Fetch API** (consumo de APIs REST)

## 📝 Notas

- El frontend consume las APIs REST de los backends de usuarios y direcciones
- Requiere que ambos servidores backend estén corriendo
- No requiere instalación de dependencias (usa CDNs)
