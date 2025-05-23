import React, { useState } from 'react'
import Chatbot from './Chatbot'

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mock E-commerce Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ShopSmart</h1>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li className="hover:underline cursor-pointer">Home</li>
              <li className="hover:underline cursor-pointer">Products</li>
              <li className="hover:underline cursor-pointer">Categories</li>
              <li className="hover:underline cursor-pointer">Deals</li>
              <li className="hover:underline cursor-pointer">Contact</li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mock E-commerce Content */}
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Welcome to ShopSmart</h2>
        <p className="text-center text-gray-600 mb-8">This is a demo e-commerce page with an integrated support chatbot.</p>
        
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
          <p className="mb-4">Click the chat button in the corner to talk with our support agent.</p>
          <button 
            onClick={() => setIsChatOpen(true)} 
            className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Open Chat Support
          </button>
        </div>
      </main>

      {/* Chatbot Widget */}
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isChatOpen ? 'scale-100' : 'scale-0'}`}>
        <div className="relative">
          <button 
            onClick={() => setIsChatOpen(false)} 
            className="cursor-pointer absolute -top-3 -right-3 bg-gray-200 rounded-full p-1 hover:bg-gray-300 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Chatbot />
        </div>
      </div>

      {/* Chat Trigger Button - visible when chat is closed */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)} 
          className="cursor-pointer fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default App