
'use client';
import type { User } from 'firebase/auth';

export function useUser() {
  return { user: null as User | null, isLoading: false };
}
