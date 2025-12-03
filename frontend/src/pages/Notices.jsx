import React from 'react'

export default function Notices(){
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Notices</h1>
      <p className="text-gray-700">Important announcements for students: exam dates, syllabus updates, and event notices.</p>
      <ul className="mt-4 list-disc pl-5 text-gray-600">
        <li>Exam date published for Second Year — 2025/05/10</li>
        <li>New notes uploaded for Mechanics — First Year</li>
      </ul>
    </div>
  )
}
