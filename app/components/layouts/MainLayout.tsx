import React from 'react'
import Navbar from '../navbar'
import { Outlet } from 'react-router'
import Footer from '../footer'

const MainLayout = () => {
  return (
    <main>
        <Navbar />
        <div className='mx-auto max-w-7xl p-4 min-h-screen'>
           <Outlet />
        </div> 
        <Footer />
    </main>
  )
}

export default MainLayout