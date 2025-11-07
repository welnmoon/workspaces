export const AuthButtons = () => {
  return (
    <div className="flex gap-3">
      <button className="px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition">
        Login
      </button>

      <button className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition">
        Start free
      </button>
    </div>
  );
};
