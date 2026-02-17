import React from 'react';

const Hero: React.FC = () => {
  return (
    <header className="relative w-full min-h-[95vh] rounded-b-[3rem] overflow-hidden bg-[#0a0a0a] text-white flex flex-col">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="public/images/gallery/image1.png" 
          alt="Вездеход TRACKER" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col justify-center items-start px-5 md:px-12 lg:px-24 pt-[70px] md:pt-32 pb-6 md:pb-10 max-w-[1440px] mx-auto w-full">
        
        {/* Заголовок */}
        <h1 className="font-bold tracking-tight leading-[0.9] text-[52px] md:text-[88px]">
          Новый вездеход TRACKER
        </h1>
        
        {/* Подзаголовок - короткий, без Kubota */}
        <p className="text-white/90 font-medium text-[17px] leading-[1.35] max-w-[22ch] md:text-xl md:leading-relaxed md:max-w-[32ch] mt-4">
          Для тех, кто едет туда, где дорог нет.
        </p>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-5">
           <button className="bg-white text-black hover:bg-gray-200 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all w-fit h-12 md:h-auto text-base">
             Тест-драйв
           </button>
           <a href="#gallery" className="text-white opacity-90 hover:opacity-100 hover:underline font-semibold transition-all flex items-center underline-offset-4 w-fit text-base">
             Смотреть галерею
           </a>
        </div>

        {/* Stats Grid - 2+1 на мобилке */}
        <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-12 bg-black/40 backdrop-blur-md rounded-2xl md:rounded-3xl py-4 px-5 md:py-8 md:px-16 border border-white/10 w-full md:w-fit mt-8 md:mt-16">
           
           {/* Дизель Kubota */}
           <div className="flex flex-col items-start justify-center min-h-[60px]">
              <span className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold text-white whitespace-nowrap leading-none">Дизель Kubota</span>
              <span className="text-[11px] md:text-xs text-gray-400 uppercase tracking-[0.06em] mt-1.5 md:mt-2">Японское качество</span>
           </div>
           
           <div className="hidden md:block w-px h-12 md:h-16 bg-white/20"></div>
           
           {/* до 1000 кг */}
           <div className="flex flex-col items-start justify-center min-h-[60px]">
              <span className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold text-white whitespace-nowrap leading-none">до 1000 кг</span>
              <span className="text-[11px] md:text-xs text-gray-400 uppercase tracking-[0.06em] mt-1.5 md:mt-2">грузоподъёмность</span>
           </div>
           
           <div className="hidden md:block w-px h-12 md:h-16 bg-white/20"></div>

           {/* до 1000 км - на всю ширину на мобилке */}
           <div className="flex flex-col items-start justify-center min-h-[60px] col-span-2 md:col-span-1">
              <span className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold text-white whitespace-nowrap leading-none">до 1000 км</span>
              <span className="text-[11px] md:text-xs text-gray-400 uppercase tracking-[0.06em] mt-1.5 md:mt-2">запас хода</span>
           </div>

        </div>
      </div>
    </header>
  );
};

export default Hero;