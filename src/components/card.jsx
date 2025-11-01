import React from "react";
import { useNavigate } from "react-router-dom";

export default function CardItem({ publicacion }) {
  const navigate = useNavigate();
  const { carta, precio, usuario } = publicacion;

  return (
    <div
      onClick={() => navigate(`/carta/${publicacion.id}`)}
      className="bg-white shadow-lg rounded-2xl p-4 w-64 cursor-pointer hover:scale-105 transition-transform duration-200"
    >
      <img
        src={carta.imagen_url}
        alt={carta.nombre}
        className="w-full h-64 object-contain mb-3 rounded-lg"
      />
      <h2 className="text-xl font-semibold text-gray-800">{carta.nombre}</h2>
      <p className="text-sm text-gray-600">Tipo: {carta.tipo}</p>
      <p className="text-sm text-gray-600">Rareza: {carta.rareza}</p>
      <p className="text-lg font-bold text-red-600 mt-2">${precio}</p>
      <p className="text-sm text-gray-500 mt-1">Vendedor: {usuario?.nombre}</p>
    </div>
  );
}
