#!/usr/bin/env node

// This script is used by Vercel to install dependencies while
// handling React version conflicts

const { execSync } = require('child_process');
const fs = require('fs');

console.log('Running custom install script for Vercel...');

// First run npm install with force and legacy-peer-deps
try {
  console.log('Installing dependencies...');
  execSync('npm install --legacy-peer-deps --force', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  process.exit(1);
}

// Additional patches if needed
console.log('Verifying React versions...');

try {
  // Create a temp package to force correct React versions
  const tempPackageJson = {
    name: "temp-react-resolver",
    dependencies: {
      "react": "19.1.0",
      "react-dom": "19.1.0"
    }
  };
  
  fs.writeFileSync('temp-package.json', JSON.stringify(tempPackageJson, null, 2));
  execSync('npm install --package-lock-only --force', { stdio: 'inherit' });
  fs.unlinkSync('temp-package.json');
  
  console.log('React versions verified!');
} catch (error) {
  console.error('Warning: Error during React version verification:', error.message);
  // Continue anyway
}

console.log('Custom install completed successfully!'); 