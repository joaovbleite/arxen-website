import { build } from 'vite';

// Run the build
console.log('Starting Vite build...');
build()
  .then(() => {
    console.log('Build completed successfully!');
  })
  .catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
  }); 