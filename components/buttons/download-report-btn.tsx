'use client';

import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

const DownloadReportButton = () => {
  const today = useMemo(() => new Date(), []);
  const defaultStart = useMemo(() => {
    const firstDay = new Date(today);
    firstDay.setDate(1);
    return firstDay.toISOString().slice(0, 10);
  }, [today]);
  const defaultEnd = useMemo(() => today.toISOString().slice(0, 10), [today]);

  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      toast.error('Выберите обе даты');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Дата начала позже даты окончания');
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
        const text = await res.text().catch(() => null);
        const message =
          text?.trim() ||
          res.statusText ||
          'Не удалось создать отчёт. Попробуйте позже';
        throw new Error(message);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const contentDisposition = res.headers.get('Content-Disposition');
      const filenameMatch =
        contentDisposition?.match(/filename=\"?([^\";]+)\"?/)?.[1] ?? '';
      const safeFilename =
        filenameMatch || `tasks_report_${startDate}_to_${endDate}.pdf`;

      const a = document.createElement('a');
      a.href = url;
      a.download = safeFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
      toast.success('Отчёт скачивается');
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Ошибка при скачивании отчёта'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 text-left"
        >
          <Download className="w-5 h-5" />
          <span>Скачать отчёт</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left space-y-2">
          <DialogTitle>Скачать отчёт</DialogTitle>
          <DialogDescription className="text-left">
            Выберите период, за который нужно выгрузить завершённые задачи.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="report-start">С</Label>
            <Input
              id="report-start"
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-end">По</Label>
            <Input
              id="report-end"
              type="date"
              value={endDate}
              max={defaultEnd}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            onClick={handleDownload}
            disabled={isLoading}
            className={cn(isLoading && 'cursor-not-allowed')}
          >
            {isLoading ? 'Генерация…' : 'Скачать PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadReportButton;
