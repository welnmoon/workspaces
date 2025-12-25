import LinkButton from '@/ui/button/link-button';
import { Heading } from '@/components/ui/heading';

const NotAuthPage = () => {
  return (
    <>
      <Heading level={1}>Вас нет в системе</Heading>
      <LinkButton href="/register" text="Зарегистрироваться" />
    </>
  );
};

export default NotAuthPage;
