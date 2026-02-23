import React from 'react'
import WeiqiBoard from './components/WeiqiBoard'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">围棋Web应用</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <WeiqiBoard />
        </div>
      </main>
    </div>
  )
}

export default App