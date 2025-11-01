import React, { useState, useEffect } from 'react';
import { getCartas, crearPublicacion } from '../../api/cartas';

const CrearPublicacion = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    usuario_id: localStorage.getItem('usuario_id'),
    carta_id: '',
    precio: '',
    estado: 'Nuevo', // Valor por defecto
  });

  // Estado para la lista de cartas disponibles
  const [cartas, setCartas] = useState([]);

  // Estados para la UI (carga y mensajes)
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [isError, setIsError] = useState(false);

  // Cargar las cartas cuando el componente se monta
  useEffect(() => {
    const fetchCartas = async () => {
      try {
        const data = await getCartas();
        setCartas(data);
        // Pre-seleccionar la primera carta si la lista no está vacía
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, carta_id: data[0].id }));
        }
      } catch (error) {
        console.error('Error fetching cartas:', error);
        setMensaje('Error al cargar las cartas disponibles.');
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCartas();
  }, []);

  // Manejador para cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador para el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.carta_id || !formData.precio || !formData.estado) {
      setMensaje('Por favor, completa todos los campos.');
      setIsError(true);
      return;
    }

    setLoading(true);
    setMensaje('');
    setIsError(false);

    try {
      // El backend espera un objeto `publicacion`
      await crearPublicacion({ publicacion: formData });

      setMensaje('¡Publicación creada con éxito!');
      setIsError(false);
      // Resetear formulario a valores iniciales
      setFormData({
        carta_id: cartas.length > 0 ? cartas[0].id : '',
        precio: '',
        estado: 'Nuevo',
      });
    } catch (error) {
      console.error('Error creating publication:', error);
      const errorMsg = error.response?.data?.errors?.join(', ') || 'Error al crear la publicación.';
      setMensaje(errorMsg);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400">Crear Nueva Publicación</h1>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-2xl flex flex-col gap-6">
          <label className="flex flex-col gap-2 text-lg">
            <span className="text-gray-300">Carta a vender:</span>
            <select name="carta_id" value={formData.carta_id} onChange={handleChange} disabled={loading || cartas.length === 0} className="bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300 disabled:opacity-50">
              {cartas.length === 0 ? <option>Cargando cartas...</option> : cartas.map((carta) => <option key={carta.id} value={carta.id}><img ></img> {carta.nombre} ({carta.rareza})</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-lg">
            <span className="text-gray-300">Precio ($):</span>
            <input className="bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300" type="number" name="precio" placeholder="Ej: 25.50" value={formData.precio} onChange={handleChange} disabled={loading} required step="0.01" min="0" />
          </label>

          <label className="flex flex-col gap-2 text-lg">
            <span className="text-gray-300">Estado de la carta:</span>
            <select name="estado" value={formData.estado} onChange={handleChange} disabled={loading} className="bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300">
              <option value="Nuevo">Nuevo (Mint)</option>
              <option value="Casi Nuevo">Casi Nuevo (Near Mint)</option>
              <option value="Usado">Usado (Played)</option>
              <option value="Dañado">Dañado (Damaged)</option>
            </select>
          </label>

          <div className="flex flex-col gap-4 mt-4">
            <button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Publicando...' : 'Crear Publicación'}
            </button>
          </div>
        </form>

        {mensaje && <div className={`w-full max-w-lg p-4 rounded-lg shadow-2xl mt-8 text-center ${isError ? 'bg-red-800 border border-red-600 text-red-100' : 'bg-green-800 border border-green-600 text-green-100'}`}>
            <p>{mensaje}</p>
          </div>}
      </div>
    </div>
  );
};

export default CrearPublicacion;

