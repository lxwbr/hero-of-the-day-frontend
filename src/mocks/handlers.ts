// MSW v2+: 'rest' is exported from 'msw'
import { http, HttpResponse } from 'msw'

// Store assignments per hero
let assignments: { [hero: string]: { [date: string]: string[] } } = {}

console.log('MSW: Handlers file loaded, setting up handlers...');

export const handlers = [
  // Get all assignments for a hero
  http.get('http://localhost:3000/schedule/:hero', ({ params }) => {
    const { hero } = params as { hero: string };
    console.log('MSW: GET /schedule/:hero called for hero:', hero, 'returning:', assignments[hero] || {});
    return HttpResponse.json(assignments[hero] || {})
  }),

  // Add assignment for a hero
  http.post('http://localhost:3000/schedule/:hero', async ({ request, params }) => {
    const { hero } = params as { hero: string };
    console.log('MSW: POST /schedule/:hero called for hero:', hero);
    try {
      const { date, name } = await request.json() as { date: string, name: string }
      if (!assignments[hero]) assignments[hero] = {}
      if (!assignments[hero][date]) assignments[hero][date] = []
      if (!assignments[hero][date].includes(name)) {
        assignments[hero][date].push(name)
      }
      console.log('MSW: Updated assignments:', assignments[hero]);
      return HttpResponse.json(assignments[hero])
    } catch (error) {
      console.error('MSW: Error in POST handler:', error);
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
  }),

  // Remove assignment for a hero
  http.delete('http://localhost:3000/schedule/:hero', async ({ request, params }) => {
    const { hero } = params as { hero: string };
    console.log('MSW: DELETE /schedule/:hero called for hero:', hero);
    try {
      const { date, name } = await request.json() as { date: string, name: string }
      if (assignments[hero] && assignments[hero][date]) {
        assignments[hero][date] = assignments[hero][date].filter((n) => n !== name)
        if (assignments[hero][date].length === 0) {
          delete assignments[hero][date]
        }
      }
      console.log('MSW: Updated assignments:', assignments[hero] || {});
      return HttpResponse.json(assignments[hero] || {})
    } catch (error) {
      console.error('MSW: Error in DELETE handler:', error);
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
  }),
]

console.log('MSW: Handlers setup complete, handlers:', handlers.length); 