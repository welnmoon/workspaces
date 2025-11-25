declare global {
  interface Window {
    cp?: {
      CloudPayments: new (options?: { language?: string }) => {
        pay: (
          type: 'charge' | 'auth',
          params: {
            publicId: string;
            description: string;
            amount: number;
            currency: string;
            invoiceId?: string;
            accountId?: string;
            skin?: 'mini' | 'classic' | 'modern';
            autoClose?: boolean;
            data?: Record<string, any>;
          },
          callbacks?: {
            onSuccess?: () => void;
            onFail?: (reason?: string) => void;
          }
        ) => void;
      };
    };
  }
}

export {};

export interface CloudPaymentsData {
  [key: string]: string | number | boolean | object | undefined;
  workspaceId?: number;
  tariff?: string;
  // можешь добавить свои поля
}

export interface CloudPaymentsOptions {
  publicId: string;
  description: string;
  amount: number;
  currency: string;
  invoiceId?: string;
  accountId?: string;
  email?: string;
  skin?: 'mini' | 'classic' | 'modern';
  data?: CloudPaymentsData;
  // другие поля из доков: https://developers.cloudpayments.ru/#parametry-platezhnoy-formy
}

export interface CloudPaymentsCallbacks {
  onSuccess?: (options: any) => void;
  onFail?: (error: any) => void;
}

export interface CloudPaymentsWidget {
  pay: (
    action: 'charge' | 'auth',
    options: CloudPaymentsOptions,
    callbacks?: CloudPaymentsCallbacks
  ) => void;
}
