import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./screen/login/login.jsx";
import Registro from "./screen/register/register.jsx";
import Home from "./screen/home/home.jsx";
import CartaDetalle from "./screen/detailCard/detailCard.jsx";
import CrearPublicacion from "./screen/crearPublicacion/crearPublicacion.jsx";

function App() {
  return (
    <Router>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to="/home">Home</Link>
        <Link to="/registro">Registro</Link>
        <Link to="/">Login</Link>
        <Link to="/home"></Link>
        <Link to="/carta/:id"></Link>
        <Link to="/crear-publicacion">Crear Publicación</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/carta/:id" element={<CartaDetalle />} />
        <Route path="/crear-publicacion" element={<CrearPublicacion />} />
      </Routes>
    </Router>
  );
}

export default App;
