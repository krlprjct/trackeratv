import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Applications from './components/Applications';
import ProductSpotlight from './components/ProductSpotlight';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import FAQ from './components/FAQ.tsx'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans selection:bg-red-200 selection:text-red-900">
      <Navbar />
      <Hero />
      <main>
        <Applications />
        <ProductSpotlight />
        <Benefits />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default App;