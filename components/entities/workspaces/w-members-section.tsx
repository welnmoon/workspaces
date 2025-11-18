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
import { Delete, DeleteIcon, Edit, Menu } from 'lucide-react';
import EditMemberPopover from './edit-member-popover';
import { Role } from '@prisma/client';
import { RoleWithoutOwnerDTO } from '@/types/prisma/DTO/role';

const WMembersSection = ({
  user,
  members,
  membersAndRoles,
}: {
  members: MembershipSelectUserDTO[];
  user: SessionUser;
  membersAndRoles: { userId: string; role: RoleWithoutOwnerDTO }[];
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
            <TableHead className="">Роль</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const memberRole = membersAndRoles.find(
              (m) => m.userId === member.userId
            )!.role;

            return (
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
                <TableCell className="">{member.role}</TableCell>
                <TableCell className="text-right">
                  {member.role !== Role.OWNER && (
                    <EditMemberPopover memberRole={memberRole} />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};

export default WMembersSection;
