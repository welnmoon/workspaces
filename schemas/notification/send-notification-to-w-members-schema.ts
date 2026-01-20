import z from 'zod';

export const sendNotificationToWMembersSchema = z.object({
                                                       
  title: z.string().trim().min(1, 'Title is required'),
  body: z.string().trim().min(1, 'Body is required'),
  sendAt: z.string().optional(),
});

export type SendNotificationToWMembersSchema = z.infer<
  typeof sendNotificationToWMembersSchema
>;
