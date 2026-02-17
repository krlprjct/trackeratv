import React, { useState } from 'react';

const Hero: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{name?: string; phone?: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    let c = cleaned.startsWith('8') ? '7' + cleaned.slice(1) : cleaned;
    if (!c.startsWith('7')) c = '7' + c;
    let out = '+7';
    if (c.length > 1) out += ' (' + c.substring(1, 4);
    if (c.length >= 5) out += ') ' + c.substring(4, 7);
    if (c.length >= 8) out += '-' + c.substring(7, 9);
    if (c.length >= 10) out += '-' + c.substring(9, 11);
    return out;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    if (!cleaned) { setPhone(''); return; }
    setPhone(formatPhone(cleaned));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: {name?: string; phone?: string} = {};
    if (!name.trim() || name.trim().length < 2) errs.name = 'Введите имя (минимум 2 символа)';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 11) errs.phone = 'Введите корректный номер';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleaned,
          request_type: 'testdrive',
          client_type: 'individual',
          source: document.referrer || 'Прямой переход',
          page_url: window.location.href,
          website: '',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error);
      setSubmitted(true);
      setName(''); setPhone('');
    } catch {
      alert('Ошибка отправки. Позвоните нам напрямую.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="relative w-full min-h-[95vh] rounded-b-[3rem] overflow-hidden bg-[#0a0a0a] text-white flex flex-col">
      
      <div className="absolute inset-0">
        <img 
          src="public/images/gallery/image1.png" 
          alt="Вездеход TRACKER" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30"></div>
      </div>

      <div className="relative z-10 flex-grow flex flex-col justify-center items-start px-5 md:px-12 lg:px-24 pt-[70px] md:pt-32 pb-6 md:pb-10 max-w-[1440px] mx-auto w-full">
        
        <h1 className="font-bold tracking-tight leading-[0.9] text-[52px] md:text-[88px]">
          Новый вездеход TRACKER
        </h1>
        
        <p className="text-white/90 font-medium text-[17px] leading-[1.35] max-w-[22ch] md:text-xl md:leading-relaxed md:max-w-[32ch] mt-4">
          Для тех, кто едет туда, где дорог нет.
        </p>

        {/* Быстрая форма */}
        {submitted ? (
          <div className="mt-5 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white font-medium">
            ✅ Заявка принята! Свяжемся с вами в ближайшее время.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col sm:flex-row gap-3 w-full max-w-xl">
            <div className="flex flex-col gap-1 flex-1">
              <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={e => setName(e.target.value)}
                className={`px-4 py-3 rounded-full bg-white/10 border text-white placeholder-white/50 outline-none font-medium backdrop-blur-sm focus:bg-white/20 transition-colors ${errors.name ? 'border-red-400' : 'border-white/20'}`}
              />
              {errors.name && <span className="text-red-400 text-xs ml-2">{errors.name}</span>}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={handlePhoneChange}
                className={`px-4 py-3 rounded-full bg-white/10 border text-white placeholder-white/50 outline-none font-medium backdrop-blur-sm focus:bg-white/20 transition-colors ${errors.phone ? 'border-red-400' : 'border-white/20'}`}
              />
              {errors.phone && <span className="text-red-400 text-xs ml-2">{errors.phone}</span>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FF4D4D] hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap disabled:opacity-50 h-12"
            >
              {isSubmitting ? '...' : 'Тест-драйв'}
            </button>
          </form>
        )}

        {/* Вторичная ссылка */}
        <a href="#gallery" className="text-white opacity-90 hover:opacity-100 hover:underline font-semibold transition-all flex items-center underline-offset-4 w-fit text-base mt-3">
          Смотреть галерею
        </a>

        {/* Stats */}
        <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-12 bg-black/40 backdrop-blur-md rounded-2xl md:rounded-3xl py-4 px-5 md:py-8 md:px-16 border border-white/10 w-full md:w-fit mt-8 md:mt-16">
           <div className="flex flex-col items-start justify-center min-h-[60px]">
              <span className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold text-white whitespace-nowrap leading-none">Дизель Kubota</span>
              <span className="text-[11px] md:text-xs text-gray-400 uppercase tracking-[0.06em] mt-1.5 md:mt-2">Японское качество</span>
           </div>
           <div className="hidden md:block w-px h-12 md:h-16 bg-white/20"></div>
           <div className="flex flex-col items-start justify-center min-h-[60px]">
              <span className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold text-white whitespace-nowrap leading-none">до 1000 кг</span>
              <span className="text-[11px] md:text-xs text-gray-400 uppercase tracking-[0.06em] mt-1.5 md:mt-2">грузоподъёмность</span>
           </div>
           <div className="hidden md:block w-px h-12 md:h-16 bg-white/20"></div>
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