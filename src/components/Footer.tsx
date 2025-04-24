
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-cream border-t py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center">
                <span className="text-white font-sanskrit text-lg font-bold">संस्</span>
              </div>
              <h2 className="font-semibold text-xl">
                Sanskrit<span className="text-saffron">Wisdom</span>
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Discover the wisdom of ancient Sanskrit texts, translate between Sanskrit and English, and explore the rich cultural heritage of Sanskrit literature.
            </p>
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} SanskritWisdom
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/translate" className="text-gray-600 hover:text-saffron">Translation Tool</Link>
              </li>
              <li>
                <Link to="/dictionary" className="text-gray-600 hover:text-saffron">Sanskrit Dictionary</Link>
              </li>
              <li>
                <Link to="/texts" className="text-gray-600 hover:text-saffron">Classical Texts</Link>
              </li>
              <li>
                <Link to="/learning" className="text-gray-600 hover:text-saffron">Learning Resources</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Classical Texts</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/texts/ramayana" className="text-gray-600 hover:text-saffron">Ramayana</Link>
              </li>
              <li>
                <Link to="/texts/mahabharata" className="text-gray-600 hover:text-saffron">Mahabharata</Link>
              </li>
              <li>
                <Link to="/texts/bhagavad-gita" className="text-gray-600 hover:text-saffron">Bhagavad Gita</Link>
              </li>
              <li>
                <Link to="/texts/upanishads" className="text-gray-600 hover:text-saffron">Upanishads</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-saffron">Log In</Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-saffron">Sign Up</Link>
              </li>
              <li>
                <Link to="/account" className="text-gray-600 hover:text-saffron">My Account</Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-600 hover:text-saffron">My History</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-xs text-gray-500">
          <p className="mb-2 font-sanskrit">
            "विद्या ददाति विनयं विनयाद्याति पात्रताम्। पात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम्॥"
          </p>
          <p>
            "Education gives humility, from humility comes worthiness, from worthiness one gets wealth, from wealth good deeds, and from that joy."
          </p>
        </div>
      </div>
    </footer>
  );
}
