'use client';

import { useState, useEffect } from 'react';
import { HeroList } from '@/components/hero-list/List';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { authService } from '@/services/auth';

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get user email from authentication service
    const email = authService.getUserEmail();
    setUserEmail(email);
  }, []);

  // If no user email is available, show a loading state
  if (!userEmail) {
    return (
      <AuthWrapper>
        <div>Loading user information...</div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <HeroList userEmail={userEmail} />
    </AuthWrapper>
  );
}
