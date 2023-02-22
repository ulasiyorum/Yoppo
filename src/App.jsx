import { useState } from 'react'
import './App.css'
import Header from './Components/Header'
import Body from './Components/Body'
import { createBrowserRouter } from 'react-router-dom';

function App() {

  return (
    <div className='bg-gradient-to-b from-white to-orange-50 h-full'>
    <Header/>
    <Body/>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>
  }

]);



export default App

