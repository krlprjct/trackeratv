import React, { useState, useEffect } from 'react';
import { PlayCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface GalleryCategory {
  title: string;
  cover: string;
  alt: string;
  images: string[];
}

const galleryData: GalleryCategory[] = [
  {
    title: "Экспедиции",
    cover: "/images/gallery/big.webp",
    alt: "Экспедиции TRACKER",
    images: [
      "/images/gallery/big.webp",
      "/images/gallery/IMG_E4497.webp",
      "/images/gallery/IMG_E4498.webp",
      "/images/gallery/IMG_E4504.webp",
      "/images/gallery/IMG_E4407.webp"
    ]
  },
  {
    title: "Охотничьи угодья",
    cover: "/images/gallery/long.webp",
    alt: "Охотничьи угодья",
    images: [
      "/images/gallery/long.webp",
      "/images/gallery/IMG_0498.webp",
      "/images/gallery/IMG_8618.webp",
      "/images/gallery/LCVE4663.webp"
    ]
  },
  {
    title: "Водные преграды",
    cover: "/images/gallery/image1.webp",
    alt: "Водные преграды",
    images: [
      "/images/gallery/image1.webp",
      "/images/gallery/IMG_2587.webp",
      "/images/gallery/IMG_2590.webp",
      "/images/gallery/IMG_E4435.webp",
      "/images/gallery/IMG_4448.webp"
    ]
  },
  {
    title: "Бездорожье",
    cover: "/images/gallery/last.webp",
    alt: "Бездорожье",
    images: [
      "/images/gallery/last.webp",
      "/images/gallery/DSC01624.webp",
      "/images/gallery/DSC01790.webp",
      "/images/gallery/IMG_E4406.webp"
    ]
  }
];

const Testimonials: React.FC = () => {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal({ threshold: 0.1 });
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<GalleryCategory | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  const openLightbox = (category: GalleryCategory, imageIndex: number = 0) => {
    setCurrentCategory(category);
    setCurrentImageIndex(imageIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setCurrentCategory(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!currentCategory) return;
    setCurrentImageIndex((prev) => 
      prev === currentCategory.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!currentCategory) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? currentCategory.images.length - 1 : prev - 1
    );
  };

  // Управление с клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVideoOpen && e.key === 'Escape') {
        closeVideo();
      }
      if (isLightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVideoOpen, isLightboxOpen, currentCategory]);

  // Блокировка скролла
  useEffect(() => {
    if (isVideoOpen || isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVideoOpen, isLightboxOpen]);

  // Свайп на мобильном
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextImage();
    }
    if (touchStart - touchEnd < -75) {
      prevImage();
    }
  };

  return (
    <section className="py-24 bg-white" id="gallery">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Заголовок + кнопка видео */}
        <div ref={headerRef} className="reveal flex flex-col md:flex-row md:justify-between md:items-end mb-3 md:mb-12 gap-3 md:gap-6 items-start">
          <h2 className="text-4xl md:text-6xl font-bold text-[#1C1C1C] leading-none tracking-tight text-left">
            Создан для<br />реальных задач
          </h2>

          <button
            onClick={openVideo}
            className="flex items-center gap-2 text-[#1C1C1C] font-semibold text-base hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#FF4D4D] focus:ring-offset-2 rounded-sm"
            aria-label="Открыть видео реального применения вездехода TRACKER"
          >
            <PlayCircle size={20} />
            Смотреть реальное видео
          </button>
        </div>

        {/* Сетка карточек */}
        <div ref={gridRef} className="reveal grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
          {galleryData.map((category, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(category)}
              className={`relative rounded-[2rem] overflow-hidden group cursor-pointer ${
                idx === 0 ? 'md:col-span-2 md:row-span-2 min-h-[300px]' :
                idx === 1 ? 'md:col-span-1 md:row-span-2 min-h-[300px]' :
                'md:col-span-1 min-h-[200px]'
              }`}
            >
              <img
                src={category.cover}
                alt={category.alt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className={`absolute ${idx < 2 ? 'bottom-6 left-6' : 'bottom-4 left-6'} text-white`}>
                <h3 className={`font-bold ${idx === 0 ? 'text-xl' : idx === 1 ? 'text-lg' : 'text-sm'}`}>
                  {category.title}
                </h3>
                <p className="text-xs text-white/80 mt-1">{category.images.length} фото</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модалка видео */}
      {isVideoOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeVideo}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="relative w-full md:w-auto"
            style={{ maxWidth: 'min(92vw, 420px)', maxHeight: '82vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              className="absolute -top-2 -right-2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors shadow-lg"
              aria-label="Закрыть видео"
            >
              <X size={24} strokeWidth={2.5} />
            </button>

            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '9 / 16' }}>
              <video controls autoPlay className="w-full h-full object-contain">
                <source src="/images/gallery/video.mov" type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox галерея */}
      {isLightboxOpen && currentCategory && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={closeLightbox}
        >
          {/* Хедер */}
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="text-white">
              <h3 className="text-lg md:text-xl font-bold">{currentCategory.title}</h3>
              <p className="text-sm text-white/70">
                {currentImageIndex + 1} / {currentCategory.images.length}
              </p>
            </div>
            <button
              onClick={closeLightbox}
              className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              aria-label="Закрыть галерею"
            >
              <X size={24} />
            </button>
          </div>

          {/* Основное изображение */}
          <div 
            className="flex-1 flex items-center justify-center relative px-4 md:px-16"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={currentCategory.images[currentImageIndex]}
              alt={`${currentCategory.title} ${currentImageIndex + 1}`}
              className="max-h-[60vh] md:max-h-[70vh] max-w-full object-contain rounded-lg animate-fade-in"
            />

            {/* Кнопки навигации */}
            {currentCategory.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  aria-label="Предыдущее фото"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  aria-label="Следующее фото"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>

          {/* Превью-тумбнейлы */}
          <div className="p-4 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 justify-center">
              {currentCategory.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all ${
                    idx === currentImageIndex 
                      ? 'ring-2 ring-white scale-105' 
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Превью ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;