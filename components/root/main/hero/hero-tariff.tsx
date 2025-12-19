'use client';
import { useState } from 'react';
import TariffTabs from './tariff-tabs';
import { tariffs } from '@/const/tariffs';

type TariffKey = keyof typeof tariffs;
const HeroTariff = () => {
  const [currentTariff, setCurrentTariff] = useState<TariffKey>('FREE');
  return (
    <section className="w-full flex items-center flex-col gap-4">
      <h2 className="visually-hidden p-4">Tariffs</h2>
      {/*TOP*/}
      <div className="min-h-fit">
        {currentTariff === tariffs.FREE.name && (
          <div className="flex justify-between h-full gap-4">
            <div className="bg-neutral-200 w-1/2 h-70 rounded-md relative">
              <p className="font-[600] text-neutral-700 my-4 mx-6 wrap-break-word text-lg">
                Подходит для старта
              </p>
              {/* <p className="mt-2 text-sm font-normal text-neutral-600">
                Один воркспейс, базовые задачи, минимальные ограничения. Можно
                попробовать продукт без привязки к карте.
              </p> */}
              <img
                src="/images/hero/hero-free-1_cropped.avif"
                className="absolute bottom-0 object-cover"
              />
            </div>

            <div className="bg-neutral-100 w-1/2 rounded-md py-4 px-6 text-sm text-neutral-600">
              <p className="text-[20px] font-[600]">Ограничения:</p>
              <ul className="mt-2 list-disc list-inside">
                <li>Ограничение на проекты</li>
                <li>Без ролей и прав</li>
                <li>Без истории активности</li>
              </ul>
            </div>
          </div>
        )}

        {currentTariff === tariffs.PRO.name && (
          <div className="flex justify-between h-full gap-4">
            <div className="bg-amber-100 w-1/2 rounded-md relative h-70">
              <p className="font-[600] text-neutral-800 my-4 mx-6 wrap-break-word text-lg">
                Для небольших команд
              </p>
              {/* <p className="mt-2 text-sm font-normal text-neutral-700">
                Полный контроль над проектами и задачами. Подходит для
                постоянной командной работы.
              </p> */}
              <img
                src="/images/hero/hero-pro-1_cropped.avif"
                className="absolute bottom-0 object-cover"
              />
            </div>

            <div className="bg-amber-50 w-1/2 rounded-md py-4 px-6 text-sm text-neutral-700">
              Возможности:
              <ul className="mt-2 list-disc list-inside">
                <li>Дедлайны и приоритеты</li>
                <li>Роли и приглашения</li>
                <li>История активности</li>
              </ul>
            </div>
          </div>
        )}

        {currentTariff === tariffs.BUSINESS.name && (
          <div className="flex justify-between h-full gap-4">
            <div className="bg-red-100 w-1/2 rounded-md relative h-70">
              <p className="font-[600] text-neutral-800 my-4 mx-6 text-lg">
                Для компаний и отделов
              </p>
              {/* <p className="mt-2 text-sm font-normal text-neutral-700">
                Расширенный контроль, отчёты и кастомизация под бизнес-процессы.
              </p> */}
              <img
                src="/images/hero/hero-business-1_cropped.avif"
                className="absolute bottom-0 object-cover"
              />
            </div>

            <div className="bg-red-50 w-1/2 rounded-md py-4 px-6 text-sm text-neutral-700">
              Дополнительно:
              <ul className="mt-2 list-disc list-inside">
                <li>Контроль доступов</li>
                <li>Отчёты и аналитика</li>
                <li>SLA и приоритетная поддержка</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/*-----------------Toggle------------------------------*/}
      <TariffTabs
        currentTariff={currentTariff}
        setCurrentTariff={setCurrentTariff}
      />

      {/*BOTTOM*/}
      <div className="w-full">
        {currentTariff === tariffs.FREE.name && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-md bg-neutral-50 border px-4 py-3">
              <p className="font-medium text-neutral-800">Воркспейсы</p>
              <p className="text-neutral-600 mt-1">1 активный</p>
            </div>

            <div className="rounded-md bg-neutral-50 border px-4 py-3">
              <p className="font-medium text-neutral-800">Участники</p>
              <p className="text-neutral-600 mt-1">До 2 человек</p>
            </div>

            <div className="rounded-md bg-neutral-50 border px-4 py-3">
              <p className="font-medium text-neutral-800">Поддержка</p>
              <p className="text-neutral-600 mt-1">Только база знаний</p>
            </div>
          </div>
        )}

        {currentTariff === tariffs.PRO.name && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3">
              <p className="font-medium text-neutral-800">Воркспейсы</p>
              <p className="text-neutral-700 mt-1">Без ограничений</p>
            </div>

            <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3">
              <p className="font-medium text-neutral-800">Команда</p>
              <p className="text-neutral-700 mt-1">Роли и приглашения</p>
            </div>

            <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3">
              <p className="font-medium text-neutral-800">История</p>
              <p className="text-neutral-700 mt-1">До 6 месяцев</p>
            </div>
          </div>
        )}

        {currentTariff === tariffs.BUSINESS.name && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
              <p className="font-medium text-neutral-800">Структура</p>
              <p className="text-neutral-700 mt-1">Отделы и команды</p>
            </div>

            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
              <p className="font-medium text-neutral-800">Отчёты</p>
              <p className="text-neutral-700 mt-1">За любой период</p>
            </div>

            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
              <p className="font-medium text-neutral-800">Поддержка</p>
              <p className="text-neutral-700 mt-1">SLA + приоритет</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroTariff;
