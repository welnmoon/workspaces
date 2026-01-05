import Image from 'next/image';

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
          <span className="">Оптимизируйте свой </span>

          {/* Мягкий подсвет на ключевой фразе */}
          <span className="relative inline-block">
            <Image
              aria-hidden
              alt="underline"
              src="/root/underline.png"
              width={662}
              height={51}
              className="absolute -bottom-5 -left-5 rotate-1 rounded-md animate-draw"
            />
            рабочий процесс
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
