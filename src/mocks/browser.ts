import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

console.log('MSW: Setting up browser worker with handlers:', handlers.length);

export const worker = setupWorker(...handlers)

console.log('MSW: Browser worker created');
