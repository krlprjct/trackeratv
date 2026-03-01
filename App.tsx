import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Applications from './components/Applications';
import ProductSpotlight from './components/ProductSpotlight';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import FAQ from './components/FAQ';
import ConsentBanner from './components/ConsentBanner';
import FloatingCallButton from './components/FloatingCallButton';
import Privacy from './components/Privacy';
import { useYandexMetrika } from './hooks/useYandexMetrika';

const MainPage: React.FC = () => {
  return (
    <>
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
    </>
  );
};

const App: React.FC = () => {
  useYandexMetrika();

  useEffect(() => {
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
    <BrowserRouter>
      <div className="min-h-screen bg-[#F9F8F6] font-sans selection:bg-red-200 selection:text-red-900">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
        <ConsentBanner />
        <FloatingCallButton />
      </div>
    </BrowserRouter>
  );
};

export default App;