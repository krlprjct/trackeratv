import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqData = [
  {
    question: "Сколько стоит TRACKER и какие есть комплектации?",
    answer: "Есть базовая и максимальная версии (МКПП/АКПП) + прицеп. Пришлём расчёт цены и комплектации под вашу задачу."
  },
  {
    question: "Что есть в наличии и какие сроки поставки под заказ?",
    answer: "В наличии — максимальная комплектация (МКПП). Под заказ — от 2 месяцев."
  },
  {
    question: "Можно купить в лизинг и с НДС для юрлица?",
    answer: "Да. НДС 22%, лизинг, полный пакет документов."
  },
  {
    question: "Какая гарантия и что по сервису/запчастям?",
    answer: "Гарантия 12 месяцев или 400 моточасов. Сервис и запчасти — в наличии в Екатеринбурге."
  },
  {
    question: "Подойдёт ли под мои условия (снег/болото/холод)?",
    answer: "Эксплуатация −50…+40 °C, клиренс 620 мм, подкачка шин из кабины — адаптация под грунт."
  },
];

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-[#FF4D4D] transition-colors gap-4 group"
      >
        <span className="text-lg md:text-xl font-bold text-[#1C1C1C] group-hover:text-[#FF4D4D] transition-colors">
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-[#FF4D4D] text-white rotate-180' : 'bg-gray-100 text-black'}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="text-4xl font-bold text-[#1C1C1C] mb-12 text-center">Частые вопросы</h2>
        <div className="flex flex-col">
          {faqData.map((item, idx) => (
            <FAQItem key={idx} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;