import React, { useState } from 'react';
import { Send, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  requestType: string;
  clientType: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  requestType?: string;
  clientType?: string;
}

const Footer: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    requestType: '',
    clientType: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Blacklist для фейковых имён
  const nameBlacklist = [
    'test', 'тест', 'asdf', 'qwerty', 'абв', 'ыва',
    'admin', 'user', 'null', 'undefined', 'delete',
    'fuck', 'shit', 'ass', 'хуй', 'пизд', 'ебан'
  ];

  // Валидация имени
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Введите ваше имя';
    }
    if (name.trim().length < 2) {
      return 'Имя должно содержать минимум 2 символа';
    }
    if (!/^[А-ЯЁа-яёA-Za-z\s-]+$/.test(name)) {
      return 'Имя может содержать только буквы, пробелы и дефис';
    }
    const nameLower = name.toLowerCase();
    if (nameBlacklist.some(blocked => nameLower.includes(blocked))) {
      return 'Пожалуйста, введите настоящее имя';
    }
    return undefined;
  };

  // Валидация телефона
  const validatePhone = (phone: string): string | undefined => {
    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned) {
      return 'Введите номер телефона';
    }
    if (cleaned.length !== 11) {
      return 'Номер должен содержать 11 цифр';
    }
    if (!cleaned.startsWith('7') && !cleaned.startsWith('8')) {
      return 'Номер должен начинаться с +7 или 8';
    }
    return undefined;
  };

  // Маска для телефона
  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) return '';
    
    let formatted = '+7';
    if (cleaned.length > 1) {
      formatted += ' (' + cleaned.substring(1, 4);
    }
    if (cleaned.length >= 5) {
      formatted += ') ' + cleaned.substring(4, 7);
    }
    if (cleaned.length >= 8) {
      formatted += '-' + cleaned.substring(7, 9);
    }
    if (cleaned.length >= 10) {
      formatted += '-' + cleaned.substring(9, 11);
    }
    return formatted;
  };

  // Обработка изменения телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    let cleaned = input.replace(/\D/g, '');
    
    // Автоматически добавляем 7 если пользователь начинает с 8
    if (cleaned.startsWith('8')) {
      cleaned = '7' + cleaned.substring(1);
    }
    // Если пользователь стёр всё, оставляем пустым
    if (!cleaned) {
      setFormData(prev => ({ ...prev, phone: '' }));
      return;
    }
    // Если не начинается с 7, добавляем 7
    if (!cleaned.startsWith('7')) {
      cleaned = '7' + cleaned;
    }
    
    const formatted = formatPhone(cleaned);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  // Валидация всей формы
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    if (!formData.requestType) {
      newErrors.requestType = 'Выберите, что вам нужно';
    }

    if (!formData.clientType) {
      newErrors.clientType = 'Выберите тип клиента';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка blur (потеря фокуса)
  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const newErrors = { ...errors };
    
    if (field === 'name') {
      const error = validateName(formData.name);
      if (error) newErrors.name = error;
      else delete newErrors.name;
    } else if (field === 'phone') {
      const error = validatePhone(formData.phone);
      if (error) newErrors.phone = error;
      else delete newErrors.phone;
    } else if (field === 'requestType') {
      if (!formData.requestType) newErrors.requestType = 'Выберите, что вам нужно';
      else delete newErrors.requestType;
    } else if (field === 'clientType') {
      if (!formData.clientType) newErrors.clientType = 'Выберите тип клиента';
      else delete newErrors.clientType;
    }
    
    setErrors(newErrors);
  };

