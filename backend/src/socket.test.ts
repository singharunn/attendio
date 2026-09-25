import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildSubjectUpdate } from './socket.js';

describe('buildSubjectUpdate', () => {
  it('emits the latest attendance percentage and risk state', () => {
    const payload = buildSubjectUpdate({
      id: 'subject_1',
      code: 'CS101',
      name: 'Data Structures',
      userId: 'user_1',
      threshold: 75,
      attended: 42,
      total: 50,
      status: 'CRITICAL',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-02',
    });

    assert.deepEqual(payload, {
      subjectId: 'subject_1',
      attended: 42,
      total: 50,
      percentage: 84,
      threshold: 75,
      status: 'CRITICAL',
    });
  });
});
