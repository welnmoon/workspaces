import AddAccountButton from '../buttons/auth/add-account-btn';
import { Heading } from '../ui/heading';
import { PROVIDERS } from '@/lib/providers';

const AddAccounts = ({ accountProviders }: { accountProviders: string[] }) => {
  const availableProviders = PROVIDERS.filter(
    (p) => !accountProviders.includes(p.id)
  );

  return (
    <section>
      <Heading level={2}>Добавить аккаунты</Heading>

      {availableProviders.map((provider) => (
        <AddAccountButton provider={provider.id} />
      ))}
    </section>
  );
};

export default AddAccounts;
