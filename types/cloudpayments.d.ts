                           

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
                                                      
}

   
                                            
                                                                 
   
export interface CloudPaymentsSuccessPayload {
  options: CloudPaymentsOptions;
  [key: string]: unknown;
}

   
                    
                                                      
   
export interface CloudPaymentsCallbacks {
  onSuccess?: (payload: CloudPaymentsSuccessPayload) => void;
  onFail?: (reason?: string) => void;
}

   
                            
   
export interface CloudPaymentsWidget {
  pay: (
    action: CloudPaymentsAction,
    options: CloudPaymentsOptions,
    callbacks?: CloudPaymentsCallbacks
  ) => void;
}
