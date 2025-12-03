import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">PhysicsLearn</h3>
            <p className="text-gray-300 mb-4">
              A comprehensive platform for BSC Physics students to access study materials, 
              practice questions, and academic resources.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition duration-300">Home</a></li>
              <li><a href="/questions" className="text-gray-300 hover:text-white transition duration-300">Questions</a></li>
              <li><a href="/articles" className="text-gray-300 hover:text-white transition duration-300">Articles</a></li>
              <li><a href="/notices" className="text-gray-300 hover:text-white transition duration-300">Notices</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-300 mb-2">Email: support@physicslearn.com</p>
            <p className="text-gray-300">Phone: +1 (555) 123-4567</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 PhysicsLearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
