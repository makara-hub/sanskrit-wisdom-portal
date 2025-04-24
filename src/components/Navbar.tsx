import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Languages,
  BookOpen,
  Search,
  History,
  Menu,
  User,
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="container-custom py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center">
              <span className="text-white font-sanskrit text-lg font-bold">संस्</span>
            </div>
            <div>
              <h1 className="font-semibold text-xl text-darkText">
                Sanskrit<span className="text-saffron">Wisdom</span>
              </h1>
              <p className="text-xs text-gray-500">ज्ञानं परमम्</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/translate" className="flex items-center text-gray-600 hover:text-saffron transition-colors">
              <Languages className="h-4 w-4 mr-1" />
              <span>Translate</span>
            </Link>
            <Link to="/dictionary" className="flex items-center text-gray-600 hover:text-saffron transition-colors">
              <Search className="h-4 w-4 mr-1" />
              <span>Dictionary</span>
            </Link>
            <Link to="/texts" className="flex items-center text-gray-600 hover:text-saffron transition-colors">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>Texts</span>
            </Link>
            <Link to="/history" className="flex items-center text-gray-600 hover:text-saffron transition-colors">
              <History className="h-4 w-4 mr-1" />
              <span>History</span>
            </Link>
            <div className="border-l h-6 border-gray-200 mx-2"></div>
            <Link to="/login">
              <Button variant="outline" size="sm" className="text-royalBlue border-royalBlue hover:bg-royalBlue hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-saffron hover:bg-saffron/90 text-white">Sign Up</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 space-y-3 pt-4 border-t mt-3">
            <Link to="/translate" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
              <Languages className="h-5 w-5 mr-3 text-saffron" />
              <span>Translate</span>
            </Link>
            <Link to="/dictionary" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
              <Search className="h-5 w-5 mr-3 text-saffron" />
              <span>Dictionary</span>
            </Link>
            <Link to="/texts" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
              <BookOpen className="h-5 w-5 mr-3 text-saffron" />
              <span>Texts</span>
            </Link>
            <Link to="/history" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100">
              <History className="h-5 w-5 mr-3 text-saffron" />
              <span>History</span>
            </Link>
            <div className="flex items-center space-x-3 pt-3 border-t">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full text-royalBlue border-royalBlue">
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="flex-1">
                <Button className="w-full bg-saffron hover:bg-saffron/90 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
