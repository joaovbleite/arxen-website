// Test script for common conversation patterns
import { commonConversationEntries } from './common-conversations.js';

// Count patterns and check for duplicates
const patterns = [];
const duplicates = [];

// Check for duplicates
commonConversationEntries.forEach((entry, index) => {
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
console.log('Total common conversation entries:', commonConversationEntries.length);
console.log('Total unique common patterns:', patterns.length);
console.log('Duplicate patterns found:', duplicates.length);

// List categories of common conversations
const categories = [];
let currentCategory = '';
let entryCount = 0;

commonConversationEntries.forEach((entry, index) => {
  // Find comment lines that indicate categories
  const lines = entry.toString().split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('//') && !line.includes('COMMON CONVERSATION PATTERNS')) {
      const category = line.trim().replace('//', '').trim();
      if (!categories.includes(category) && category !== currentCategory) {
        if (currentCategory !== '') {
          console.log(`  - ${currentCategory}: ${entryCount} entries`);
          entryCount = 0;
        }
        categories.push(category);
        currentCategory = category;
      }
    }
  }
  entryCount++;
});

// Print the last category
if (currentCategory !== '') {
  console.log(`  - ${currentCategory}: ${entryCount} entries`);
}

// List any duplicates
if (duplicates.length > 0) {
  console.log('Duplicate patterns:', JSON.stringify(duplicates, null, 2));
} 