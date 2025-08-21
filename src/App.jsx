import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router basename="/Ravaka-Web"> {/* penting untuk GitHub Pages */}
      <nav style={{ padding: "1rem", background: "#222" }}>
        <Link to="/home" style={{ margin: "0 1rem", color: "#fff" }}>Home</Link>
        <Link to="/about" style={{ margin: "0 1rem", color: "#fff" }}>About</Link>
        <Link to="/contact" style={{ margin: "0 1rem", color: "#fff" }}>Contact</Link>
      </nav>

      <Routes>
        {/* redirect root "/" ke "/home" */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* halaman */}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* kalau path tidak ada, juga redirect ke home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
