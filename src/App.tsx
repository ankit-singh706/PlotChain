import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import HomePage from './components/Homepage/Homepage'
import './App.css'

function App() {

  return (
    <>
      <Navbar title='Nav'/>
      <div className="home_container">
        <HomePage/>
      </div>
    </>
  )
}

export default App
