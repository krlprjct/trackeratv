import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Преимущества', href: '#benefits' },
    { name: 'Цены', href: '#price' },
    { name: 'Характеристики', href: '#specs' },
    { name: 'Галерея', href: '#gallery' },
    { name: 'Контакты', href: '#contacts' },
  ];

  // Desktop - смена цвета при скролле
  const containerClass = isScrolled 
    ? 'bg-white/90 backdrop-blur-md shadow-lg border-gray-100 text-[#1C1C1C]' 
    : 'bg-black/20 backdrop-blur-sm border-white/10 text-white';

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-2.5 md:top-5 left-0 right-0 z-50 flex justify-center px-3 md:px-4">
        <div className={`transition-all duration-300 rounded-full border w-full max-w-[1100px] flex items-center justify-between
          ${containerClass}
          h-14 md:h-auto px-2.5 md:px-6 py-2 md:py-3
        `}>
          
          {/* Лого */}
          <div className="font-bold tracking-wide uppercase flex items-center gap-2">
             <span className="hidden md:block text-lg">TRACKER</span>
             <span className="md:hidden text-xs border-2 border-current w-10 h-10 flex items-center justify-center rounded-full">TR</span>
          </div>

          {/* Desktop меню */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Телефон + CTA + Бургер */}
          <div className="flex items-center gap-2">
            {/* Телефон — десктоп: текст, мобилка: иконка */}
            <a
              href="tel:+79222200491"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold tracking-wide hover:opacity-60 transition-opacity"
            >
              <Phone size={14} />
              +7 (922) 220-04-91
            </a>
            <a
              href="tel:+79222200491"
              className="md:hidden w-10 h-10 flex items-center justify-center"
              aria-label="Позвонить"
            >
              <Phone size={20} />
            </a>

            {/* CTA кнопка */}
            <a
              href="#contacts"
              className="bg-[#CC4422] hover:bg-[#AA3819] text-white rounded-full font-semibold transition-all shadow-lg shadow-orange-800/20 flex items-center
                px-4 h-10 text-sm md:px-6 md:py-2.5 md:text-xs md:uppercase md:tracking-wide md:font-bold
              "
            >
              <span className="md:hidden">Заявка</span>
              <span className="hidden md:inline">Оставить заявку</span>
            </a>
            
            {/* Бургер - только иконка */}
            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Меню"
            >
              <Menu size={22} />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
         <div className="p-6 flex flex-col h-full relative">
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black"
              aria-label="Закрыть меню"
            >
                 <X size={24} />
            </button>

            <div className="mt-20 flex flex-col gap-6">
               {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="text-3xl font-bold text-[#1C1C1C]"
                  >
                    {link.name}
                  </a>
               ))}
            </div>
            
            <div className="mt-auto border-t pt-8 border-gray-100 space-y-3">
               <a
                 href="tel:+79222200491"
                 className="flex items-center justify-center gap-2 w-full bg-[#1C1C1C] text-white py-4 rounded-xl font-bold uppercase tracking-wide"
               >
                 <Phone size={18} />
                 +7 (922) 220-04-91
               </a>
               <a
                 href="#contacts"
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="block text-center w-full bg-[#CC4422] text-white py-4 rounded-xl font-bold uppercase tracking-wide"
               >
                 Оставить заявку
               </a>
            </div>
         </div>
      </div>
    </>
  );
};

export default Navbar;