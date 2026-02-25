import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const keySpecs = [
  { label: "Двигатель", value: "Турбодизель Kubota V1505-t (Япония)" },
  { label: "Мощность / объём", value: "44.3 л.с. / 1498 см³" },
  { label: "Коробка передач", value: "МКПП 5-ст." },
  { label: "Клиренс", value: "620 мм" },
  { label: "Грузоподъёмность", value: "1000 кг" },
  { label: "Температура эксплуатации", value: "−50…+40 °C" },
];

const additionalSpecs = [
  { label: "Габариты (Д×Ш×В)", value: "3690 × 2510 × 2490 мм" },
  { label: "Сухой вес", value: "1780 кг" },
  { label: "Скорость (суша / вода)", value: "до 45 км/ч / до 5 км/ч" },
  { label: "Расход топлива", value: "3–7 л/ч" },
  { label: "Топливные баки", value: "120 л + 260 л (доп.)" },
];

const SpecRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
    <span className="text-gray-500 font-medium text-sm md:text-base">{label}</span>
    <span className="text-[#1C1C1C] font-bold text-right text-base md:text-lg">{value}</span>
  </div>
);

const Benefits: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-24 bg-[#FFFFFF]" id="specs">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="relative w-full rounded-[3rem] bg-[#0a0a0a] overflow-hidden py-16 px-6 md:px-16">

          <div className="text-center mb-12">
             <h2 className="text-3xl md:text-5xl font-semibold mb-4 text-white">Технические характеристики</h2>
             <p className="text-gray-400">Гарантия 12 месяцев или 400 моточасов</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
              
              <div className="relative rounded-[2rem] overflow-hidden shadow-lg h-[480px] border border-white/10">
                  <img 
                      src="/images/gallery/charact.webp" 
                      alt="Двигатель Kubota" 
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white max-w-sm">
                      <div className="font-bold text-xl mb-2">Надежная база</div>
                      <p className="text-sm text-gray-300 opacity-90">
                          Двигатель и узлы рассчитаны на ремонт в полевых условиях обычным инструментом.
                      </p>
                  </div>
              </div>

              <div className="bg-white rounded-[2rem] p-2 shadow-xl">
                  <div className="p-6 md:p-8">
                      <div className="flex flex-col">
                          {keySpecs.map((s, i) => (
                              <SpecRow key={i} label={s.label} value={s.value} />
                          ))}
                      </div>

                      {isExpanded && (
                          <div className="flex flex-col mt-4 pt-4 border-t border-gray-200">
                              {additionalSpecs.map((s, i) => (
                                  <SpecRow key={i} label={s.label} value={s.value} />
                              ))}
                          </div>
                      )}

                      <button 
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="mt-6 text-sm font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-1"
                      >
                          {isExpanded ? 'Скрыть характеристики' : 'Показать все характеристики'}
                          {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                      </button>
                  </div>

                  <a 
                      href="#contacts"
                      className="bg-[#050505] text-white p-5 text-center rounded-t-[1.5rem] rounded-b-[1.5rem] cursor-pointer hover:bg-black transition-colors font-medium block"
                  >
                      Записаться на тест-драйв
                  </a>
              </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;