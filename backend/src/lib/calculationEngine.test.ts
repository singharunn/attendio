import assert from 'node:assert/strict';
import test from 'node:test';
import { AttendanceCalculator } from './calculationEngine.js';

const calculator = new AttendanceCalculator();

test('calculatePercentage returns correct percentage', () => {
  assert.equal(calculator.calculatePercentage(60, 80), 75);
});

test('safe skip calculation works at threshold', () => {
  assert.equal(calculator.calculateSafeSkips(75, 100, 75), 0);
  assert.equal(calculator.calculateSafeSkips(80, 100, 75), 6);
});

test('recovery calculation is positive for below threshold', () => {
  assert.equal(calculator.calculateRecovery(50, 100, 75), 100);
});

test('status uses safe critical danger thresholds', () => {
  assert.equal(calculator.getStatus(80, 75), 'SAFE');
  assert.equal(calculator.getStatus(72, 75), 'CRITICAL');
  assert.equal(calculator.getStatus(60, 75), 'DANGER');
});
