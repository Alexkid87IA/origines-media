import { rename } from 'node:fs/promises';
import { resolve } from 'node:path';

// Vercel serves an existing index.html before conditional homepage rewrites.
// Keep the visitor's SPA entry under a separate path so crawlers can reach HTML.
const outputDirectory = resolve(process.argv[2] || 'dist');
await rename(resolve(outputDirectory, 'index.html'), resolve(outputDirectory, 'app.html'));
console.log('Prepared the Vercel SPA entry: app.html');
