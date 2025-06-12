window.setupAdmin = function() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || usuario.rol !== 'admin') {
    window.location.href = '/';
    return;
  }
  const btn = document.getElementById('cerrarSesionBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = '../auth.html';
    });
  }
};
