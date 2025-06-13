// MSW v2+: 'rest' is exported from 'msw'
import { http, HttpResponse } from 'msw'

let assignments: { [date: string]: string[] } = {}

console.log('MSW: Handlers file loaded, setting up handlers...');

export const handlers = [
  // Get all assignments
  http.get('/api/assignments', () => {
    console.log('MSW: GET /api/assignments called, returning:', assignments);
    return HttpResponse.json(assignments)
  }),

  // Add assignment
  http.post('/api/assignments', async ({ request }) => {
    console.log('MSW: POST /api/assignments called');
    try {
      const { date, name } = await request.json() as { date: string, name: string }
      console.log('MSW: Adding assignment:', { date, name });
      if (!assignments[date]) assignments[date] = []
      if (!assignments[date].includes(name)) {
        assignments[date].push(name)
      }
      console.log('MSW: Updated assignments:', assignments);
      return HttpResponse.json(assignments)
    } catch (error) {
      console.error('MSW: Error in POST handler:', error);
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
  }),

  // Remove assignment
  http.delete('/api/assignments', async ({ request }) => {
    console.log('MSW: DELETE /api/assignments called');
    try {
      const { date, name } = await request.json() as { date: string, name: string }
      console.log('MSW: Removing assignment:', { date, name });
      if (assignments[date]) {
        assignments[date] = assignments[date].filter((n) => n !== name)
        if (assignments[date].length === 0) {
          delete assignments[date]
        }
      }
      console.log('MSW: Updated assignments:', assignments);
      return HttpResponse.json(assignments)
    } catch (error) {
      console.error('MSW: Error in DELETE handler:', error);
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
  }),
]

console.log('MSW: Handlers setup complete, handlers:', handlers.length); 