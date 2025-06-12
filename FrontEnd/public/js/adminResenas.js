window.cargarModuloResenas = async function() {
  const contenedor = document.getElementById('moduloContenido');
  contenedor.innerHTML = '<div class="text-center text-gray-500">Cargando reseñas...</div>';
  try {
    const res = await fetch('/api/resenas');
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    const resenas = result.data;
    contenedor.innerHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full border text-sm mb-6">
          <thead class="bg-blue-100">
            <tr>
              <th class="px-4 py-2">Usuario</th>
              <th class="px-4 py-2">Lugar</th>
              <th class="px-4 py-2">Puntuación</th>
              <th class="px-4 py-2">Comentario</th>
            </tr>
          </thead>
          <tbody>
            ${resenas.map(r => `
              <tr>
                <td class="border px-4 py-2">${r.usuario}</td>
                <td class="border px-4 py-2">${r.lugar || '-'}</td>
                <td class="border px-4 py-2">${r.puntuacion}</td>
                <td class="border px-4 py-2">${r.comentario}</td>
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
