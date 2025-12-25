import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MembersRolesCard = ({ name, role }: { name: string; role: string }) => {
  return (
    <li className="w-full flex items-center gap-2 px-2 py-2 rounded-md border border-zinc-100">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>ЭН</AvatarFallback>
      </Avatar>

      <span className="flex-1 truncate">{name}</span>

      <span className="text-xs px-2 py-1 rounded-full bg-zinc-900 text-white">
        {role}
      </span>
    </li>
  );
};

export default MembersRolesCard;
