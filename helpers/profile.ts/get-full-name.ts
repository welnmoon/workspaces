const getFullName = ({
  firstName,
  lastName,
}: {
  firstName?: string | null;
  lastName?: string | null;
}) => {
  return `${firstName || ''} ${lastName || ''}`.trim();
};

export default getFullName;
