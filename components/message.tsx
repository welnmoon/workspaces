import { cn } from '@/lib/utils';

interface MessageProps {
  children: React.ReactNode;
  className?: string;
}

export const Message = ({ children, className }: MessageProps) => (
  <p
    className={cn(
      'text-sm text-muted-foreground italic text-center py-4',
      className
    )}
  >
    {children}
  </p>
);

// Найдено: можно указывать сколько и чего
export const MessageFound = ({
  count,
  noun = 'элементов',
}: {
  count: number;
  noun?: string;
}) => (
  <Message>
    Найдено {count} {noun}
  </Message>
);

// Пусто: по умолчанию "ничего не найдено", можно задать свой текст
export const MessageEmpty = ({
  text = 'Ничего не найдено',
}: {
  text?: string;
}) => <Message>{text}</Message>;

// Ошибка: можно использовать при ошибке запроса, загрузки и т.п.
export const MessageError = ({
  text = 'Произошла ошибка',
  className,
}: {
  text?: string;
  className?: string;
}) => (
  <Message className={`text-red-500 font-medium ${className}`}>{text}</Message>
);

// Инфо: дополнительное описание
export const MessageInfo = ({ text }: { text: string }) => (
  <Message className="text-blue-500">{text}</Message>
);
