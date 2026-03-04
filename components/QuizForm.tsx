import React, { useState, useRef } from 'react';
import { Send, ArrowLeft, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import { useYandexMetrika } from '../hooks/useYandexMetrika';

const QuizForm: React.FC = () => {
  const { reachGoal } = useYandexMetrika();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Данные шагов 1-2 хранятся в ref (не вызывают ре-рендер)
  const requestTypeRef = useRef('');
  const clientTypeRef = useRef('');

  // Инпуты шага 3 — uncontrolled (без setState на каждый символ)
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  const requestOptions = [
    { value: 'testdrive', label: 'Тест-драйв', desc: 'Приезжайте и оцените вездеход лично' },
    { value: 'selection', label: 'Подбор комплектации', desc: 'Поможем выбрать оптимальный вариант' },
    { value: 'both', label: 'Тест-драйв + подбор', desc: 'Полная консультация и тест' },
  ];

  const clientOptions = [
    { value: 'individual', label: 'Физлицо', desc: 'Покупка для личных целей' },
    { value: 'legal', label: 'Юрлицо', desc: 'Для организации, с НДС 22%' },
    { value: 'leasing', label: 'Лизинг', desc: 'Рассрочка через лизинговую компанию' },
  ];

  const formatPhone = (raw: string): string => {
    const d = raw.replace(/\D/g, '');
    if (!d) return '';
    let f = '+7';
    if (d.length > 1) f += ' (' + d.substring(1, 4);
    if (d.length >= 5) f += ') ' + d.substring(4, 7);
    if (d.length >= 8) f += '-' + d.substring(7, 9);
    if (d.length >= 10) f += '-' + d.substring(9, 11);
    return f;
  };

  const handlePhoneInput = () => {
    const el = phoneRef.current;
    if (!el) return;
    let cleaned = el.value.replace(/\D/g, '');
    if (cleaned.startsWith('8')) cleaned = '7' + cleaned.substring(1);
    if (!cleaned) { el.value = ''; return; }
    if (!cleaned.startsWith('7')) cleaned = '7' + cleaned;
    if (cleaned.length > 11) cleaned = cleaned.substring(0, 11);
    el.value = formatPhone(cleaned);
  };

  const handleStep1 = (value: string) => {
    requestTypeRef.current = value;
    setStep(2);
  };

  const handleStep2 = (value: string) => {
    clientTypeRef.current = value;
    setStep(3);
  };

  const nameBlacklist = ['test', 'тест', 'asdf', 'qwerty', 'абв', 'ыва', 'admin', 'null', 'fuck', 'shit', 'хуй', 'пизд', 'ебан'];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const name = (nameRef.current?.value || '').trim();
    if (!name) newErrors.name = 'Введите ваше имя';
    else if (name.length < 2) newErrors.name = 'Минимум 2 символа';
    else if (!/^[А-ЯЁа-яёA-Za-z\s-]+$/.test(name)) newErrors.name = 'Только буквы';
    else if (nameBlacklist.some(b => name.toLowerCase().includes(b))) newErrors.name = 'Введите настоящее имя';

    const phone = (phoneRef.current?.value || '').replace(/\D/g, '');
    if (!phone) newErrors.phone = 'Введите номер телефона';
    else if (phone.length !== 11) newErrors.phone = 'Номер должен содержать 11 цифр';
    else if (!phone.startsWith('7') && !phone.startsWith('8')) newErrors.phone = 'Номер должен начинаться с +7';

    if (!consentRef.current?.checked) newErrors.consent = 'Необходимо согласие';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: (nameRef.current?.value || '').trim(),
          phone: (phoneRef.current?.value || '').replace(/\D/g, ''),
          request_type: requestTypeRef.current,
          client_type: clientTypeRef.current,
          source: document.referrer || 'Прямой переход',
          page_url: window.location.href,
          utm_source: urlParams.get('utm_source') || '',
          utm_medium: urlParams.get('utm_medium') || '',
          utm_campaign: urlParams.get('utm_campaign') || '',
          utm_content: urlParams.get('utm_content') || '',
          utm_term: urlParams.get('utm_term') || '',
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Ошибка отправки');

      reachGoal('form_submit');
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Submit error:', error);
      alert('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Заявка отправлена!
        </h3>
        <p className="text-gray-400 text-lg mb-6 max-w-sm mx-auto">
          Мы свяжемся с вами в течение часа в рабочее время.
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Phone size={14} />
          <span>Хотите быстрее? Звоните: <a href="tel:+79222200491" className="text-white font-bold hover:text-[#FF4D4D]">+7 (922) 220-04-91</a> — Владимир</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 font-medium">Шаг {step} из 3</span>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
              <ArrowLeft size={14} /> Назад
            </button>
          )}
        </div>
        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-[#FF4D4D] rounded-full" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      {step === 1 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-5">Что вам нужно?</h3>
          <div className="space-y-3">
            {requestOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStep1(opt.value)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-700 active:border-[#FF4D4D] bg-gray-800"
              >
                <div className="font-bold text-white text-lg">{opt.label}</div>
                <div className="text-sm text-gray-400 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-5">Вы покупаете как?</h3>
          <div className="space-y-3">
            {clientOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStep2(opt.value)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-700 active:border-[#FF4D4D] bg-gray-800"
              >
                <div className="font-bold text-white text-lg">{opt.label}</div>
                <div className="text-sm text-gray-400 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <input type="text" name="website" style={{ position: 'absolute', left: '-9999px' }} tabIndex={-1} autoComplete="off" />

          <h3 className="text-xl font-bold text-white mb-2">Оставьте контакты</h3>
          <p className="text-gray-400 text-sm mb-4">Перезвоним и всё обсудим.</p>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1.5">Имя</label>
            <input
              ref={nameRef}
              type="text"
              placeholder="Иван"
              defaultValue=""
              className={`w-full px-4 py-4 rounded-xl bg-gray-800 border-2 text-white placeholder-gray-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-[#FF4D4D]'}`}
            />
            {errors.name && (
              <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                <AlertCircle size={12} /><span>{errors.name}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-1.5">Телефон</label>
            <input
              ref={phoneRef}
              type="tel"
              placeholder="+7 (___) ___-__-__"
              defaultValue=""
              onInput={handlePhoneInput}
              className={`w-full px-4 py-4 rounded-xl bg-gray-800 border-2 text-white placeholder-gray-500 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-700 focus:border-[#FF4D4D]'}`}
            />
            {errors.phone && (
              <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                <AlertCircle size={12} /><span>{errors.phone}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                ref={consentRef}
                type="checkbox"
                defaultChecked={false}
                className="mt-0.5 w-5 h-5 rounded border-2 border-gray-600 accent-[#FF4D4D] cursor-pointer"
              />
              <span className="text-xs text-gray-400 leading-relaxed">
                Я согласен на обработку{' '}
                <a href="/privacy" className="text-[#FF4D4D] underline hover:text-red-400">персональных данных</a>
                {' '}и получение информационных сообщений
              </span>
            </label>
            {errors.consent && (
              <div className="flex items-center gap-1 mt-1.5 text-red-400 text-xs">
                <AlertCircle size={12} /><span>{errors.consent}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF4D4D] active:bg-red-600 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 mt-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Отправка...' : 'Получить предложение'}
            <Send size={18} className="flex-shrink-0" />
          </button>
        </form>
      )}
    </div>
  );
};

export default QuizForm;
