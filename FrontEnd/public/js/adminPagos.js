window.cargarModuloPagos = async function() {
  const contenedor = document.getElementById('moduloContenido');
  contenedor.innerHTML = '<div class="text-center text-gray-500">Cargando pagos...</div>';
  try {
    const res = await fetch('/api/pagos');
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    const pagos = result.data;
    contenedor.innerHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full border text-sm mb-6">
          <thead class="bg-blue-100">
            <tr>
              <th class="px-4 py-2">Cliente</th>
              <th class="px-4 py-2">Lugar</th>
              <th class="px-4 py-2">Monto</th>
              <th class="px-4 py-2">Fecha</th>
              <th class="px-4 py-2">Completo</th>
            </tr>
          </thead>
          <tbody>
            ${pagos.map(p => `
              <tr>
                <td class="border px-4 py-2">${p.cliente}</td>
                <td class="border px-4 py-2">${p.lugar}</td>
                <td class="border px-4 py-2">${p.monto}</td>
                <td class="border px-4 py-2">${p.fecha_pago}</td>
                <td class="border px-4 py-2">${p.es_pago_completo ? 'Sí' : 'No'}</td>
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
