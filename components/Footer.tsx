import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import QuizForm from './QuizForm';

const Footer: React.FC = () => {
  const formRevealRef = useScrollReveal();

  return (
    <footer className="bg-white pt-20 pb-10" id="contacts">
       <div className="max-w-[1440px] mx-auto px-6 md:px-12">

         <div ref={formRevealRef} className="reveal bg-[#111] rounded-[2.5rem] p-8 md:p-16 mb-20 flex flex-col lg:flex-row gap-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF4D4D] opacity-5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="lg:w-1/2 relative z-10">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                 Записаться на тест-драйв
               </h2>
               <p className="text-gray-400 text-lg mb-10 max-w-md">
                 Выберите, что вам нужно — перезвоним и обсудим детали.
               </p>
            </div>

            <div className="lg:w-1/2 relative z-10">
              <QuizForm />
            </div>
         </div>

         <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pt-8 border-t border-gray-100">
            <div className="max-w-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 border-2 border-black flex items-center justify-center font-bold rounded-full text-xs">TR</div>
                    <span className="font-bold text-xl uppercase tracking-wide">TRACKER</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Производство и продажа вездеходов для самых сложных задач. Надежность, проверенная севером.
                </p>
                <div className="space-y-2 text-sm text-[#1C1C1C]">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400"/>
                        <span className="font-bold">г. Екатеринбург</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-gray-400"/>
                        <span className="font-bold">Гарантия 12 месяцев или 400 моточасов</span>
                    </div>
                </div>
            </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-4 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-black transition-colors">Главная</a>
              <a href="#benefits" className="hover:text-black transition-colors">Преимущества</a>
              <a href="#price" className="hover:text-black transition-colors">Комплектации</a>
              <a href="#specs" className="hover:text-black transition-colors">Характеристики</a>
              <a href="#gallery" className="hover:text-black transition-colors">Галерея</a>
              <a href="#contacts" className="hover:text-black transition-colors">Контакты</a>
          </div>
         </div>

         <div className="text-xs text-gray-300 mt-12 pt-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between gap-2">
            <span>&copy; 2026 TRACKER. Все права защищены.</span>
            <a href="/privacy" className="hover:text-black transition-colors">
              Политика конфиденциальности
            </a>
         </div>
       </div>
    </footer>
  );
};

export default Footer;
