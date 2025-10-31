// EntitySelect.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select';
import { clientRoutes } from '@/lib/routes/client-routes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type EntitySelectProps<T> = {
  items: T[];
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  disabled?: boolean;
  loading?: boolean;
  emptyLabel?: string;
  getHref?: (item: T) => string | undefined;
};

function EntitySelect<T>({
  items,
  value,
  onChange,
  placeholder = 'Выбрать…',
  className,
  getId,
  getLabel,
  disabled,
  loading,
  emptyLabel = 'Нет данных',
  getHref,
}: EntitySelectProps<T>) {
  const router = useRouter();

  const idToHref = new Map(items.map((it) => [getId(it), getHref?.(it)]));
  return (
    <Select
      value={value ?? undefined}
      onValueChange={(v) => {
        onChange?.(v);
        const href = idToHref.get(v);
        if (href) router.push(href);
      }}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={loading ? 'Загрузка…' : placeholder} />
      </SelectTrigger>

      <SelectContent>
        {loading && (
          <SelectItem value="__loading" disabled>
            Загрузка…
          </SelectItem>
        )}

        {!loading &&
          items.length > 0 &&
          items.map((item) => {
            const id = getId(item);
            const label = getLabel(item);
            const href = getHref?.(item);
            return (
              <SelectItem key={id} value={id}>
                {label} {value === id ? '✓ ' : ''}
              </SelectItem>
            );
          })}

        {!loading && items.length === 0 && (
          <SelectItem value="__empty" disabled>
            {emptyLabel}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}

export default EntitySelect;
