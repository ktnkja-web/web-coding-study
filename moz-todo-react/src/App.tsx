import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Pickup from './components/Pickup/Pickup';
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pickup />
      </main>

    </>
  );
}

export default App;