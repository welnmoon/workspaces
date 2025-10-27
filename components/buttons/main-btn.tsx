import { Button } from '../ui/button';

const MainBtn = ({ text }: { text: string }) => {
  return <Button className='bg-primary-500 hover:bg-primary-600'>{text}</Button>;
};

export default MainBtn;
