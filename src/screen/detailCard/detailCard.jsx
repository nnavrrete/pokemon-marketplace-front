import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHistoricoCartas, getCartaById } from "../../api/cartas";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CartaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publicacion, setPublicacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pubData = await getCartaById(id);
        setPublicacion(pubData);

        const historialData = await getHistoricoCartas(pubData.carta.id);
        // Normalizamos el formato de fecha
        const parsed = historialData.map((item) => ({
          ...item,
          fecha: new Date(item.fecha).toLocaleDateString(),
          precio: Number(item.precio),
        }));
        setHistorial(parsed);
      } catch (error) {
        console.error("Error fetching carta details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Cargando carta...</p>
      </div>
    );
  }

  if (!publicacion) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Carta no encontrada.</p>
      </div>
    );
  }

  const { carta, usuario, precio, created_at } = publicacion;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-200 p-8 flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        ← Volver
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl flex flex-col md:flex-row">
        <img
          src={carta.imagen_url}
          alt={carta.nombre}
          className="w-full md:w-1/2 h-80 object-contain rounded-xl mb-6 md:mb-0"
        />

        <div className="md:ml-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{carta.nombre}</h1>
            <p className="text-gray-600 mt-2">Tipo: {carta.tipo}</p>
            <p className="text-gray-600">Rareza: {carta.rareza}</p>
            <p className="text-gray-600">Estado: {publicacion.estado}</p>
            <p className="text-gray-600 mt-2">
              Publicada el: {new Date(created_at).toLocaleDateString()}
            </p>
            <p className="text-2xl font-bold text-red-600 mt-4">${precio}</p>
          </div>

          <div className="mt-6">
            <p className="text-gray-700">
              <span className="font-semibold">Vendedor:</span> {usuario.nombre}
            </p>
            <p className="text-gray-500 text-sm">{usuario.email}</p>
          </div>

          <button className="mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Comprar ahora
          </button>
        </div>
      </div>

      {/* 🔥 Gráfico del historial de precios */}
      <div className="bg-white mt-10 p-6 rounded-2xl shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Historial de precios
        </h2>

        {historial.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historial} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="precio"
                stroke="#f87171"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600 text-center">No hay historial de precios aún.</p>
        )}
      </div>
    </div>
  );
}
