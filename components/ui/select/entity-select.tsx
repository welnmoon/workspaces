                   
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@radix-ui/react-label';
import { useRouter } from 'next/navigation';
import { Spinner } from '../spinner';

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
  label?: string;
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
  label,
}: EntitySelectProps<T>) {
  const router = useRouter();

  const idToHref = new Map(items.map((it) => [getId(it), getHref?.(it)]));

  const normalizedValue =
    value && items.some((i) => getId(i) === value) ? value : undefined;
  return (
    <>
      <Label className="font-normal text-sm text-muted-foreground ">
        {label}
      </Label>
      <Select
        value={normalizedValue}
        onValueChange={(v) => {
          onChange?.(v);
          const href = idToHref.get(v);
          if (href) router.push(href);
        }}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="min-w-0 max-w-60">
          {loading && (
            <SelectItem value="__loading" disabled>
              <Spinner className="mx-auto" />
            </SelectItem>
          )}

          {!loading &&
            items.length > 0 &&
            items.map((item) => {
              const id = getId(item);
              const label = getLabel(item);

              return (
                <SelectItem
                  className="block truncate max-w-full"
                  key={id}
                  value={id}
                >
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
    </>
  );
}

export default EntitySelect;
