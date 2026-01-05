import { Button } from '@/components/ui/button';
import { ProviderId } from '@/lib/providers';
import Image from 'next/image';

interface AddAccountButtonProps {
  provider: ProviderId;
}

const AddAccountButton = ({ provider }: AddAccountButtonProps) => {
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
  return (
    <Button>
      <span>{providerName}</span>
      <Image
        src={`/icons/${provider}-icon.svg`}
        alt={providerName}
        width={16}
        height={16}
        className="h-4 w-4"
      />
    </Button>
  );
};

export default AddAccountButton;
