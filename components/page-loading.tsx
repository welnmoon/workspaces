import { Spinner } from './ui/spinner';

const PageLoading = ({ text }: { text?: string }) => {
  return (
    <div className="flex gap-2 justify-center items-center h-screen">
      <Spinner /> {text}
    </div>
  );
};

export default PageLoading;
