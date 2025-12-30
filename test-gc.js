const Automerge = require('@automerge/automerge');

// Create document with content
let doc = Automerge.init();
doc = Automerge.change(doc, 'Add initial content', doc => {
  doc.text = '';
  for (let i = 0; i < 1000; i++) {
    doc.text += 'x';
  }
});

console.log('Initial text length:', doc.text.length);

// Get size before deletion
const beforeDelete = Automerge.save(doc);
console.log('\n=== BEFORE DELETE ===');
console.log('Document size (bytes):', beforeDelete.length);
console.log('History length:', Automerge.getHistory(doc).length);

// DELETE EVERYTHING
doc = Automerge.change(doc, 'Delete all content', doc => {
  doc.text = '';
});

console.log('\n=== AFTER DELETE ===');
console.log('Text length after delete:', doc.text.length);

// Check size after deletion
const afterDelete = Automerge.save(doc);
console.log('Document size (bytes):', afterDelete.length);
console.log('History length:', Automerge.getHistory(doc).length);

// Can we see the delete operations?
const history = Automerge.getHistory(doc);
console.log('\n=== HISTORY ANALYSIS ===');
console.log('Total changes:', history.length);
history.forEach((change, i) => {
  console.log(`Change ${i}: ${change.message || 'unnamed'}`);
});

// Can we recover the deleted content?
console.log('\n=== RECOVERY TEST ===');
const beforeDeleteState = Automerge.getHistory(doc)[0].snapshot;
console.log('Can access snapshot before deletion:', !!beforeDeleteState);
console.log('Snapshot text length:', beforeDeleteState.text.length);

// Check if document size stayed large or got smaller
console.log('\n=== SIZE COMPARISON ===');
console.log('Size before delete:', beforeDelete.length, 'bytes');
console.log('Size after delete:', afterDelete.length, 'bytes');
const sizeRatio = afterDelete.length / beforeDelete.length;
console.log('Size ratio (after/before):', sizeRatio.toFixed(2));

if (sizeRatio < 0.2) {
  console.log('WARNING: Size dropped by >80% - possible GC');
} else if (sizeRatio > 0.8) {
  console.log('PASS: Size stayed large - likely NO GC');
} else {
  console.log('UNCLEAR: Needs deeper investigation');
}

// PASS/FAIL CRITERIA
console.log('\n=== VERDICT ===');
const hasHistory = history.length >= 2;
const canRecover = beforeDeleteState && beforeDeleteState.text.length === 1000;
const sizePersists = sizeRatio > 0.5;

console.log('Has complete history:', hasHistory ? 'YES' : 'NO');
console.log('Can recover deleted content:', canRecover ? 'YES' : 'NO');
console.log('Document size persists:', sizePersists ? 'YES' : 'NO');

if (hasHistory && canRecover && sizePersists) {
  console.log('\nPASS: Automerge appears to preserve history (NO GC)');
} else {
  console.log('\nFAIL: Evidence of garbage collection found');
}