// Обработка отправки формы
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Помечаем все поля как touched
  setTouched({
    name: true,
    phone: true,
    requestType: true,
    clientType: true,
  });

  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);

  try {
    // Собираем UTM параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name.trim(),
        phone: formData.phone.replace(/\D/g, ''),
        request_type: formData.requestType,
        client_type: formData.clientType,
        usage: '', // Можешь добавить поле, если нужно
        source: document.referrer || 'Прямой переход',
        page_url: window.location.href,
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || '',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_content: urlParams.get('utm_content') || '',
        utm_term: urlParams.get('utm_term') || '',
        // Honeypot (скрытое поле для защиты от ботов)
        website: '',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Ошибка отправки');
    }

    // Успех!
    alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
    
    // Очистка формы
    setFormData({
      name: '',
      phone: '',
      requestType: '',
      clientType: '',
    });
    setTouched({});
    setErrors({});
    
  } catch (error: any) {
    console.error('Submit error:', error);
    alert('❌ Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам напрямую.');
  } finally {
    setIsSubmitting(false);
  }
};

  // Компонент для отображения ошибки
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
         
         {/* Контактная форма (Черный блок) */}
         <div className="bg-[#111] rounded-[2.5rem] p-8 md:p-16 mb-20 flex flex-col lg:flex-row gap-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF4D4D] opacity-5 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="lg:w-1/2 relative z-10">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                 Получить подбор под задачу
               </h2>
               <p className="text-gray-400 text-lg mb-10 max-w-md">
                 Оставь контакты — поможем с подбором и/или запишем на тест-драйв.
               </p>
            </div>

            <div className="lg:w-1/2 bg-white rounded-3xl p-8 shadow-2xl relative z-10">
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Имя */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                              Имя <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text" 
                              placeholder="Иван" 
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              onBlur={() => handleBlur('name')}
                              className={`w-full px-4 py-4 rounded-xl bg-[#F5F5F7] border transition-colors outline-none font-medium ${
                                touched.name && errors.name 
                                  ? 'border-red-500 focus:border-red-500' 
                                  : 'border-transparent focus:bg-white focus:border-black'
                              }`}
                              aria-invalid={touched.name && !!errors.name}
                              aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                            />
                            {touched.name && <ErrorMessage error={errors.name} />}
                        </div>

                        {/* Телефон */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                              Телефон <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="tel" 
                              placeholder="+7 (___) ___-__-__" 
                              value={formData.phone}
                              onChange={handlePhoneChange}
                              onBlur={() => handleBlur('phone')}
                              className={`w-full px-4 py-4 rounded-xl bg-[#F5F5F7] border transition-colors outline-none font-medium ${
                                touched.phone && errors.phone 
                                  ? 'border-red-500 focus:border-red-500' 
                                  : 'border-transparent focus:bg-white focus:border-black'
                              }`}
                              aria-invalid={touched.phone && !!errors.phone}
                              aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
                            />
                            {touched.phone && <ErrorMessage error={errors.phone} />}
                        </div>
                    </div>

                    {/* Что нужно */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                          Что нужно? <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={formData.requestType}
                          onChange={(e) => setFormData(prev => ({ ...prev, requestType: e.target.value }))}
                          onBlur={() => handleBlur('requestType')}
                          className={`w-full px-4 py-4 rounded-xl bg-[#F5F5F7] border transition-colors outline-none appearance-none font-medium ${
                            formData.requestType ? 'text-gray-900' : 'text-gray-400'
                          } ${
                            touched.requestType && errors.requestType 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-transparent focus:bg-white focus:border-black'
                          }`}
                          aria-invalid={touched.requestType && !!errors.requestType}
                          aria-describedby={touched.requestType && errors.requestType ? 'request-error' : undefined}
                        >
                            <option value="" disabled>Выберите вариант</option>
                            <option value="selection">Подбор комплектации</option>
                            <option value="testdrive">Тест-драйв</option>
                            <option value="both">Подбор + тест-драйв</option>
                        </select>
                        {touched.requestType && <ErrorMessage error={errors.requestType} />}
                    </div>

                    {/* Тип клиента */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
                          Тип клиента <span className="text-red-500">*</span>
                        </label>
                        <select 
                          value={formData.clientType}
                          onChange={(e) => setFormData(prev => ({ ...prev, clientType: e.target.value }))}
                          onBlur={() => handleBlur('clientType')}
                          className={`w-full px-4 py-4 rounded-xl bg-[#F5F5F7] border transition-colors outline-none appearance-none font-medium ${
                            formData.clientType ? 'text-gray-900' : 'text-gray-400'
                          } ${
                            touched.clientType && errors.clientType 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-transparent focus:bg-white focus:border-black'
                          }`}
                          aria-invalid={touched.clientType && !!errors.clientType}
                          aria-describedby={touched.clientType && errors.clientType ? 'client-error' : undefined}
                        >
                            <option value="" disabled>Выберите вариант</option>
                            <option value="individual">Физлицо</option>
                            <option value="legal">Юрлицо</option>
                            <option value="leasing">Лизинг</option>
                        </select>
                        {touched.clientType && <ErrorMessage error={errors.clientType} />}
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#FF4D4D] hover:bg-red-600 text-white font-bold py-5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-red-500/20 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Отправка...' : 'Получить подбор'}
                        <Send size={20} />
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-3">
                        Нажимая кнопку, вы соглашаетесь с политикой обработки данных.
                    </p>
                </form>
            </div>
         </div>

         {/* Нижняя часть футера */}
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
                        <span className="font-bold">Гарантия 12 месяцев</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-4 text-sm font-medium text-gray-600">
                <a href="#" className="hover:text-black transition-colors">Главная</a>
                <a href="#price" className="hover:text-black transition-colors">Лизинг</a>
                <a href="#benefits" className="hover:text-black transition-colors">Модельный ряд</a>
                <a href="#" className="hover:text-black transition-colors">Доставка</a>
                <a href="#specs" className="hover:text-black transition-colors">Характеристики</a>
                <a href="#" className="hover:text-black transition-colors">Сервис</a>
                <a href="#price" className="hover:text-black transition-colors">Наличие</a>
                <a href="#contacts" className="hover:text-black transition-colors">Контакты</a>
            </div>

         </div>

         <div className="text-xs text-gray-300 mt-12 pt-4 border-t border-gray-50 flex justify-between">
            <span>© 2024 TRACKER. Все права защищены.</span>
            <span>Политика конфиденциальности</span>
         </div>

       </div>
    </footer>
  );
};

export default Footer;