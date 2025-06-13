import { Calendar } from '@/components/Calendar';
import { notFound } from 'next/navigation';

interface HeroPageProps {
  params: { hero: string }
}

export default function HeroPage({ params }: HeroPageProps) {
  const { hero } = params;
  if (!hero) return notFound();
  return <Calendar hero={hero} />;
} 