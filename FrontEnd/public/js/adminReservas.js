window.cargarModuloReservas = async function() {
  const contenedor = document.getElementById('moduloContenido');
  contenedor.innerHTML = '<div class="text-center text-gray-500">Cargando reservas...</div>';
  try {
    const res = await fetch('/api/reservas');
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    const reservas = result.data;
    contenedor.innerHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full border text-sm mb-6">
          <thead class="bg-blue-100">
            <tr>
              <th class="px-4 py-2">Cliente</th>
              <th class="px-4 py-2">Lugar</th>
              <th class="px-4 py-2">Inicio</th>
              <th class="px-4 py-2">Fin</th>
              <th class="px-4 py-2">Estado</th>
              <th class="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            ${reservas.map(r => `
              <tr>
                <td class="border px-4 py-2">${r.cliente}</td>
                <td class="border px-4 py-2">${r.lugar}</td>
                <td class="border px-4 py-2">${r.fecha_inicio}</td>
                <td class="border px-4 py-2">${r.fecha_fin}</td>
                <td class="border px-4 py-2">${r.estado}</td>
                <td class="border px-4 py-2">${r.total}</td>
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
