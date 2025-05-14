// Load the residential entries
import { residentialServiceEntries } from './residential-entries.js';

// Initialize arrays to track patterns
const patterns = [];
const duplicates = [];

// Check for duplicates
residentialServiceEntries.forEach((entry, index) => {
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
console.log('Total entries:', residentialServiceEntries.length);
console.log('Total unique patterns:', patterns.length);
console.log('Duplicate patterns found:', duplicates.length);

// List any duplicates
if (duplicates.length > 0) {
  console.log('Duplicate patterns:', JSON.stringify(duplicates, null, 2));
} 