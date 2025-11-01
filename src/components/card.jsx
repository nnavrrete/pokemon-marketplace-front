import React from "react";

export default function CardItem({ publicacion }) {
  const { carta, precio, usuario } = publicacion;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 w-64 hover:scale-105 transition-transform duration-200">
      <img
        src={carta.imagen_url}
        alt={carta.nombre}
        className="w-full h-64 object-contain mb-3 rounded-lg"
      />
      <h2 className="text-xl font-semibold text-gray-800">{carta.nombre}</h2>
      <p className="text-sm text-gray-600">Tipo: {carta.tipo}</p>
      <p className="text-sm text-gray-600">Rareza: {carta.rareza}</p>
      <p className="text-lg font-bold text-red-600 mt-2">${precio}</p>
      <p className="text-sm text-gray-500 mt-1">Vendido por: {usuario?.nombre}</p>
      <button className="mt-3 bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700">
        Comprar
      </button>
    </div>
  );
}
