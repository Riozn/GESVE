window.cargarModuloTipos = async function() {
  const contenedor = document.getElementById('moduloContenido');
  contenedor.innerHTML = '<div class="text-center text-gray-500">Cargando tipos...</div>';
  try {
    const res = await fetch('/api/tipos-evento');
    const tipos = await res.json();
    contenedor.innerHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full border text-sm mb-6">
          <thead class="bg-blue-100">
            <tr>
              <th class="px-4 py-2">Nombre</th>
            </tr>
          </thead>
          <tbody>
            ${tipos.map(t => `
              <tr>
                <td class="border px-4 py-2">${t.nombre}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch(err) {
    contenedor.innerHTML = `<div class="text-red-600 text-center">Error: ${err.message}</div>`;
  }
};
