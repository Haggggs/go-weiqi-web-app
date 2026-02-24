import React, { useState } from 'react'
import WeiqiBoard from './components/WeiqiBoard'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm py-3">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold text-gray-800 text-center">围棋Web应用</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-2 py-4">
        <WeiqiBoard />
      </main>
    </div>
  )
}

export default App
