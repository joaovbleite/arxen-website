// Load the commercial entries
import { commercialServiceEntries } from './commercial-entries.js';

// Initialize arrays to track patterns
const patterns = [];
const duplicates = [];

// Check for duplicates
commercialServiceEntries.forEach((entry, index) => {
  entry.patterns.forEach(pattern => {
    if (patterns.includes(pattern)) {
      duplicates.push({
        pattern,
        index
      });
    } else {
      patterns.push(pattern);
    }
  });
});

// Output results
console.log('Total commercial entries:', commercialServiceEntries.length);
console.log('Total unique commercial patterns:', patterns.length);
console.log('Duplicate patterns found:', duplicates.length);

// List any duplicates
if (duplicates.length > 0) {
  console.log('Duplicate patterns:', JSON.stringify(duplicates, null, 2));
} 