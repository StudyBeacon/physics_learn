import React from 'react'

export default function Articles(){
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      <p className="text-gray-700">Physics articles, short reads, exam strategies and study tips.</p>

      <div className="mt-6 space-y-4">
        <article className="p-4 border rounded">
          <h3 className="font-semibold">How to revise for Physics efficiently</h3>
          <p className="text-sm text-gray-600 mt-2">A 4-week plan to cover core topics and practise numerical problems.</p>
        </article>
      </div>
    </div>
  )
}
