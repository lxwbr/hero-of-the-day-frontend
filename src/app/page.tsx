import { HeroList } from '@/components/hero-list/List'

export default function Home() {
  // For now, using a hardcoded email - this would typically come from authentication
  const userEmail = 'alex@example.com';
  
  return <HeroList userEmail={userEmail} />;
}
