import React from 'react';
import { Check } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const PriceRow: React.FC<{ name: string; price: string; status: string; isHighlighted?: boolean }> = ({ name, price, status, isHighlighted }) => (
  <div className={`flex flex-col md:flex-row justify-between items-start md:items-center p-5 border-b border-gray-100 last:border-0 ${isHighlighted ? 'bg-[#FFF9F0] -mx-5 px-5 md:px-5 py-4 my-2 rounded-xl border-none' : 'py-5'}`}>
    <div>
      <h4 className="text-lg font-bold text-gray-900">{name}</h4>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mt-1 inline-block ${status.includes('в наличии') ? 'bg-[#E6F4EA] text-[#1E8E3E]' : 'bg-gray-100 text-gray-500'}`}>
        {status}
      </span>
    </div>
    <div className="mt-2 md:mt-0 text-right">
      <div className="text-xl font-bold text-[#1C1C1C]">{price}</div>
    </div>
  </div>
);

const OptionItem: React.FC<{ label: string }> = ({ label }) => (
    <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center text-black flex-shrink-0">
            <Check size={12} strokeWidth={3} />
        </div>
        <span className="text-gray-700 text-sm font-medium">{label}</span>
    </div>
);

const ProductSpotlight: React.FC = () => {
  const revealRef = useScrollReveal();

  return (
    <section className="py-24 bg-[#FFFFFF]" id="price">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div ref={revealRef} className="reveal relative w-full rounded-[3rem] bg-[#F2EDE8] border-8 border-[#F2EDE8] overflow-hidden min-h-[600px] py-16 px-6 md:px-16">
        
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-semibold mb-4 text-[#1C1C1C]">Комплектации и цены</h2>
             <p className="text-gray-500">Выберите подходящий вариант для ваших задач</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
              <div className="bg-white rounded-[2rem] p-2 shadow-xl">
                  <div className="p-6 md:p-8">
                     <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6 font-bold">Модельный ряд</h3>
                     <PriceRow name="Базовая МКПП" price="6 600 000 ₽" status="под заказ" />
                     <PriceRow name="Базовая АКПП" price="7 100 000 ₽" status="под заказ" />
                     <PriceRow name="Максимальная МКПП" price="9 000 000 ₽" status="в наличии" isHighlighted={true} />
                     <PriceRow name="Максимальная АКПП" price="9 500 000 ₽" status="под заказ" />
                     <PriceRow name="Прицеп для перевозки" price="600 000 ₽" status="в наличии" />
                  </div>
                  <a 
                    href="#contacts"
                    className="bg-[#050505] text-white p-5 text-center rounded-t-[1.5rem] rounded-b-[1.5rem] cursor-pointer hover:bg-black transition-colors font-medium block"
                  >
                    Записаться на тест-драйв
                  </a>
              </div>

              <div className="flex flex-col justify-center py-4">
                  <h3 className="text-2xl font-bold mb-8 text-[#1C1C1C]">Дополнительные опции</h3>
                  <div className="space-y-4">
                      <OptionItem label="Автономный отопитель салона, лебедка" />
                      <OptionItem label="Камеры заднего и кругового обзора" />
                      <OptionItem label="Спутниковая связь, радиостанция" />
                      <OptionItem label="Дополнительное освещение (люстра)" />
                      <OptionItem label="Инвертер 12–220В для оборудования" />
                      <OptionItem label="Высокий кунг с утеплением" />
                      <OptionItem label="Организация спальных мест" />
                      <OptionItem label="Боковые окна и верхний люк" />
                  </div>
                  
                  <div className="mt-12 p-6 bg-white/50 rounded-2xl">
                      <p className="text-sm text-gray-600 leading-relaxed">
                          Мы можем оснастить вездеход под специфику вашей работы: геологоразведка, обслуживание ЛЭП, охота или туризм.
                      </p>
                  </div>
              </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductSpotlight;