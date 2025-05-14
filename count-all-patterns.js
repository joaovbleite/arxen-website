// Script to count all patterns across all conversation files
import { residentialServiceEntries } from './residential-entries.js';
import { allCommercialEntries } from './combined-commercial.js';
import { commonConversationEntries } from './common-conversations.js';

// Initialize arrays to track patterns
const patterns = [];
const duplicates = [];

// Function to process entries
function processEntries(entries, sourceName) {
  console.log(`Processing ${sourceName}...`);
  let entryCount = 0;
  let patternCount = 0;
  
  entries.forEach((entry, index) => {
    entryCount++;
    entry.patterns.forEach(pattern => {
      patternCount++;
      if (patterns.includes(pattern)) {
        duplicates.push({
          pattern,
          source: sourceName,
          index
        });
      } else {
        patterns.push(pattern);
      }
    });
  });
  
  console.log(`  ${sourceName}: ${entryCount} entries, ${patternCount} patterns`);
  return { entryCount, patternCount };
}

// Process all entry sets
const residential = processEntries(residentialServiceEntries, 'Residential');
const common = processEntries(commonConversationEntries, 'Common');
const commercial = processEntries(allCommercialEntries, 'Commercial');

// Output combined results
const totalEntries = residential.entryCount + common.entryCount + commercial.entryCount;
const totalPatterns = residential.patternCount + common.patternCount + commercial.patternCount;

console.log('\nSummary:');
console.log('Total entries across all files:', totalEntries);
console.log('Total raw patterns (including duplicates):', totalPatterns);
console.log('Total unique patterns:', patterns.length);
console.log('Duplicate patterns found:', duplicates.length);

// List any duplicates
if (duplicates.length > 0) {
  console.log('Duplicate patterns:', JSON.stringify(duplicates, null, 2));
} 