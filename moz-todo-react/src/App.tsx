import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Pickup from './components/Pickup/Pickup';
import Feature from './components/Feature/Feature';
import Footer from './components/Footer/Footer';
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pickup />
        <Feature />
      </main>
      <Footer />
    </>
  );
}

export default App;