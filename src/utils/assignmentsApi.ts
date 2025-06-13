const assignments: { [date: string]: string[] } = {}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function getAssignments() {
  await delay(100)
  return JSON.parse(JSON.stringify(assignments))
}

export async function addAssignment(date: string, name: string) {
  await delay(100)
  if (!assignments[date]) assignments[date] = []
  if (!assignments[date].includes(name)) {
    assignments[date].push(name)
  }
  return JSON.parse(JSON.stringify(assignments))
}

export async function removeAssignment(date: string, name: string) {
  await delay(100)
  if (assignments[date]) {
    assignments[date] = assignments[date].filter(n => n !== name)
    if (assignments[date].length === 0) {
      delete assignments[date]
    }
  }
  return JSON.parse(JSON.stringify(assignments))
} 