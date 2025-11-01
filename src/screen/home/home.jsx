import React, { useEffect, useState } from "react";
import { getPublicaciones } from "../../api/cartas";
import CardItem from "../../components/card";

export default function Home() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPublicaciones();
      setPublicaciones(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200 p-8">
      <h1 className="text-5xl font-bold text-center mb-10 text-red-600">
        🃏 Tienda Pokémon Marketplace
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 text-lg">Cargando cartas...</p>
      ) : publicaciones.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No hay cartas publicadas todavía.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {publicaciones.map((pub) => (
            <CardItem key={pub.id} publicacion={pub} />
          ))}
        </div>
      )}
    </div>
  );
}
