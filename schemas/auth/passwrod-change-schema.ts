import z from 'zod';

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Требуется текущий пароль'),
  newPassword: z.string().min(6, 'Минимум 6 символов'),
                                             
                                            
                                   
                                                
});

export type PasswordChangeSchemaDTO = z.infer<typeof passwordChangeSchema>;
