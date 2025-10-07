/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff',
          100: '#d6e4ff',
          500: '#2f54eb', // основной цвет бренда - кнопки, акценты, активные элементы
          600: '#1d39c4',
        },
        secondary: '#13c2c2', // вторичные акценты, ссылки
        background: '#ffffff',
        backgroundDark: '#0A0A0A', // темный фон
        foreground: '#000000', // основной текст
        foregroundMuted: '#595959', // второстепенный текст
        error: '#ff4d4f', // ошибки, предупреждения
        success: '#52c41a', // успех, подтверждения
        warning: '#faad14', // предупреждения
        muted: '#f5f5f5', // карточки, бордеры, ховеры
      },
    },
  },
};
