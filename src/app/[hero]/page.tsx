import { Calendar } from '@/components/Calendar';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface HeroPageProps {
  params: { hero: string }
}

export default function HeroPage({ params }: HeroPageProps) {
  const { hero } = params;
  if (!hero) return notFound();
  return <Calendar hero={hero} />;
} 