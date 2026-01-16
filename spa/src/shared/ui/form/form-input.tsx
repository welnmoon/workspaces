'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '../input';
import { ClearButton } from './clear-btn';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  placeholder: string;
  required?: boolean;
  isPassword?: boolean;
  className?: string; // Input
  containerClassName?: string; // Container
  disabled?: boolean;
  isTextarea?: boolean;
}

const FormInput = ({
  name,
  label,
  required,
  placeholder,
  type = 'text',
  containerClassName,
  className,
  disabled,
  isPassword,
  isTextarea = false,
  ...rest
}: Props) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string | undefined;

  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const onClear = () => {
    setValue(name, '', { shouldValidate: true });
  };

  const isText = name === 'description';

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <Label className="text-sm font-medium text-slate-800">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div className="relative">
        {isText || isTextarea ? (
          <textarea
            {...register(name)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              `text-[16px] px-4 py-3 border border-gray-100 rounded-md dark:border-gray-800 
               w-full resize-none max-h-40 overflow-y-auto
               ${errorText ? 'border-red-400' : ''}`,
              className
            )}
          />
        ) : (
          <Input
            {...register(name)}
            type={inputType} // <-- вот тут важно
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              `text-[16px] px-4 py-3 border-gray-100 dark:border-gray-800 pr-11
               ${errorText ? 'border-red-400' : ''}`,
              className
            )}
            {...rest}
          />
        )}

        {isPassword && !isTextarea && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-10 flex items-center text-slate-400 hover:text-slate-700"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeClosedIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}

        {value && !disabled && (
          <ClearButton
            onClick={onClear}
            // если твой ClearButton позиционируется absolute справа,
            // то глазик на right-10, а он на right-3 — они не пересекутся
          />
        )}
      </div>

      {errorText && <p className="text-sm text-red-500">{errorText}</p>}
    </div>
  );
};

export default FormInput;
