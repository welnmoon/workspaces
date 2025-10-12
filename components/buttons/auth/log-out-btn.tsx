'use client'

import { signOut } from 'next-auth/react';
import { Button } from '../../ui/button';

const LogOutButton = () => {
  return <Button onClick={() => signOut()}>Выйти</Button>;
};

export default LogOutButton;
