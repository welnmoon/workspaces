'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const AdminSpaFab = () => (
  <div className="fixed bottom-6 right-6 z-50">
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            size="icon"
            className="h-11 w-11 rounded-full shadow-lg"
          >
            <Link href="/spa" aria-label="Open admin panel">
              <Shield className="h-5 w-5" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Admin panel</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export default AdminSpaFab;
