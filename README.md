# Automerge Garbage Collection Test

## Purpose

This test verifies whether Automerge preserves complete operation history or performs garbage collection on deleted content.

**Question**: Does Automerge keep all historical operations, or does it clean up deleted data to save space?

**Answer**: Automerge preserves complete history. No garbage collection occurs.

## How It Works

The test:
1. Creates a document with 1,000 characters
2. Deletes all content
3. Measures document size before and after deletion
4. Checks if deleted content is recoverable from history

## Running the Test

### First Time Setup
```bash
cd ~/lab/automerge-gc-test
npm install
node test-gc.js
```

### Running Again

Once installed, just run:
```bash
cd ~/lab/automerge-gc-test
node test-gc.js
```

No reinstallation needed. The `@automerge/automerge` package is already in the `node_modules` directory.

## Understanding Results

### Pass Criteria (No GC)
- History shows all changes
- Can access snapshots before deletion
- Document size stays large after deletion
- Deleted content recoverable

### Our Results
- Size before delete: 18,751 bytes
- Size after delete: 18,780 bytes
- Size ratio: 1.00 (document actually grew slightly)
- History: 2 changes preserved
- Recovery: Full content recoverable from snapshot

**Verdict**: PASS - Automerge does NOT garbage collect

## What This Means

Automerge maintains a complete audit trail of all operations. When you delete content:
- The deletion is recorded as a new operation
- Original content remains in history
- Document size does not decrease
- You can always recover previous states

This makes Automerge ideal for:
- Collaborative editing with full history
- Audit trails
- Undo/redo functionality
- Time-travel debugging

Trade-off: Documents grow continuously as edits accumulate.
