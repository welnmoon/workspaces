'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

const SubmitBtn = ({ isLoading }: { isLoading: boolean }) => {
    
  const { t } = useTranslation('buttons');
  return (
    <Button  className="cursor-pointer" type="submit" disabled={isLoading}>
      {t('submit')}
    </Button>
  );
};

export default SubmitBtn;
