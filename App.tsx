import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Applications from './components/Applications';
import ProductSpotlight from './components/ProductSpotlight';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import FAQ from './components/FAQ';

const App: React.FC = () => {
  useEffect(() => {
    // Глобальный smooth scroll для всех якорных ссылок
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor && anchor.getAttribute('href') !== '#') {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        const element = document.querySelector(href!);
        
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

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