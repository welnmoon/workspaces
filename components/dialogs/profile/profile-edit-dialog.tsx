import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserRoundCog } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import EditProfileForm from '../../forms/profile/edit-profile-form';
import MainButton from '@/ui/button/main-button';

const ProfileEditDialog = ({
  setEditing,
  open,
  userId,
  firstName,
  lastName,
  image,
}: {
  setEditing: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  userId: string;
  firstName: string;
  lastName: string;
  image: string;
}) => {
  return (
    <Dialog open={open} onOpenChange={setEditing}>
      <DialogTrigger asChild>
        <MainButton
          onClick={() => setEditing(true)}
          variant="default"
          size="sm"
          className="gap-2"
          icon={<UserRoundCog className="h-4 w-4" />}
        >
          Редактировать
        </MainButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
        </DialogHeader>
        <EditProfileForm
          userId={userId}
          setModalOpen={setEditing}
          firstName={firstName}
          lastName={lastName}
          image={image}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
