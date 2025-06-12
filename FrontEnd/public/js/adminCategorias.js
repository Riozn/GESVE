window.cargarModuloCategorias = async function() {
  const contenedor = document.getElementById('moduloContenido');
  contenedor.innerHTML = `<div class="text-center text-gray-500">Cargando categorías...</div>`;
  try {
    const res = await fetch('/api/categorias');
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    const categorias = result.data;
    contenedor.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-blue-700">Categorías</h2>
        <button id="btnNuevaCategoria" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + Nueva Categoría
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full border text-sm mb-6">
          <thead class="bg-blue-100">
            <tr>
              <th class="px-4 py-2">Nombre</th>
              <th class="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${categorias.map(c => `
              <tr>
                <td class="border px-4 py-2">${c.nombre}</td>
                <td class="border px-4 py-2">
                  <button class="bg-amber-500 px-2 py-1 rounded text-white" onclick="editarCategoria('${c.id}','${c.nombre}')">Editar</button>
                  <button class="bg-red-600 px-2 py-1 rounded text-white ml-2" onclick="eliminarCategoria('${c.id}')">Eliminar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div id="formCategoriaAdmin"></div>
      </div>
    `;
    document.getElementById('btnNuevaCategoria').onclick = mostrarFormularioNuevaCategoria;
  } catch(err) {
    contenedor.innerHTML = `<div class="text-red-600 text-center">Error: ${err.message}</div>`;
  }
};

function mostrarFormularioNuevaCategoria() {
  const formHtml = `
    <form id="formAdminNuevaCategoria" class="bg-white p-6 rounded-lg shadow space-y-4 max-w-md mx-auto mt-4">
      <h3 class="text-xl font-semibold text-blue-600">Nueva Categoría</h3>
      <input type="text" name="nombre" placeholder="Nombre" required class="w-full px-4 py-2 border rounded"/>
      <div class="flex justify-end">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
      </div>
    </form>`;
  document.getElementById('formCategoriaAdmin').innerHTML = formHtml;

  document.getElementById('formAdminNuevaCategoria').onsubmit = async function(e) {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    const res = await fetch('/api/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    const result = await res.json();
    if (result.success) {
      alert('Categoría creada');
      window.cargarModuloCategorias();
    } else {
      alert(result.message);
    }
  };
}

window.eliminarCategoria = async function(id) {
  if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
  const res = await fetch(`/api/categorias/${id}`, { method: 'DELETE' });
  const result = await res.json();
  if (result.success) {
    alert('Categoría eliminada');
    window.cargarModuloCategorias();
  } else {
    alert(result.message);
  }
};

window.editarCategoria = function(id, nombre) {
  const formHtml = `
    <form id="formAdminEditarCategoria" class="bg-white p-6 rounded-lg shadow space-y-4 max-w-md mx-auto mt-4">
      <h3 class="text-xl font-semibold text-blue-600">Editar Categoría</h3>
      <input type="text" name="nombre" value="${nombre}" required class="w-full px-4 py-2 border rounded"/>
      <div class="flex justify-end">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Actualizar</button>
      </div>
    </form>`;
  document.getElementById('formCategoriaAdmin').innerHTML = formHtml;

  document.getElementById('formAdminEditarCategoria').onsubmit = async function(e) {
    e.preventDefault();
    const nuevoNombre = e.target.nombre.value;
    const res = await fetch(`/api/categorias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoNombre })
    });
    const result = await res.json();
    if (result.success) {
      alert('Categoría actualizada');
      window.cargarModuloCategorias();
    } else {
      alert(result.message);
    }
  };
};
