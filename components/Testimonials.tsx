import React, { useState } from 'react';
import { PlayCircle, X } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  // Закрытие по Esc
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeVideo();
    };
    if (isVideoOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isVideoOpen]);

  return (
    <section className="py-24 bg-white" id="gallery">
       <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          
          {/* Заголовок блока - выровнен влево на мобилке */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-3 md:mb-12 gap-3 md:gap-6 items-start">
             <h2 className="text-4xl md:text-6xl font-bold text-[#1C1C1C] leading-none tracking-tight text-left">
               Создан для<br/>реальных задач
             </h2>
             
             {/* Компактная кнопка видео */}
             <button 
               onClick={openVideo}
               className="flex items-center gap-2 text-[#1C1C1C] font-semibold text-base hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#FF4D4D] focus:ring-offset-2 rounded-sm"
               aria-label="Открыть видео реального применения вездехода TRACKER"
             >
                <PlayCircle size={20} />
                Смотреть реальное видео
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
             
             {/* Большая карточка */}
             <div className="md:col-span-2 md:row-span-2 relative rounded-[2rem] overflow-hidden group min-h-[300px]">
                <img 
                  src="components/assets/big.JPG" 
                  alt="Зимник" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                   <h3 className="text-xl font-bold">Экспедиции</h3>
                </div>
             </div>

             {/* Карточка 2 */}
             <div className="md:col-span-1 md:row-span-2 relative rounded-[2rem] overflow-hidden group min-h-[300px]">
                <img 
                   src="components/assets/long.jpg" 
                   alt="Лес" 
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-bold text-lg">Охотничьи угодья</h3>
                </div>
             </div>

             {/* Карточка 3 */}
             <div className="md:col-span-1 relative rounded-[2rem] overflow-hidden group min-h-[200px]">
                <img 
                   src="components/assets/zakat.JPG" 
                   alt="Вода" 
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <h3 className="font-bold text-sm">Водные преграды</h3>
                </div>
             </div>

             {/* Карточка 4 - ЗАМЕНЕНА НА ФОТО */}
             <div className="md:col-span-1 relative rounded-[2rem] overflow-hidden group min-h-[200px]">
                <img 
                   src="components/assets/last.png" 
                   alt="Бездорожье" 
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-4 left-6 text-white">
                  <h3 className="font-bold text-sm">Бездорожье</h3>
                </div>
             </div>

          </div>
       </div>

       {/* Модальное окно для ВЕРТИКАЛЬНОГО видео */}
       {isVideoOpen && (
         <div 
           className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
           onClick={closeVideo}
           role="dialog"
           aria-modal="true"
           aria-labelledby="video-modal-title"
         >
           <div 
             className="relative w-full md:w-auto"
             style={{ maxWidth: 'min(92vw, 420px)', maxHeight: '82vh' }}
             onClick={(e) => e.stopPropagation()}
           >
             <button
               onClick={closeVideo}
               className="absolute -top-12 right-0 text-white hover:text-[#FF4D4D] transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2"
               aria-label="Закрыть видео"
             >
               <X size={32} />
             </button>
             
             {/* Контейнер для вертикального видео 9:16 */}
             <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '9 / 16' }}>
               <video 
                 controls 
                 autoPlay
                 className="w-full h-full object-contain"
                 id="video-modal-title"
               >
                 <source src="components/assets/video.mov" type="video/mp4" />
                 Ваш браузер не поддерживает видео.
               </video>
             </div>
           </div>
         </div>
       )}
    </section>
  );
};

export default Testimonials;