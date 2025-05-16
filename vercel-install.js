#!/usr/bin/env node

// This script is used by Vercel to install dependencies while
// handling React version conflicts

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running custom install script for Vercel...');

// Add a specific npmrc file for the installation
const npmrcContent = `
legacy-peer-deps=true
engine-strict=false
strict-peer-dependencies=false
force=true
`;

fs.writeFileSync('.npmrc', npmrcContent);
console.log('Created custom .npmrc file');

// First run npm install with force and legacy-peer-deps
try {
  console.log('Installing dependencies with custom flags...');
  execSync('npm install --legacy-peer-deps --force', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  console.log('Attempting alternative installation approach...');
  
  try {
    // Try an alternative approach with npm ci
    execSync('npm ci --legacy-peer-deps --force', { stdio: 'inherit' });
    console.log('Alternative installation successful!');
  } catch (ciError) {
    console.error('Error with alternative installation:', ciError.message);
    process.exit(1);
  }
}

// Additional patches for React version conflicts
console.log('Applying React version patches...');

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
  
  // Directly install the specific React versions
  execSync('npm install react@19.1.0 react-dom@19.1.0 --save --force', { stdio: 'inherit' });
  
  console.log('React versions patched!');
} catch (error) {
  console.error('Warning: Error during React version patching:', error.message);
  // Continue anyway
}

console.log('Custom install completed successfully!'); 