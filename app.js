// URLs de las APIs
const API_USERS = 'http://localhost:3000/api/users';
const API_DIRECCIONES = 'http://localhost:3001/api/direcciones';

// Variables globales
let usuarios = [];
let direcciones = [];
let editingUserId = null;
let editingDireccionId = null;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    loadUsuarios();
    loadDirecciones();
    setupForms();
});

// Configurar formularios
function setupForms() {
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
    document.getElementById('direccionForm').addEventListener('submit', handleDireccionSubmit);
}

// ==================== USUARIOS ====================

// Cargar usuarios
async function loadUsuarios() {
    try {
        const response = await fetch(API_USERS);
        const data = await response.json();
        
        if (data.success) {
            usuarios = data.data;
            renderUsuarios();
            loadUsuariosSelect();
        }
    } catch (error) {
        showError('Error al cargar usuarios: ' + error.message);
    }
}

// Renderizar tabla de usuarios
function renderUsuarios() {
    const tbody = document.getElementById('usuariosTable');
    
    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-3 py-6 text-center text-gray-500">No hay usuarios registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = usuarios.map(user => `
        <tr class="hover:bg-gray-50 transition duration-200">
            <td class="px-3 py-3 font-semibold text-gray-700 align-top text-sm">${user.id}</td>
            <td class="px-3 py-3 align-top">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                        <i class="fas fa-user text-indigo-600 text-xs"></i>
                    </div>
                    <span class="font-medium text-gray-800 text-sm">${user.nombre}</span>
                </div>
            </td>
            <td class="px-3 py-3 text-gray-600 align-top text-sm">${user.email}</td>
            <td class="px-3 py-3 text-gray-600 align-top text-sm">${user.edad || '-'}</td>
            <td class="px-3 py-3 align-top">
                ${renderDireccionesUsuario(user.direcciones, user.id)}
            </td>
            <td class="px-3 py-3 align-top">
                <div class="flex justify-center gap-2">
                    <button onclick="editUser(${user.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition duration-300 text-sm">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteUser(${user.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition duration-300 text-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Agregar contenedor flotante para dropdowns
    let dropdownContainer = document.getElementById('dropdownContainer');
    if (!dropdownContainer) {
        dropdownContainer = document.createElement('div');
        dropdownContainer.id = 'dropdownContainer';
        dropdownContainer.className = 'fixed z-50';
        document.body.appendChild(dropdownContainer);
    }
}

// Renderizar direcciones de un usuario con dropdown
function renderDireccionesUsuario(direcciones, userId) {
    if (!direcciones || direcciones.length === 0) {
        return '<span class="text-gray-400 text-sm">Sin direcciones</span>';
    }
    
    const dropdownId = `dropdown-${userId}`;
    
    return `
        <div class="w-full text-left relative">
            <button onclick="toggleDropdown('${dropdownId}', event)" class="inline-flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition duration-200 w-full justify-center">
                <i class="fas fa-map-marker-alt mr-2"></i>
                <span class="font-semibold">${direcciones.length} ${direcciones.length === 1 ? 'dirección' : 'direcciones'}</span>
                <i id="icon-${dropdownId}" class="fas fa-chevron-down ml-2 text-xs transition-transform duration-200"></i>
            </button>
        </div>
    `;
}

// Renderizar el contenido del dropdown
function renderDropdownContent(direcciones) {
    return direcciones.map(dir => `
        <div class="p-3 mb-2 rounded-lg text-left ${dir.activo ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50 border-2 border-gray-300'}">
            <div class="flex items-start justify-between mb-2">
                ${dir.activo ? 
                    '<span class="inline-block px-2 py-1 bg-green-500 text-white rounded-full text-xs font-bold"><i class="fas fa-check-circle mr-1"></i>ACTIVA</span>' : 
                    '<span class="inline-block px-2 py-1 bg-gray-400 text-white rounded-full text-xs font-bold"><i class="fas fa-times-circle mr-1"></i>INACTIVA</span>'
                }
            </div>
            <div class="text-sm space-y-1 text-left">
                <div class="flex items-start">
                    <i class="fas fa-road text-gray-500 mt-1 mr-2 text-xs flex-shrink-0"></i>
                    <span class="text-gray-700 font-medium">${dir.calle}</span>
                </div>
                <div class="flex items-start">
                    <i class="fas fa-city text-gray-500 mt-1 mr-2 text-xs flex-shrink-0"></i>
                    <span class="text-gray-600">${dir.ciudad}, ${dir.estado}</span>
                </div>
                <div class="flex items-start">
                    <i class="fas fa-flag text-gray-500 mt-1 mr-2 text-xs flex-shrink-0"></i>
                    <span class="text-gray-600">${dir.pais} - ${dir.codigo_postal}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle dropdown
function toggleDropdown(dropdownId, event) {
    event.stopPropagation();
    
    const container = document.getElementById('dropdownContainer');
    const icon = document.getElementById(`icon-${dropdownId}`);
    const userId = parseInt(dropdownId.replace('dropdown-', ''));
    const user = usuarios.find(u => u.id === userId);
    
    // Si ya está abierto, cerrarlo
    if (container.innerHTML && container.style.display !== 'none') {
        container.innerHTML = '';
        container.style.display = 'none';
        if (icon) icon.classList.remove('rotate-180');
        return;
    }
    
    // Obtener posición de la tabla
    const table = document.querySelector('#usuariosTable').closest('.bg-white');
    const tableRect = table.getBoundingClientRect();
    
    // Crear dropdown
    container.innerHTML = `
        <div class="bg-white rounded-lg shadow-2xl border-2 border-indigo-200 p-4 max-h-96 overflow-y-auto">
            ${renderDropdownContent(user.direcciones)}
        </div>
    `;
    
    // Posicionar dropdown
    container.style.left = `${tableRect.left}px`;
    container.style.top = `${tableRect.bottom + 10}px`;
    container.style.width = `${tableRect.width}px`;
    container.style.display = 'block';
    
    // Rotar icono
    if (icon) icon.classList.add('rotate-180');
}

// Cerrar dropdowns al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('button') || !e.target.closest('button').hasAttribute('onclick')) {
        const container = document.getElementById('dropdownContainer');
        if (container) {
            container.innerHTML = '';
            container.style.display = 'none';
        }
        const allIcons = document.querySelectorAll('[id^="icon-dropdown-"]');
        allIcons.forEach(i => i.classList.remove('rotate-180'));
    }
});

// Abrir modal de usuario
function openUserModal(userId = null) {
    editingUserId = userId;
    const modal = document.getElementById('userModal');
    const title = document.getElementById('userModalTitle');
    
    if (userId) {
        const user = usuarios.find(u => u.id === userId);
        title.textContent = 'Editar Usuario';
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.nombre;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userEdad').value = user.edad || '';
    } else {
        title.textContent = 'Nuevo Usuario';
        document.getElementById('userForm').reset();
    }
    
    modal.classList.remove('hidden');
}

// Cerrar modal de usuario
function closeUserModal() {
    document.getElementById('userModal').classList.add('hidden');
    document.getElementById('userForm').reset();
    editingUserId = null;
}

// Manejar envío de formulario de usuario
async function handleUserSubmit(e) {
    e.preventDefault();
    
    const userData = {
        nombre: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        edad: parseInt(document.getElementById('userEdad').value) || undefined
    };
    
    try {
        let response;
        if (editingUserId) {
            response = await fetch(`${API_USERS}/${editingUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } else {
            response = await fetch(API_USERS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data.message);
            closeUserModal();
            loadUsuarios();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Error al guardar usuario: ' + error.message);
    }
}

// Editar usuario
function editUser(id) {
    openUserModal(id);
}

// Eliminar usuario
async function deleteUser(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario? Se eliminarán también sus direcciones.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_USERS}/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data.message);
            loadUsuarios();
            loadDirecciones();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Error al eliminar usuario: ' + error.message);
    }
}

