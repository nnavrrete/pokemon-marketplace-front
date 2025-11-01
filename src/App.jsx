import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./screen/login/login.jsx";
import Registro from "./screen/register/register.jsx";
import Home from "./screen/home/home.jsx";

function App() {
  return (
    <Router>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/registro">Registro</Link>
        <Link to="/">Login</Link>
        <Link to="/home"></Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;
