import axios from 'axios'

export async function getAssignments() {
  const res = await axios.get('/api/assignments')
  return res.data
}

export async function addAssignment(date: string, name: string) {
  const res = await axios.post('/api/assignments', { date, name })
  return res.data
}

export async function removeAssignment(date: string, name: string) {
  const res = await axios.delete('/api/assignments', { data: { date, name } })
  return res.data
} 