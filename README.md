Используем React/next, Prisma, TS, ESLint, Prettier, Husky, lint-staged

ESLint - Линтер — анализирует код, ищет ошибки и помогает соблюдать единый стиль.

Prettier - Форматер — автоматически форматирует код (отступы, кавычки, запятые и т.д.). (npm run format)

Husky - Запускает проверки кода перед коммитами (git hooks), не давая закоммитить невалидный код.

lint-staged - Запускает линтер и форматер только на изменённых файлах для скорости.

npm install @fontsource/satoshi

npm install i18next react-i18next i18next-http-backend i18next-browser-languagedetector

i18next — ядро.

react-i18next — “обёртка” для React.

i18next-http-backend — загрузка переводов через HTTP.

i18next-browser-languagedetector — детектор языка в браузере.