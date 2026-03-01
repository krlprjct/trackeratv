import React from 'react';
import { Cog, ShieldCheck, Wrench, Warehouse, LayoutDashboard, Snowflake, Truck } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const tasks = [
  { 
    title: "Охота и рыбалка", 
    desc: "Тихий ход не пугает дичь. Проходит сложные болота и выходит с воды на лёд.",
  },
  { 
    title: "Работа в регионах", 
    desc: "Вахта, север, логистика. Перевозка бригад и оборудования.",
  },
  { 
    title: "Экспедиции", 
    desc: "Полная автономность, комфортный сон в салоне, запас хода 1000 км.",
  },
];

const features = [
  {
    title: "Турбодизель Kubota",
    desc: "Kubota V1505-t. Миллионник. Тяга с низов. Простой и надёжный.",
    icon: <Cog size={24} />,
  },
  {
    title: "Кузов-лодка",
    desc: "Проходит сложные болота и выходит с воды на лёд. Герметичный корпус.",
    icon: <LayoutDashboard size={24} />,
  },
  {
    title: "Сервис в Екатеринбурге",
    desc: "Собственный склад запчастей. Расходники в наличии.",
    icon: <Warehouse size={24} />,
  },
  {
    title: "Комфорт в салоне",
    desc: "Низкий уровень шума, панорамный обзор, штатный независимый отопитель.",
    icon: <Snowflake size={24} />,
  },
  {
    title: "Российское производство",
    desc: "Сделано в России. Бортоповоротная схема для манёвренности. Транспортировка на прицепе.",
    icon: <Truck size={24} />,
  },
  {
    title: "НДС и лизинг",
    desc: "НДС 22% и лизинг для юрлиц. Полный пакет документов.",
    icon: <ShieldCheck size={24} />,
  },
];

const Applications: React.FC = () => {
  const titleRef = useScrollReveal();
  const cardsRef = useScrollReveal({ stagger: 100 });
  const tasksRef = useScrollReveal({ stagger: 120 });

  return (
    <section className="py-20 bg-white" id="benefits">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        <div className="flex flex-col md:flex-row gap-16 items-start">
          <div ref={titleRef} className="reveal md:w-1/3 md:sticky md:top-24">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1C1C1C] mb-6 leading-tight">
                Почему покупают <span className="text-gray-400">TRACKER</span>?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Машина, которая объединяет комфорт иномарки и проходимость танка. 
                Без лишней электроники.
              </p>
          </div>

           <div ref={cardsRef} className="reveal md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className="reveal-child bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-gray-300 transition-colors"
                >
                  <div className="w-10 h-10 bg-[#1C1C1C] text-white rounded-full flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#1C1C1C] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
           </div>
        </div>

        <div ref={tasksRef} className="reveal mt-20">
          <h2 className="text-3xl font-bold mb-10 text-[#1C1C1C]">Под какие задачи берут TRACKER</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tasks.map((task, idx) => (
              <div key={idx} className="reveal-child p-8 rounded-[2rem] bg-[#F5F5F7] hover:bg-[#F2EDE8] transition-colors">
                <h3 className="text-xl font-bold mb-3">{task.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-sm">{task.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Applications;