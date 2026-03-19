
'use client';

import { useUser } from '@/firebase';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/use-translation';

export function UserAvatar() {
  const { user } = useUser();
  const { language } = useTranslation();

  return (
    <Link 
      href={user ? "/settings" : "/login"} 
      className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200"
      aria-label={user ? "View settings" : "Login or Sign Up"}
    >
      {user ? (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User profile picture'} />
          <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
      ) : (
        <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
      )}
    </Link>
  );
}
