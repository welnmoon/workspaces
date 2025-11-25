// app/checkout/page.tsx
'use client';

import { useState } from 'react';

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const pay = () => {
    setLoading(true);

    // Теперь TypeScript знает про window.cp!
    if (!window.cp?.CloudPayments) {
      alert('Виджет оплаты не загружен');
      setLoading(false);
      return;
    }

    const widget = new window.cp.CloudPayments({ language: 'ru-RU' });

    widget.pay(
      'charge',
      {
        publicId: 'test_api_00000000000000000000002',
        description: 'Тестовый заказ в пет-проекте',
        amount: 1990,
        currency: 'KZT',
        invoiceId: 'test-' + Date.now(),
        accountId: 'user@example.com',
        skin: 'mini',
        autoClose: true,
      },
      {
        onSuccess: () => {
          alert('Оплата прошла успешно!');
          setLoading(false);
        },
        onFail: () => {
          alert('Оплата отменена');
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-8">Тестовый чекаут</h1>

      <button
        onClick={pay}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg text-xl disabled:opacity-70 transition"
      >
        {loading ? 'Открываем форму...' : 'Оплатить 1990 ₸'}
      </button>

      <div className="mt-8 text-sm text-gray-600 space-y-1">
        <p>
          Тестовая карта: <strong>4242 4242 4242 4242</strong>
        </p>
        <p>Срок: любой будущий • CVC: любой • Имя: любое</p>
      </div>
    </div>
  );
}
