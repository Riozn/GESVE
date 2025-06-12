const CategoriaModel = require('../models/categoriaModel');
const categoriaModel = new CategoriaModel();

module.exports = {
  obtenerCategorias: async (req, res) => {
    try {
      const categorias = await categoriaModel.obtenerTodas();
      res.json({ success: true, data: categorias });
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({ success: false, message: 'Error interno al obtener categorías' });
    }
  },

  crearCategoria: async (req, res) => {
    try {
      const categoria = await categoriaModel.crear(req.body.nombre);
      res.json({ success: true, data: categoria });
    } catch (error) {
      console.error('Error al crear categoría:', error);
      res.status(500).json({ success: false, message: 'Error interno al crear categoría' });
    }
  },

  actualizarCategoria: async (req, res) => {
    try {
      const categoria = await categoriaModel.actualizar(req.params.id, req.body.nombre);
      res.json({ success: true, data: categoria });
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      res.status(500).json({ success: false, message: 'Error interno al actualizar categoría' });
    }
  },

  eliminarCategoria: async (req, res) => {
    try {
      await categoriaModel.eliminar(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      res.status(500).json({ success: false, message: 'Error interno al eliminar categoría' });
    }
  }
};
