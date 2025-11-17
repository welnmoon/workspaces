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

      <img
        src="/images/not-found.png"
        alt="Ошибка"
        className="w-60 h-auto opacity-80"
      />
    </div>
  );
};

export default ErrorComponent;
