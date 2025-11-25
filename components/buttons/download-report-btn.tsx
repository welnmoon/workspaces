'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
// import { Button } from '@/components/ui/button'; // если используешь shadcn
// import toast from 'react-hot-toast';

const DownloadReportButton = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      alert('Выбери обе даты');
      // toast.error('Выбери обе даты');
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch('/api/report/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Ошибка при генерации PDF:', text);
        alert('Не удалось создать отчёт');
        // toast.error('Не удалось создать отчёт');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `otchet_${startDate}_to_${endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
      // toast.success('Отчёт скачан');
    } catch (error) {
      console.error(error);
      alert('Ошибка при скачивании отчёта');
      // toast.error('Ошибка при скачивании отчёта');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <div className="flex gap-2">
        <div className="flex flex-col flex-1">
          <label className="text-sm text-muted-foreground">С</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-sm text-muted-foreground">По</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            max={today}
          />
        </div>
      </div>

      <Button onClick={handleDownload} disabled={isLoading} className="mt-2">
        {isLoading ? 'Генерация…' : 'Скачать PDF отчёт'}
      </Button>
    </div>
  );
};

export default DownloadReportButton;
