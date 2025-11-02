import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MainBtn from '../buttons/main-btn';
import { UserRoundCog } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import EditProfileForm from '../forms/profile/edit-profile-form';

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
    <Dialog open={open}>
      <DialogTrigger asChild>
        <MainBtn
          onClick={() => setEditing(true)}
          variant="default"
          size="sm"
          className="gap-2"
        >
          <UserRoundCog className="h-4 w-4" /> Редактировать
        </MainBtn>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
        </DialogHeader>
        <EditProfileForm userId={userId} setModalOpen={setEditing} firstName={firstName} lastName={lastName} image={image} />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
