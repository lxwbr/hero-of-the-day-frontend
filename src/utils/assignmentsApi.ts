import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function getAssignments(hero: string) {
  const res = await axios.get(`${baseURL}/schedule/${hero}`)
  return res.data
}

export async function addAssignment(hero: string, date: string, name: string) {
  const res = await axios.post(`${baseURL}/schedule/${hero}`, { date, name })
  return res.data
}

export async function removeAssignment(hero: string, date: string, name: string) {
  const res = await axios.delete(`${baseURL}/schedule/${hero}`, { data: { date, name } })
  return res.data
} 