// MSW v2+: 'rest' is exported from 'msw'
import { http, HttpResponse } from 'msw'

// Store assignments per hero
let assignments: { [hero: string]: { [date: string]: string[] } } = {}

const mockHeroList = [
  { id: 1, name: 'default-hero', members: ['alice', 'bob'] },
  { id: 2, name: 'another-hero', members: ['carol'] },
  { id: 3, name: 'foobar-hero', members: ['dave', 'eve'] },
];

console.log('MSW: Handlers file loaded, setting up handlers...');

export const handlers = [
  // Hero list endpoint
  http.get('/hero/list', () => {
    console.log('MSW: GET /hero/list called, returning:', mockHeroList);
    return HttpResponse.json(mockHeroList);
  }),

  // Get assignments for a hero
  http.get('/schedule/:hero', ({ params }) => {
    const { hero } = params as { hero: string };
    console.log('MSW: GET /schedule/:hero called for hero:', hero, 'returning:', assignments[hero] || {});
    return HttpResponse.json(assignments[hero] || {});
  }),

  // Add assignment for a hero
  http.post('/schedule/:hero', async ({ request, params }) => {
    const { hero } = params as { hero: string };
    console.log('MSW: POST /schedule/:hero called for hero:', hero);
    
    try {
      const { date, name } = await request.json() as { date: string, name: string };
      if (!assignments[hero]) assignments[hero] = {};
      if (!assignments[hero][date]) assignments[hero][date] = [];
      if (!assignments[hero][date].includes(name)) {
        assignments[hero][date].push(name);
      }
      console.log('MSW: Updated assignments:', assignments[hero]);
      return HttpResponse.json(assignments[hero]);
    } catch (error) {
      console.error('MSW: Error in POST handler:', error);
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),

  // Remove assignment for a hero
  http.delete('/schedule/:hero', async ({ request, params }) => {
    const { hero } = params as { hero: string };
    console.log('MSW: DELETE /schedule/:hero called for hero:', hero);
    
    try {
      const { date, name } = await request.json() as { date: string, name: string };
      if (assignments[hero] && assignments[hero][date]) {
        assignments[hero][date] = assignments[hero][date].filter((n) => n !== name);
        if (assignments[hero][date].length === 0) {
          delete assignments[hero][date];
        }
      }
      console.log('MSW: Updated assignments:', assignments[hero] || {});
      return HttpResponse.json(assignments[hero] || {});
    } catch (error) {
      console.error('MSW: Error in DELETE handler:', error);
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  }),
];

console.log('MSW: Handlers setup complete, handlers:', handlers.length); 