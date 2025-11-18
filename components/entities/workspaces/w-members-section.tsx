import { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SessionUser } from '@/helpers/require-user';

const WMembersSection = ({
  user,
  members,
}: {
  members: MembershipSelectUserDTO[];
  user: SessionUser;
}) => {
  return (
    <section>
      <Table>
        <TableCaption>Table caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">ФИО</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Был в сети</TableHead>
            <TableHead className="text-right">Роль</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow
              className={`${user.id === member.userId && 'bg-primary-50'}`}
              key={member.id}
            >
              <TableCell className="font-medium">
                {member.user.firstName} {member.user.lastName}
              </TableCell>
              <TableCell>{member.user.email}</TableCell>
              <TableCell>
                {member.user.wasOnline
                  ? member.user.wasOnline.toISOString()
                  : '-'}
              </TableCell>
              <TableCell className="text-right">{member.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default WMembersSection;
