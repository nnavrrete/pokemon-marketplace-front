import React, { useEffect, useState } from "react";
import { getPublicaciones } from "../../api/cartas";
import CardItem from "../../components/card";

export default function Home() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("fecha"); // 'fecha' o 'precio'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' o 'desc'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPublicaciones();
        setPublicaciones(data);
      } catch (error) {
        console.error("Error al cargar las publicaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAndSortedPublicaciones = publicaciones
    .filter((pub) =>
      pub.carta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const valA = sortBy === 'precio' ? parseFloat(a.precio) : new Date(a.created_at).getTime();
      const valB = sortBy === 'precio' ? parseFloat(b.precio) : new Date(b.created_at).getTime();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-200 p-8">
      <h1 className="text-5xl font-bold text-center mb-10 text-red-600">
         Tienda Pokémon Marketplace
      </h1>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Buscar por nombre de carta..."
          className="p-3 border border-gray-300 rounded-lg w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex justify-center items-center gap-4 mb-12">
        <label className="text-gray-800 font-semibold">
          Ordenar por:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="ml-2 p-2 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="fecha">Más recientes</option>
            <option value="precio">Precio</option>
          </select>
        </label>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
        >
          {sortOrder === "asc" ? "Ascendente ↑" : "Descendente ↓"}
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 text-lg">Cargando cartas...</p>
      ) : filteredAndSortedPublicaciones.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No se encontraron publicaciones con esos criterios.</p>
      ) : (
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {filteredAndSortedPublicaciones.map((pub) => (
            <CardItem key={pub.id} publicacion={pub} />
          ))}
        </div>
      )}
    </div>
  );
}
