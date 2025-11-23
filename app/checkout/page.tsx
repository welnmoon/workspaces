// app/checkout/page.tsx
'use client';
import { useState } from 'react';

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const pay = () => {
    setLoading(true);

    // @ts-ignore — CloudPayments подключается глобально
    const widget = new (window as any).cp.CloudPayments();

    widget.pay(
      'charge', // тип оплаты
      {
        publicId: 'test_api_00000000000000000000002',
        description: 'Тестовый заказ в пет-проекте',
        amount: 1990, // сумма в тенге/рублях
        currency: 'KZT', // или RUB, USD, EUR
        invoiceId: '12345',
        accountId: 'user@example.com',
        skin: 'mini', // mini / classic / modern
        autoClose: true,
      },
      {
        onSuccess: () => {
          alert('Оплата прошла успешно! 🎉');
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
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg text-xl disabled:opacity-70"
      >
        {loading ? 'Открываем форму...' : 'Оплатить 1990 ₸'}
      </button>

      <div className="mt-8 text-sm text-gray-600">
        <p>
          Тестовая карта: <strong>4242 4242 4242 4242</strong>
        </p>
        <p>Любой срок • Любой CVC • Любой имя</p>
      </div>
    </div>
  );
}