// ==================== DIRECCIONES ====================

// Cargar direcciones
async function loadDirecciones() {
    try {
        const response = await fetch(API_DIRECCIONES);
        const data = await response.json();
        
        if (data.success) {
            direcciones = data.data;
            renderDirecciones();
        }
    } catch (error) {
        showError('Error al cargar direcciones: ' + error.message);
    }
}

// Renderizar tabla de direcciones
function renderDirecciones() {
    const tbody = document.getElementById('direccionesTable');
    
    if (direcciones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-8 text-center text-gray-500">No hay direcciones registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = direcciones.map(dir => `
        <tr class="hover:bg-gray-50 transition duration-200">
            <td class="px-6 py-4 font-semibold text-gray-700">${dir.id}</td>
            <td class="px-6 py-4">
                <div class="text-sm">
                    <div class="font-medium text-gray-800">${dir.usuario.nombre}</div>
                    <div class="text-gray-500">${dir.usuario.email}</div>
                </div>
            </td>
            <td class="px-6 py-4 text-gray-600">${dir.calle}</td>
            <td class="px-6 py-4 text-gray-600">${dir.ciudad}</td>
            <td class="px-6 py-4 text-gray-600">${dir.estado}</td>
            <td class="px-6 py-4 text-gray-600">${dir.pais}</td>
            <td class="px-6 py-4 text-center">
                ${dir.activo ? 
                    '<span class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold"><i class="fas fa-check-circle mr-1"></i>ACTIVA</span>' : 
                    '<span class="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold"><i class="fas fa-times-circle mr-1"></i>INACTIVA</span>'
                }
            </td>
            <td class="px-6 py-4">
                <div class="flex justify-center gap-2">
                    <button onclick="editDireccion(${dir.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteDireccion(${dir.id})" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Cargar usuarios en el select
function loadUsuariosSelect() {
    const select = document.getElementById('direccionUsuarioId');
    select.innerHTML = '<option value="">Seleccione un usuario</option>' +
        usuarios.map(u => `<option value="${u.id}">${u.nombre} (${u.email})</option>`).join('');
}

// Abrir modal de dirección
function openDireccionModal(direccionId = null) {
    editingDireccionId = direccionId;
    const modal = document.getElementById('direccionModal');
    const title = document.getElementById('direccionModalTitle');
    
    if (direccionId) {
        const dir = direcciones.find(d => d.id === direccionId);
        title.textContent = 'Editar Dirección';
        document.getElementById('direccionId').value = dir.id;
        document.getElementById('direccionUsuarioId').value = dir.usuario_id;
        document.getElementById('direccionUsuarioId').disabled = true;
        document.getElementById('direccionCalle').value = dir.calle;
        document.getElementById('direccionCiudad').value = dir.ciudad;
        document.getElementById('direccionEstado').value = dir.estado;
        document.getElementById('direccionCodigoPostal').value = dir.codigo_postal;
        document.getElementById('direccionPais').value = dir.pais;
    } else {
        title.textContent = 'Nueva Dirección';
        document.getElementById('direccionForm').reset();
        document.getElementById('direccionUsuarioId').disabled = false;
        document.getElementById('direccionPais').value = 'México';
    }
    
    modal.classList.remove('hidden');
}

// Cerrar modal de dirección
function closeDireccionModal() {
    document.getElementById('direccionModal').classList.add('hidden');
    document.getElementById('direccionForm').reset();
    document.getElementById('direccionUsuarioId').disabled = false;
    editingDireccionId = null;
}

// Manejar envío de formulario de dirección
async function handleDireccionSubmit(e) {
    e.preventDefault();
    
    const direccionData = {
        usuario_id: parseInt(document.getElementById('direccionUsuarioId').value),
        calle: document.getElementById('direccionCalle').value,
        ciudad: document.getElementById('direccionCiudad').value,
        estado: document.getElementById('direccionEstado').value,
        codigo_postal: document.getElementById('direccionCodigoPostal').value,
        pais: document.getElementById('direccionPais').value
    };
    
    try {
        let response;
        if (editingDireccionId) {
            delete direccionData.usuario_id;
            response = await fetch(`${API_DIRECCIONES}/${editingDireccionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(direccionData)
            });
        } else {
            response = await fetch(API_DIRECCIONES, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(direccionData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data.message);
            closeDireccionModal();
            loadDirecciones();
            loadUsuarios();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Error al guardar dirección: ' + error.message);
    }
}

// Editar dirección
function editDireccion(id) {
    openDireccionModal(id);
}

// Eliminar dirección
async function deleteDireccion(id) {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_DIRECCIONES}/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data.message);
            loadDirecciones();
            loadUsuarios();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Error al eliminar dirección: ' + error.message);
    }
}

// ==================== UTILIDADES ====================

// Mostrar mensaje de éxito
function showSuccess(message) {
    alert('✓ ' + message);
}

// Mostrar mensaje de error
function showError(message) {
    alert('✗ ' + message);
}
