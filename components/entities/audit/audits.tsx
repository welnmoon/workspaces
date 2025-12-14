import { AuditFull } from '@/types/prisma/DTO/audit';

const Audits = ({ audits }: { audits: AuditFull[] }) => {
  return <section>{audits.map((a) => a.action)}</section>;
};

export default Audits;
