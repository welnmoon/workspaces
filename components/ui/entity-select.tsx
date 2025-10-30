// EntitySelect.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select';

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
}: EntitySelectProps<T>) {
  return (
    <Select
      value={value ?? undefined}
      onValueChange={onChange}
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
            return (
              <SelectItem key={id} value={id}>
                {label}
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
