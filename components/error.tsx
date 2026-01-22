import Image from 'next/image';

const ErrorComponent = ({
  title = 'Произошла ошибка',
  message = 'Что-то пошло не так. Попробуйте ещё раз позже.',
}: {
  title?: string;
  message?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{message}</p>

      <Image
        src="/images/not-found.png"
        alt="Ошибка"
        className="h-auto opacity-80"
        width={60}
        height={60}
      />
    </div>
  );
};

export default ErrorComponent;
