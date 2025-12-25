import type { MembershipSelectUserDTO } from '@/types/prisma/DTO/memberships';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { SessionUser } from '@/helpers/require-user';
import EditMemberPopover from './edit-member-popover';
import { RoleWithoutOwnerDTO, RolesEnum } from '@/types/prisma/DTO/role';

const WMembersSection = ({
  user,
  members,
  membersAndRoles,
}: {
  members: MembershipSelectUserDTO[];
  user: SessionUser;
  membersAndRoles: { userId: string; role: RoleWithoutOwnerDTO }[];
}) => {
  const isMember = membersAndRoles.some((um) => um.role !== RolesEnum.MEMBER);
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
            {!isMember && <TableHead className="text-right"></TableHead>}
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
                    ? member.user.wasOnline.toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell className="">{member.role}</TableCell>
                {!isMember && (
                  <TableCell className="text-right">
                    <EditMemberPopover
                      memberRole={memberRole}
                      memberId={member.id}
                    />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};

export default WMembersSection;
