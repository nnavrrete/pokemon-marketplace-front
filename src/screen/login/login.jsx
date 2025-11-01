import { useState, useEffect } from 'react';
import './login.css'
import { login } from '../../api/login.js';
import { useNavigate } from 'react-router-dom';
// --- Funciones API simuladas ---
// En una aplicación real, estas estarían en /api/login.js y /api/user.js
// Las definimos aquí para que el componente sea totalmente funcional para la demostración.

/**
 * Simula una llamada API de inicio de sesión.
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<string>} Una promesa que se resuelve con un token JWT simulado.
 */

/**
 * Simula una llamada API para obtener datos del usuario.
 * @param {string} token - El token de autenticación.
 * @returns {Promise<object>} Una promesa que se resuelve con datos de usuario simulados.
 */

function App() {
  const [email, setEmail] = useState(''); // Pre-llenado para pruebas
  const [password, setPassword] = useState(''); // Pre-llenado para pruebas
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const navigator = useNavigate();

  // Efecto para cargar el token desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        console.log('Token cargado desde localStorage');
      }
    } catch (e) {
      console.error("No se pudo acceder a localStorage:", e);
    }
  }, []);

  // Manejador de inicio de sesión
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setUserData(null);
    try {
      const receivedToken = await login(email, password);
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      navigator('/home');
      console.log('Login successful, token:', receivedToken);
    } catch (error) {
      console.error('Login failed:', error);
      setError('Error al iniciar sesión: ' + error.message);
    }
    setLoading(false);
  };

  // Manejador para obtener datos del usuario
  const handleGetUser = async () => {
    if (!token) {
      setError('Debes iniciar sesión primero.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getUser(token);
      setUserData(data);
      console.log('User data:', data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Error al obtener datos: ' + error.message);
      // Opcional: si el token es inválido, limpiarlo
      if (error.message.includes('Invalid or expired token')) {
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  };

  // Manejador de cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserData(null);
    setError(null);
    setEmail('');
    setPassword('');
    console.log('Sesión cerrada');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="w-full max-w-md">
        
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400">
          Logeo
        </h1>

        {/* Contenedor del Formulario */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl flex flex-col gap-6">
          <label className="flex flex-col gap-2 text-lg">
            <span className="text-gray-300">Email:</span>
            <input
              className="bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300"
              type="email"
              placeholder='tuemail@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </label>
          <label className="flex flex-col gap-2 text-lg">
            <span className="text-gray-300">Password:</span>
            <input
              className="bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300"
              type="password"
              placeholder='Tu contraseña'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </label>
          
          {/* Botones de Acción */}
          <div className="flex flex-col gap-4 mt-4">
            {!token ? (
              <button 
                onClick={handleLogin}
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Iniciando...' : 'Iniciar sesión'}
              </button>
            ) : (
              <>
                <button 
                  onClick={handleGetUser}
                  disabled={loading}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Obteniendo...' : 'Obtener información usuario'}
                </button>
                <button 
                  onClick={handleLogout}
                  disabled={loading}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="w-full max-w-md bg-red-800 border border-red-600 text-red-100 p-4 rounded-lg shadow-2xl mt-8 text-center">
            <p>{error}</p>
          </div>
        )}

        {/* Visualización de Datos del Usuario */}
        {userData && (
          <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Información del usuario:</h2>
            <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-300">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;