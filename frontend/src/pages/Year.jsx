import React from 'react'
import { useParams } from 'react-router-dom'

export default function Year() {
  const { slug } = useParams()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Year: {slug}
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Welcome to the {slug} year page. This page will display subjects and content for this academic year.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Physics</h3>
              <p className="text-blue-700 text-sm">Core physics subjects and topics</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Mathematics</h3>
              <p className="text-green-700 text-sm">Mathematical concepts and applications</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Laboratory</h3>
              <p className="text-purple-700 text-sm">Practical experiments and lab work</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
