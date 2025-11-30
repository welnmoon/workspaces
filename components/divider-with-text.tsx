const DividerWithText = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center w-full my-6 text-sm text-gray-500">
      <div className="flex-1 h-px bg-gray-300"></div>
      <span className="px-3 whitespace-nowrap">{text}</span>
      <div className="flex-1 h-px bg-gray-300"></div>
    </div>
  );
};

export default DividerWithText;
