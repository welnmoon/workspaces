const HeroSection = () => {
  return (
    <section className="mb-30 pt-20">
      <div className="text-center group">
        <h1
          className="
          mt-8 text-4xl sm:text-5xl md:text-6xl xl:text-7xl
          font-extrabold leading-tight tracking-tight text-zinc-800
          dark:text-white
        "
        >
          {/* Нежный градиент по всему заголовку через тень */}
          <span className="drop-shadow-[0_6px_24px_rgba(59,130,246,0.25)]">
            Оптимизируйте свой{' '}
          </span>

          {/* Мягкий подсвет на ключевой фразе */}
          <span className="relative inline-block">
            <span
              aria-hidden
              className="absolute inset-x-0 -inset-y-1 rounded-md
                       bg-gradient-to-r from-blue-200/70 via-blue-100/50 to-transparent
                       blur-[2px]"
            />
            <span className="relative">рабочий процесс</span>
            <span
              aria-hidden
              className="
              z-[-1]
      absolute inset-0
      bg-blue-200/70 via-blue-100/50 blur-[2px]
      rounded-md
      opacity-0
      transition-all duration-300
      group-hover:opacity-100
    "
            />
          </span>

          <span> с помощью мощных инструментов для </span>

          {/* Акцент-бейдж со скошенным лёгким наклоном */}
          <span className="relative inline-block -rotate-1">
            <span className="rounded-md bg-black text-white px-3 py-1 md:px-4 md:py-1.5">
              совместной работы
            </span>
          </span>
        </h1>
      </div>

      {/* Поддержка: тонкий градиент в тексте (опционально) */}
      <p className="mt-5 mx-auto text-center text-lg md:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl">
        Быстрее планируйте, согласовывайте и запускайте — один рабочий простор
        для всей команды.
      </p>

      {/* Кнопки, если нужны рядом */}

      <div className="mt-8 flex flex-col justify-center sm:flex-row gap-3">
        <button className="px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition">
          Login
        </button>
        <button className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition">
          Start free
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
