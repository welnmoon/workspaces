import { Heading } from '../ui/heading';

const UnAuth = () => {
  return (
    <section>
      <Heading level={1} className="text-primary-500 text-bold">
        Вы не авторизованы
      </Heading>
      <p>Пожалуйста, авторизуйтесь</p>
    </section>
  );
};

export default UnAuth;
