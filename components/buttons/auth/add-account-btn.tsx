import { Button } from '@/components/ui/button';
import { ProviderId } from '@/lib/providers';

interface AddAccountButtonProps {
  provider: ProviderId;
}

const AddAccountButton = ({ provider }: AddAccountButtonProps) => {
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
  return (
    <Button>
      <span>{providerName}</span>
      <img
        src={provider === 'google' ? '/google.svg' : '/github.svg'}
        alt={providerName}
      />
    </Button>
  );
};

export default AddAccountButton;
