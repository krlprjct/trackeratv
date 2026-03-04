import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

const FloatingCallButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href="tel:+79222200491"
      aria-label="Позвонить"
      className={`
        md:hidden fixed bottom-6 right-5 z-50
        w-14 h-14 bg-[#FF4D4D] text-white rounded-full
        flex items-center justify-center
        shadow-lg shadow-red-500/30
        transition-all duration-300
        active:scale-90
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
      `}
    >
      <Phone size={22} />
    </a>
  );
};

export default FloatingCallButton;
