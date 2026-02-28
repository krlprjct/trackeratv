import React, { useState } from 'react';
import { Send, MapPin, ShieldCheck, AlertCircle, Phone } from 'lucide-react';
import { useYandexMetrika } from '../hooks/useYandexMetrika';

interface FormData {
  name: string;
  phone: string;
  requestType: string;
  clientType: string;
  consent: boolean; // ← ДОБАВЛЕНО
}

interface FormErrors {
  name?: string;
  phone?: string;
  requestType?: string;
  clientType?: string;
  consent?: string; // ← ДОБАВЛЕНО
}

const Footer: React.FC = () => {
  const { reachGoal } = useYandexMetrika();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    requestType: '',
    clientType: '',
    consent: false, // ← ДОБАВЛЕНО
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameBlacklist = [
    'test', 'тест', 'asdf', 'qwerty', 'абв', 'ыва',
    'admin', 'user', 'null', 'undefined', 'delete',
    'fuck', 'shit', 'ass', 'хуй', 'пизд', 'ебан'
  ];

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'Введите ваше имя';
    if (name.trim().length < 2) return 'Имя должно содержать минимум 2 символа';
    if (!/^[А-ЯЁа-яёA-Za-z\s-]+$/.test(name)) return 'Имя может содержать только буквы, пробелы и дефис';
    const nameLower = name.toLowerCase();
    if (nameBlacklist.some(blocked => nameLower.includes(blocked))) return 'Пожалуйста, введите настоящее имя';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned) return 'Введите номер телефона';
    if (cleaned.length !== 11) return 'Номер должен содержать 11 цифр';
    if (!cleaned.startsWith('7') && !cleaned.startsWith('8')) return 'Номер должен начинаться с +7 или 8';
    return undefined;
  };

  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) return '';
    let formatted = '+7';
    if (cleaned.length > 1) formatted += ' (' + cleaned.substring(1, 4);
    if (cleaned.length >= 5) formatted += ') ' + cleaned.substring(4, 7);
    if (cleaned.length >= 8) formatted += '-' + cleaned.substring(7, 9);
    if (cleaned.length >= 10) formatted += '-' + cleaned.substring(9, 11);
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleaned = e.target.value.replace(/\D/g, '');
    if (cleaned.startsWith('8')) cleaned = '7' + cleaned.substring(1);
    if (!cleaned) { setFormData(prev => ({ ...prev, phone: '' })); return; }
    if (!cleaned.startsWith('7')) cleaned = '7' + cleaned;
    setFormData(prev => ({ ...prev, phone: formatPhone(cleaned) }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    if (!formData.requestType) newErrors.requestType = 'Выберите, что вам нужно';
    if (!formData.clientType) newErrors.clientType = 'Выберите тип клиента';
    if (!formData.consent) newErrors.consent = 'Необходимо согласие на обработку данных'; // ← ДОБАВЛЕНО
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const newErrors = { ...errors };
    if (field === 'name') {
      const error = validateName(formData.name);
      if (error) newErrors.name = error; else delete newErrors.name;
    } else if (field === 'phone') {
      const error = validatePhone(formData.phone);
      if (error) newErrors.phone = error; else delete newErrors.phone;
    } else if (field === 'requestType') {
      if (!formData.requestType) newErrors.requestType = 'Выберите, что вам нужно'; else delete newErrors.requestType;
    } else if (field === 'clientType') {
      if (!formData.clientType) newErrors.clientType = 'Выберите тип клиента'; else delete newErrors.clientType;
    } else if (field === 'consent') {
      if (!formData.consent) newErrors.consent = 'Необходимо согласие'; else delete newErrors.consent;
    }
    setErrors(newErrors);
  };

  const getButtonText = (): string => {
    if (isSubmitting) return 'Отправка...';
    switch (formData.requestType) {
      case 'testdrive': return 'Записаться';
      case 'selection': return 'Получить подбор';
      case 'both': return 'Записаться';
      default: return 'Записаться';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, requestType: true, clientType: true, consent: true });
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          request_type: formData.requestType,
          client_type: formData.clientType,
          source: document.referrer || 'Прямой переход',
          page_url: window.location.href,
          utm_source: urlParams.get('utm_source') || '',
          utm_medium: urlParams.get('utm_medium') || '',
          utm_campaign: urlParams.get('utm_campaign') || '',
          utm_content: urlParams.get('utm_content') || '',
          utm_term: urlParams.get('utm_term') || '',
        }),
      });
      
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Ошибка отправки');
      
      // Отправка события в Яндекс.Метрику
      reachGoal('form_submit');
      
      alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
      setFormData({ name: '', phone: '', requestType: '', clientType: '', consent: false });
      setTouched({});
      setErrors({});
    } catch (error: any) {
      console.error('Submit error:', error);
      alert('❌ Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам напрямую.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ErrorMessage: React.FC<{ error?: string }> = ({ error }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
        <AlertCircle size={12} />
        <span>{error}</span>
      </div>
    );
  };

  return (
    <footer className="bg-white pt-20 pb-10" id="contacts">
       <div className="max-w-[1440px] mx-auto px-6 md:px-12">
         
         <div className="bg-[#111] rounded-[2.5rem] p-8 md:p-16 mb-20 flex flex-col lg:flex-row gap-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF4D4D] opacity-5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="lg:w-1/2 relative z-10">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                 Записаться на тест-драйв
               </h2>
               <p className="text-gray-400 text-lg mb-10 max-w-md">
                 Оставь имя и телефон — перезвоним и запишем на тест-драйв или поможем с подбором.
               </p>
            </div>

            <div className="lg:w-1/2 bg-white rounded-3xl p-8 shadow-2xl relative z-10">
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Honeypot для защиты от ботов */}
                    <input 
                      type="text" 
                      name="website" 
                      style={{ position: 'absolute', left: '-9999px' }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                              Имя <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text" placeholder="Иван" value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              onBlur={() => handleBlur('name')}
                              className={`w-full px-4 py-4 rounded-xl bg-[#F5F5F7] border transition-colors outline-none font-medium ${touched.name && errors.name ? 'border-red-500' : 'border-transparent focus:bg-white focus:border-black'}`}
                            />
                            {touched.name && <ErrorMessage error={errors.name} />}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                              Телефон <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="tel" placeholder="+7 (___) ___-__-__" value={formData.phone}
                              onChange={handlePhoneChange}
                              onBlur={() => handleBlur('phone')}
                              className={`w-full px-4 py-4 rounded-xl bg-[#F5F5F7] border transition-colors outline-none font-medium ${touched.phone && errors.phone ? 'border-red-500' : 'border-transparent focus:bg-white focus:border-black'}`}
                            />
                            {touched.phone && <ErrorMessage error={errors.phone} />}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                          Что нужно? <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={formData.requestType}
                          onChange={(e) => setFormData(prev => ({ ...prev, requestType: e.target.value }))}
                          onBlur={() => handleBlur('requestType')}
                          className={`w-full px-4 py-4 rounded-xl bg-[#F5F5F7] border transition-colors outline-none appearance-none font-medium ${formData.requestType ? 'text-gray-900' : 'text-gray-400'} ${touched.requestType && errors.requestType ? 'border-red-500' : 'border-transparent focus:bg-white focus:border-black'}`}
                        >
                            <option value="" disabled>Выберите вариант</option>
                            <option value="testdrive">Тест-драйв</option>
                            <option value="selection">Подбор комплектации</option>
                            <option value="both">Тест-драйв + подбор</option>
                        </select>
                        {touched.requestType && <ErrorMessage error={errors.requestType} />}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                          Тип клиента <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={formData.clientType}
                          onChange={(e) => setFormData(prev => ({ ...prev, clientType: e.target.value }))}
                          onBlur={() => handleBlur('clientType')}
                          className={`w-full px-4 py-4 rounded-xl bg-[#F5F5F7] border transition-colors outline-none appearance-none font-medium ${formData.clientType ? 'text-gray-900' : 'text-gray-400'} ${touched.clientType && errors.clientType ? 'border-red-500' : 'border-transparent focus:bg-white focus:border-black'}`}
                        >
                            <option value="" disabled>Выберите вариант</option>
                            <option value="individual">Физлицо</option>
                            <option value="legal">Юрлицо</option>
                            <option value="leasing">Лизинг</option>
                        </select>
                        {touched.clientType && <ErrorMessage error={errors.clientType} />}
                    </div>

                    {/* ЧЕКБОКС СОГЛАСИЯ */}
                    <div className="pt-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input 
                              type="checkbox"
                              checked={formData.consent}
                              onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                              onBlur={() => handleBlur('consent')}
                              className="mt-0.5 w-5 h-5 rounded border-2 border-gray-300 text-[#FF4D4D] focus:ring-2 focus:ring-[#FF4D4D] focus:ring-offset-2 cursor-pointer"
                            />
                            <span className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                              Я согласен на обработку{' '}
                              <a href="/privacy" target="_blank" className="text-[#FF4D4D] underline hover:text-red-600">
                                персональных данных
                              </a>
                              {' '}и получение информационных сообщений <span className="text-red-500">*</span>
                            </span>
                        </label>
                        {touched.consent && <ErrorMessage error={errors.consent} />}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-[#FF4D4D] hover:bg-red-600 text-white font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-red-500/20 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {getButtonText()}
                        <Send size={18} className="flex-shrink-0" />
                    </button>
                </form>
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
                    <a href="tel:+79222200491" className="flex items-center gap-2 hover:text-[#FF4D4D] transition-colors group">
                        <Phone size={16} className="text-gray-400 group-hover:text-[#FF4D4D]"/>
                        <span className="font-bold">+7 (922) 220-04-91</span>
                    </a>
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
              <a href="#benefits" className="hover:text-black transition-colors">Модельный ряд</a>
              <a href="#specs" className="hover:text-black transition-colors">Характеристики</a>
              <a href="#price" className="hover:text-black transition-colors">Наличие</a>
              <a href="#gallery" className="hover:text-black transition-colors">Галерея</a>
              <a href="#contacts" className="hover:text-black transition-colors">Контакты</a>
          </div>
         </div>

         <div className="text-xs text-gray-300 mt-12 pt-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between gap-2">
            <span>© 2026 TRACKER. Все права защищены.</span>
            <a href="/privacy" target="_blank" className="hover:text-black transition-colors">
              Политика конфиденциальности
            </a>
         </div>
       </div>
    </footer>
  );
};

export default Footer;