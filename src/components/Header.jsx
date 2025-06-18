import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/lunaa.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed w-full h-30 bg-white shadow-md z-50 top-0 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Luna Logo" className="h-25 w-25" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#about"
              className="text-gray-800 hover:text-secondary font-medium"
            >
              About
            </a>
            <a
              href="#services"
              className="text-gray-800 hover:text-secondary font-medium"
            >
              Services
            </a>
            <a
              href="#contact"
              className="text-gray-800 hover:text-secondary font-medium"
            >
              Contact
            </a>
            <Link
              to="/login"
              className="text-border font-medium hover:text-secondary px-3 py-2 rounded transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-sidebar text-white font-medium px-3 py-2 rounded hover:bg-border transition"
            >
              Sign Up
            </Link>
          </nav>

          {/* Mobile Button */}
          <button
            className="md:hidden text-2xl text-[#D990BC]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-4 pb-6 flex flex-col space-y-4">
            <a
              href="#about"
              className="text-gray-700 hover:text-[#D990BC]"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#services"
              className="text-gray-700 hover:text-[#D990BC]"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-[#D990BC]"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>
            <Link
              to="/login"
              className="text-[#D990BC]"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#D990BC] text-white px-4 py-2 rounded"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
