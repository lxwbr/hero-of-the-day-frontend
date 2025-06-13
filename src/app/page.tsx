import { HeroList } from '@/components/HeroList'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function HomePage() {
  return <HeroList />
} 