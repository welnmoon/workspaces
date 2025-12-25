// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import Link from 'next/link';
// import { clientRoutes } from '@/lib/routes/client-routes';
// import { TaskStatus } from '@prisma/client';
// import { cn } from '@/lib/utils';
// import { taskIsExpired } from '@/helpers/task/isExpired';
// import { Heading } from '../ui/heading';

// interface TaskCardProps {
//   title: string;
//   description: string;
//   status: string;
//   dueDate: string;
//   projectId: number;
//   workspaceId: number;
//   taskId: number;
//   role: string | undefined;
// }

// export default function TaskCard({
//   title,
//   description,
//   status,
//   dueDate,
//   projectId,
//   workspaceId,
//   taskId,
//   role,
// }: TaskCardProps) {
//   const dueDateFormatted = dueDate
//     ? new Date(dueDate).toLocaleDateString(undefined, {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//       })
//     : '';

//   const expired = taskIsExpired(new Date(dueDate));
//   const deadline = new Date().getDate() - new Date(dueDate).getDate();
//   return (
//     <Card
//       role={role}
//       className="flex flex-col h-full justify-between transition-all duration-200 hover:shadow-lg hover:-translate-y-[2px]"
//     >
//       <CardHeader className="pb-2 min-w-0">
//         <CardTitle className="min-w-0">
//           <Heading level={2} className="font-bold text-foreground min-w-0">
//             <Link
//               href={clientRoutes.taskPage(workspaceId, projectId, taskId)}
//               className="underline-anim block min-w-0"
//             >
//               <span className="block truncate max-w-full">{title}</span>
//             </Link>
//           </Heading>
//         </CardTitle>
//       </CardHeader>

//       <div className="mt-auto">
//         <CardContent className="flex gap-2 justify-between pt-0 text-sm bg-muted py-2">
//           <div className="">
//             <span className="font-medium">Срок: </span>
//             <span>
//               {dueDate ? (
//                 <span
//                   className={cn(
//                     { 'text-red-600': expired },
//                     'flex flex-col gap-1'
//                   )}
//                 >
//                   {dueDateFormatted}
//                   {expired ? (
//                     <span className="text-foreground-muted">
//                       {deadline === 0 && 'Сегодня'}

//                       {deadline > 0 &&
//                         `Просрочено на ${Math.abs(deadline)} дн.`}
//                     </span>
//                   ) : (
//                     ''
//                   )}
//                 </span>
//               ) : (
//                 'Нет срока'
//               )}
//             </span>
//           </div>
//           <div className="flex-1">
//             <div>
//               <span className="font-medium">Статус: </span>
//               <span
//                 className={`${
//                   status === TaskStatus.DONE
//                     ? 'text-green-600'
//                     : status === TaskStatus.IN_PROGRESS
//                       ? 'text-blue-600'
//                       : 'text-gray-500'
//                 }`}
//               >
//                 {status}
//               </span>
//             </div>
//             <div>
//               <span className="font-medium">Приоритет: </span>
//               <span
//                 className={`${
//                   status === TaskStatus.DONE
//                     ? 'text-green-600'
//                     : status === TaskStatus.IN_PROGRESS
//                       ? 'text-blue-600'
//                       : 'text-gray-500'
//                 }`}
//               >
//                 {status}
//               </span>
//             </div>
//           </div>
//         </CardContent>

//         <CardFooter className="border-t py-2 text-xs text-muted-foreground flex justify-between">
//           <span>ID: {taskId}</span>
//           <span>Проект #{projectId}</span>
//         </CardFooter>
//       </div>
//     </Card>
//   );
// }
