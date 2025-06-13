// MSW v2+: 'rest' is exported from 'msw'
import { http, HttpResponse } from 'msw'

let assignments: { [date: string]: string[] } = {}

console.log('MSW: Handlers file loaded, setting up handlers...');

export const handlers = [
  // Get all assignments for a hero
  http.get('http://localhost:3000/schedule/:hero', ({ params }) => {
    const { hero } = params;
    console.log('MSW: GET /schedule/:hero called for hero:', hero, 'returning:', assignments);
    return HttpResponse.json(assignments)
  }),

  // Add assignment for a hero
  http.post('http://localhost:3000/schedule/:hero', async ({ request, params }) => {
    const { hero } = params;
    console.log('MSW: POST /schedule/:hero called for hero:', hero);
    try {
      const { date, name } = await request.json() as { date: string, name: string }
      console.log('MSW: Adding assignment for hero:', hero, 'date:', date, 'name:', name);
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

  // Remove assignment for a hero
  http.delete('http://localhost:3000/schedule/:hero', async ({ request, params }) => {
    const { hero } = params;
    console.log('MSW: DELETE /schedule/:hero called for hero:', hero);
    try {
      const { date, name } = await request.json() as { date: string, name: string }
      console.log('MSW: Removing assignment for hero:', hero, 'date:', date, 'name:', name);
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