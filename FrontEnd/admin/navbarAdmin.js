// Basic admin navbar logic: ensure admin session and enable logout

function initAdminNavbar() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || usuario.rol !== 'admin') {
    window.location.href = '/';
    return;
  }

  const btn = document.getElementById('cerrarSesionBtn');
  if (btn) {
    btn.onclick = () => {
      localStorage.clear();
      window.location.href = 'auth.html';
    };
  }
}

document.addEventListener('DOMContentLoaded', initAdminNavbar);
