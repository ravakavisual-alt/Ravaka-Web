import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-gray-800">
          Ravaka Visual
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6 text-gray-700">
          <Link to="/" className="hover:text-gray-900 transition">Home</Link>
          <Link to="/services" className="hover:text-gray-900 transition">Services</Link>
          <Link to="/work" className="hover:text-gray-900 transition">Work</Link>
          <Link to="/about" className="hover:text-gray-900 transition">About</Link>
          {/* Contact pakai <a> */}
          <a 
            href="mailto:ravaka.visual@gmail.com" 
            className="hover:text-gray-900 transition"
          >
            Contact
          </a>
        </div>

        {/* Mobile toggle button */}
        <button
          className="relative w-8 h-3 flex flex-col justify-between md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="block h-0.5 w-full bg-gray-800 rounded"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="block h-0.5 w-full bg-gray-800 rounded"
          />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden bg-white/40 backdrop-blur-md border-t border-white/20 shadow-sm"
        >
          <div className="flex flex-col items-center py-6 space-y-4 text-gray-700">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/services" onClick={() => setIsOpen(false)}>Services</Link>
            <Link to="/work" onClick={() => setIsOpen(false)}>Work</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            {/* Mobile menu contact */}
            <a 
              href="mailto:ravaka.visual@gmail.com" 
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
