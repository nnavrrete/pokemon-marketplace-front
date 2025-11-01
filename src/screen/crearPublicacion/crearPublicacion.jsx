import React, { useState, useEffect, useRef } from 'react';
import { getCartas, crearPublicacion } from '../../api/cartas';
import TCGdex from '@tcgdex/sdk'

const CrearPublicacion =  () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    usuario_id: localStorage.getItem("usuario_id"),
    carta_id: '',
    colection_id: null,
    precio: '',
    estado: 'Ungraded', // Valor por defecto
  });

  // Estado para la lista de cartas disponibles
  const [cartas, setCartas] = useState([]);
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCardImage, setSelectedCardImage] = useState('');
  // Estados para la UI (carga y mensajes)
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [isError, setIsError] = useState(false);
  // Estado para el dropdown personalizado
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [lang, setLang] = useState('es');
  const [colection, setColection] = useState(null);
  const [setsList, setSetsList] = useState([]);
  const [isSetsDropdownOpen, setIsSetsDropdownOpen] = useState(false);
  const setsDropdownRef = useRef(null);
  const [setsSearchTerm, setSetsSearchTerm] = useState('');
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (setsDropdownRef.current && !setsDropdownRef.current.contains(event.target)) {
        setIsSetsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  // Cargar las cartas cuando el componente se monta

  const fetchAllCards = async () => {
    try {
      const tcg = new TCGdex(lang);
        const data = await tcg.card.list();
        const allCard = data || [];
        setCartas(allCard);
        console.log(data);
        setCartas(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, carta_id: data[0].id }));
            setSelectedCardImage(data[0].image ? `${data[0].image}/high.webp` : '');
        } else {
            setCartas([]);
            setFormData(prev => ({ ...prev, carta_id: '' }));
            setSelectedCardImage('');
        }
    } catch (error) {
        console.error('Error fetching all cards:', error);
        setMensaje('Error al cargar las cartas disponibles.');
        setIsError(true);
    } finally {
        setLoading(false);
    }
    };


  const fetchcardsBySet = async (setId) => {
    setLoading(true);
    try {
      const data = await fetch(`https://api.tcgdex.net/v2/${lang}/sets/${setId}`).then(res => res.json());
      console.log('Datos de la colección obtenidos:', data);
      const cards = data.cards || [];
      setCartas(cards);
      if (cards.length > 0) {
        setFormData(prev => ({ ...prev, carta_id: cards[0].id }));
        setSelectedCardImage(cards[0].image ? `${cards[0].image}/high.webp` : '');
      } else {
        setCartas([]);
        setFormData(prev => ({ ...prev, carta_id: '' }));
        setSelectedCardImage('');
      }
    } catch (error) {
      console.error('Error fetching cartas by set:', error);
      setMensaje('Error al cargar las cartas de la colección seleccionada.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCards();
  }, [lang]);


  useEffect(() => {
    const fetchSets = async () => {
      try {
        // 1. Se crea una instancia del SDK con el idioma seleccionado
        const tcg = new TCGdex(lang);
        // 2. Se obtienen las colecciones (sets) usando la instancia
        const setsData = await tcg.fetch('sets');
        // 3. Se actualiza el estado con los datos obtenidos
        setSetsList(setsData || []);
        setCartas([]);
      } catch (error) {
        console.error("Error al obtener las colecciones de TCGdex:", error);
        setSetsList([]); // En caso de error, se deja la lista vacía
      }
    };
    fetchSets();
  }, [lang]);

  

  // Efecto para cerrar el dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manejador para cambios en los inputs del formulario (precio, estado)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador para seleccionar una carta del dropdown personalizado
  const handleCardSelect = (carta) => {
    setFormData(prev => ({ ...prev, carta_id: carta.id }));
    setSelectedCardImage(carta.image ? `${carta.image}/high.webp` : '');
    setIsDropdownOpen(false);
  };

    const handleSetSelect = (set) => {
        console.log('Set seleccionado:', set);
    if (set) {
        setColection(set.id);
        fetchcardsBySet(set.id);
    } else {
        setColection(null);
        fetchAllCards();
    }
    setIsSetsDropdownOpen(false);
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
      await crearPublicacion({ publicacion: formData });
      setMensaje('¡Publicación creada con éxito!');
      setIsError(false);
      // Resetear formulario
      if (cartas.length > 0) {
        setFormData(prev => ({ ...prev, carta_id: cartas[0].id, precio: '', estado: 'Ungraded' }));
        setSelectedCardImage(cartas[0].imagen_url);
      }
      setSearchTerm('');
    } catch (error) {
      console.error('Error creating publication:', error);
      const errorMsg = error.response?.data?.errors?.join(', ') || 'Error al crear la publicación.';
      setMensaje(errorMsg);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar cartas basado en el término de búsqueda
  const filteredCartas = cartas.filter(carta =>
    carta && carta.name && carta.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSets = setsList.filter(set =>
    set && set.name && set.name.toLowerCase().includes(setsSearchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400">Crear Nueva Publicación</h1>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Columna de la imagen */}
          <div className="md:w-1/3 flex flex-col items-center flex-shrink-0 w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">Carta Seleccionada</h2>
            <div className="w-64 h-96 flex items-center justify-center">
              {loading && !selectedCardImage ? (
                <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">Cargando...</div>
              ) : selectedCardImage ? (
                <img src={selectedCardImage} alt="Carta seleccionada" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
              ) : (
                <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center text-center p-4">Selecciona una carta para ver su imagen.</div>
              )}
            </div>
          </div>

          {/* Columna del formulario */}
          <div className="md:w-2/3 w-full">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-2xl flex flex-col gap-6">
              
              {/* Custom Select con Búsqueda */}
              <div className="flex flex-col gap-2 text-lg">
                <span className="text-gray-300">Idioma:</span>
                <select name="lang" value={lang} onChange={(e) => setLang(e.target.value)} disabled={loading} className="bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300">
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                </select>
                </div>

              {/* Custom Select con Búsqueda */}
              <div className="flex flex-col gap-2 text-lg">
                <span className="text-gray-300">Colección:</span>
                <div className="relative" ref={setsDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsSetsDropdownOpen(!isSetsDropdownOpen)}
                    disabled={loading || setsList.length === 0}
                    className="w-full bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300 disabled:opacity-50"
                  >
                    <span>
                      {colection
                        ? setsList.find(s => s.id === colection)?.name || 'Todas las colecciones'
                        : 'Todas las colecciones'}
                    </span>
                    <svg className={`w-5 h-5 transition-transform duration-200 ${isSetsDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>

                  {isSetsDropdownOpen && (
                    <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
                      <div className="p-2 border-b border-gray-700">
                        <input
                          type="text"
                          placeholder="Buscar colección..."
                          value={setsSearchTerm}
                          onChange={(e) => setSetsSearchTerm(e.target.value)}
                          autoFocus
                          className="w-full bg-gray-700 border-2 border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                      </div>
                      <ul className="max-h-56 overflow-y-auto">
                      <li onClick={() => handleSetSelect(null)} className="px-4 py-2 text-white hover:bg-cyan-600 cursor-pointer">Todas las colecciones</li>
                        {filteredSets.length > 0 ? (
                      filteredSets.map((set) => (                           <li key={set.id} onClick={() => handleSetSelect(set)} className="px-4 py-2 text-white hover:bg-cyan-600 cursor-pointer">
                      {set.name}                          </li>
                    
                          ))
                        ) : (
                          <li className="px-4 py-2 text-gray-400">No se encontraron colecciones</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
              <div className="flex flex-col gap-2 text-lg">
                <span className="text-gray-300">Carta a vender:</span>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={loading || cartas.length === 0}
                    className="w-full bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300 disabled:opacity-50"
                  >
                    <span>
                      {formData.carta_id
                         ? cartas.find(c => c.id.toString() === formData.carta_id.toString())?.name || 'Selecciona una carta'
                        : 'Selecciona una carta'}
                    </span>
                    <svg className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
                      <div className="p-2 border-b border-gray-700">
                        <input
                          type="text"
                          placeholder="Buscar por nombre..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                          className="w-full bg-gray-700 border-2 border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                      </div>
                      <ul className="max-h-56 overflow-y-auto">
                        {filteredCartas.length > 0 ? (
                          filteredCartas.map((cartas) => (
                            <li
                              key={cartas.id}
                              onClick={() => handleCardSelect(cartas)}
                              className="px-4 py-2 text-white hover:bg-cyan-600 cursor-pointer"
                            >
                              {cartas.name} ({cartas.rarity})
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-gray-400">No se encontraron cartas</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <label className="flex flex-col gap-2 text-lg">
                <span className="text-gray-300">Precio ($):</span>
                <input className="bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300" type="number" name="precio" placeholder="Ej: 25.50" value={formData.precio} onChange={handleChange} disabled={loading} required step="0.01" min="0" />
              </label>

              <label className="flex flex-col gap-2 text-lg">
                <span className="text-gray-300">Estado de la carta:</span>
                <select name="estado" value={formData.estado} onChange={handleChange} disabled={loading} className="bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300">
                  <option value="Ungraded">Ungraged</option>
                  <option value="PSA 10">PSA 10</option>
                    <option value="PSA 9">PSA 9</option>
                    <option value="PSA 8">PSA 8</option>
                    <option value="PSA 7">PSA 7</option> 
                    <option value="PSA 6">PSA 6</option>
                    <option value="PSA 5">PSA 5</option>
                    <option value="PSA 4">PSA 4</option>
                    <option value="PSA 3">PSA 3</option>
                    <option value="PSA 2">PSA 2</option>
                    <option value="PSA 1">PSA 1</option>
                </select>
              </label>

              <div className="flex flex-col gap-2 text-lg">
                </div>

              <div className="flex flex-col gap-4 mt-4">
                <button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Publicando...' : 'Crear Publicación'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {mensaje && <div className={`w-full max-w-lg mx-auto p-4 rounded-lg shadow-2xl mt-8 text-center ${isError ? 'bg-red-800 border border-red-600 text-red-100' : 'bg-green-800 border border-green-600 text-green-100'}`}>
            <p>{mensaje}</p>
          </div>}
      </div>
    </div>
  );
};

export default CrearPublicacion;
