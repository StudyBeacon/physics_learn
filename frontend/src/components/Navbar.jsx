import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            PhysicsLearn
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Home
            </Link>
            <Link 
              to="/questions" 
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Questions
            </Link>
            <Link 
              to="/articles" 
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Articles
            </Link>
            <Link 
              to="/notices" 
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Notices
            </Link>
            <Link 
              to="/help" 
              className="text-gray-700 hover:text-blue-600 transition duration-300"
            >
              Help
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex space-x-4">
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
