import React from 'react'
import Header from "../components/Header";
import NavBar from "../components/NavBar";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-[url('/bg_img.png')]  min-h-screen bg-cover bg-center">
        <NavBar />
       <Header />
        
      
    </div>
  )
}

export default Home
