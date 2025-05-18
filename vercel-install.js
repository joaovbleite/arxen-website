#!/usr/bin/env node

// This script is used by Vercel to install dependencies while
// handling React version conflicts

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running custom install script for Vercel...');

// Clear any cached files that might be causing issues
try {
  console.log('Clearing any existing build artifacts...');
  
  // Try to remove node_modules if it exists to force clean install
  if (fs.existsSync('node_modules')) {
    console.log('Removing node_modules to ensure clean install...');
    if (process.platform === 'win32') {
      execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
    } else {
      execSync('rm -rf node_modules', { stdio: 'inherit' });
    }
  }
  
  // Clean any build artifacts
  if (fs.existsSync('dist')) {
    console.log('Removing previous build...');
    if (process.platform === 'win32') {
      execSync('rmdir /s /q dist', { stdio: 'inherit' });
    } else {
      execSync('rm -rf dist', { stdio: 'inherit' });
    }
  }
  
  // Clear cache
  console.log('Clearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  console.log('Build environment prepared successfully!');
} catch (error) {
  console.error('Error during pre-install cleanup:', error);
  // Don't exit with error to allow the build to continue
}

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

// This file is used by Vercel to customize the build process
// It runs before the install command specified in vercel.json

// Clear any cached files that might be causing issues
try {
  console.log('Clearing any existing build artifacts...');
  
  // Try to remove node_modules if it exists to force clean install
  if (fs.existsSync('node_modules')) {
    console.log('Removing node_modules to ensure clean install...');
    if (process.platform === 'win32') {
      execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
    } else {
      execSync('rm -rf node_modules', { stdio: 'inherit' });
    }
  }
  
  // Clean any build artifacts
  if (fs.existsSync('dist')) {
    console.log('Removing previous build...');
    if (process.platform === 'win32') {
      execSync('rmdir /s /q dist', { stdio: 'inherit' });
    } else {
      execSync('rm -rf dist', { stdio: 'inherit' });
    }
  }
  
  // Clear cache
  console.log('Clearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  console.log('Build environment prepared successfully!');
} catch (error) {
  console.error('Error during pre-install cleanup:', error);
  // Don't exit with error to allow the build to continue
} 