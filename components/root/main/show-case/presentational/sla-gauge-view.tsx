'use client';

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { cn } from '@/lib/utils';
import ChartsCard from '@/components/charts/charts-card';
import { Badge } from '@/components/ui/badge';

type SLAGaugeViewProps = {
  sla: number; // 0-100
  completedInDeadline: number;
  totalWithDeadline: number;
  title?: string;
  desc?: string;
};

const SLAGaugeView = ({
  sla,
  completedInDeadline,
  totalWithDeadline,
  title = 'SLA',
  desc = 'Процент задач, завершённых в срок',
}: SLAGaugeViewProps) => {
  const color = sla < 60 ? '#ef4444' : sla < 80 ? '#fbbf24' : '#22c55e';
  const settings = {
    width: 200,
    height: 200,
    value: sla,
  };

  return (
    <ChartsCard
      desc={desc}
      title={title}
      noCalendar
      info="Показывает долю задач с дедлайном, закрытых в срок"
      className="h-max"
    >
      <div className={cn('relative')}>
        <Gauge
          {...settings}
          cornerRadius="50%"
          sx={() => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 40,
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: color,
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: '#f4f4f5',
            },
          })}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <div className="text-[14px] text-wrap">
          <div>SLA =</div>
          <div>
            Завершено в срок <span className="text-red-500 mx-2">/</span>
          </div>
          <div>Всего задач с дедлайном</div>
        </div>
        <Badge className="text-[14px]" variant={'success'}>
          {completedInDeadline} задач из {totalWithDeadline}
        </Badge>
      </div>
    </ChartsCard>
  );
};

export default SLAGaugeView;
