import { useState } from "react";

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(""); // Limpiar mensaje anterior
    setIsError(false);

    try {
      const response = await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: form }),
      });

      if (response.ok) {
        const data = await response.json();
        setMensaje(`¡Usuario creado exitosamente: ${data.nombre}!`);
        setIsError(false);
        setForm({ nombre: "", email: "", password: "" }); // Resetear formulario
      } else {
        const error = await response.json();
        setMensaje(error.errors ? error.errors.join(", ") : "Error al crear usuario");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error de conexión con el servidor. Inténtalo más tarde.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="w-full max-w-md">

        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400">
          Crear Cuenta
        </h1>

        {/* Contenedor del Formulario */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-2xl flex flex-col gap-6">
          <label className="flex flex-col gap-2 text-lg">
            <span className="text-gray-300">Nombre:</span>
            <input
              className="bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300"
              type="text"
              name="nombre"
              placeholder="Tu nombre completo"
              value={form.nombre}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-lg">
            <span className="text-gray-300">Email:</span>
            <input
              className="bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300"
              type="email"
              name="email"
              placeholder="tu@correo.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </label>
          
          <label className="flex flex-col gap-2 text-lg">
            <span className="text-gray-300">Password:</span>
            <input
              className="bg-gray-700 border-2 border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-300"
              type="password"
              name="password"
              placeholder="Crea una contraseña segura"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </label>
          
          {/* Botón de Acción */}
          <div className="flex flex-col gap-4 mt-4">
            <button 
              type="submit"
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>

        {/* Mensaje de Éxito o Error */}
        {mensaje && (
          <div className={`w-full max-w-md p-4 rounded-lg shadow-2xl mt-8 text-center ${
            isError 
            ? 'bg-red-800 border border-red-600 text-red-100' 
            : 'bg-green-800 border border-green-600 text-green-100'
          }`}>
            <p>{mensaje}</p>
          </div>
        )}

      </div>
    </div>
  );
}
