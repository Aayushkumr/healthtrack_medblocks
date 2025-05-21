import { PGlite } from '@electric-sql/pglite';
import { worker } from '@electric-sql/pglite/worker';

// Add proper debugging
console.log('Worker script started');

// Add explicit error handling
self.addEventListener('error', (event) => {
  console.error('Worker global error:', event.message);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Worker unhandled rejection:', event.reason);
});

try {
  worker({
    async init() {
      console.log('Worker init function called');
      try {
        console.log('Creating new PGlite instance');
        const db = new PGlite('idb://healthtrack-db');
        console.log('PGlite instance created successfully');
        return db;
      } catch (error) {
        console.error('Error in worker init:', error);
        throw error;
      }
    }
  });
  console.log('Worker setup completed');
} catch (error) {
  console.error('Error setting up worker:', error);
}