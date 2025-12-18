// types/cloudpayments.d.ts

declare global {
  interface Window {
    cp?: {
      CloudPayments: new (
        options?: CloudPaymentsWidgetOptions
      ) => CloudPaymentsWidget;
    };
  }
}

export {};

export type CloudPaymentsAction = 'charge' | 'auth';
export type CloudPaymentsSkin = 'mini' | 'classic' | 'modern';

export interface CloudPaymentsWidgetOptions {
  language?: string;
}

/**
 * Данные, которые ты прокидываешь в data.
 * Можно расширять, если понадобятся ещё поля.
 */
export interface CloudPaymentsData {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | CloudPaymentsData
    | CloudPaymentsData[]
    | undefined;

  workspaceId?: number;
  userId?: string;
  tariff?: string;
}

/**
 * Опции платёжной формы CloudPayments
 */
export interface CloudPaymentsOptions {
  publicId: string;
  description: string;
  amount: number;
  currency: string;
  invoiceId?: string;
  accountId?: string;
  email?: string;
  skin?: CloudPaymentsSkin;
  autoClose?: boolean;
  data?: CloudPaymentsData;
  // при желании можно добавить остальные поля из доки
}

/**
 * То, что CloudPayments отдаёт в onSuccess.
 * Мы точно знаем, что там есть options, остальное — как unknown.
 */
export interface CloudPaymentsSuccessPayload {
  options: CloudPaymentsOptions;
  [key: string]: unknown;
}

/**
 * Коллбеки виджета.
 * Вместо any — либо конкретный payload, либо unknown.
 */
export interface CloudPaymentsCallbacks {
  onSuccess?: (payload: CloudPaymentsSuccessPayload) => void;
  onFail?: (reason?: string) => void;
}

/**
 * Интерфейс самого виджета.
 */
export interface CloudPaymentsWidget {
  pay: (
    action: CloudPaymentsAction,
    options: CloudPaymentsOptions,
    callbacks?: CloudPaymentsCallbacks
  ) => void;
}
