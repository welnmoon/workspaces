'use client';

import { useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { ClearButton } from './clear-btn';

type Option = { value: string; label: string };

type FormSelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  items: Option[];
};

const FormSelect = ({
  name,
  label,
  required,
  placeholder = 'Select...',
  disabled,
  className,
  containerClassName,
  items,
}: FormSelectProps) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string | undefined;
  const hasValue = value !== undefined && value !== null && value !== '';

  const onClear = () => setValue(name, '', { shouldValidate: true });

  return (
    <div className={cn('form-field', containerClassName)}>
      {label && (
        <label className="form-field__label">
          {label} {required && <span className="form-field__required">*</span>}
        </label>
      )}

      <div className="form-select">
        <select
          {...register(name)}
          className={cn(
            'form-select__control',
            errorText && 'form-select__control--error',
            className
          )}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(errorText)}
        >
          <option value="" disabled={Boolean(required)}>
            {placeholder}
          </option>
          {items.map((it) => (
            <option key={it.value} value={it.value}>
              {it.label}
            </option>
          ))}
        </select>

        {hasValue && !disabled && <ClearButton onClick={onClear} />}
      </div>

      {errorText && <p className="form-field__error">{errorText}</p>}
    </div>
  );
};

export default FormSelect;
