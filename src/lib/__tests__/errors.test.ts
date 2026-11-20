import { describe, expect, it, jest } from '@jest/globals';

import { friendlyError, isGoneError, isNetworkError, isNotDueError } from '../errors';

describe('friendlyError', () => {
  it('explains network failures', () => {
    expect(friendlyError({ message: 'TypeError: Failed to fetch' })).toMatch(/connection/);
    expect(isNetworkError({ message: 'Network request failed' })).toBe(true);
  });

  it('explains cards changed on another device', () => {
    const deleted = { code: 'P0002', message: 'Memory 0d1f not found' };
    expect(isGoneError(deleted)).toBe(true);
    expect(friendlyError(deleted)).toMatch(/no longer exists/);
    expect(friendlyError({ code: 'P0002', message: 'Pack calc-limits not found' })).toMatch(/pack/);

    const reviewed = { code: '22023', message: 'Memory is not due until 2026-11-25' };
    expect(isNotDueError(reviewed)).toBe(true);
    expect(friendlyError(reviewed)).toMatch(/already reviewed/);
  });

  it('tells password and email validation apart', () => {
    expect(friendlyError({ code: 'validation_failed', message: 'Password cannot be longer than 72 characters' })).toMatch(/72/);
    expect(friendlyError({ code: 'validation_failed', message: 'Unable to validate email address: invalid format' })).toMatch(
      /email/,
    );
  });

  it('uses the reasons a password was rejected', () => {
    expect(friendlyError({ code: 'weak_password', reasons: ['pwned'] })).toMatch(/breach/);
    expect(friendlyError({ code: 'weak_password' })).toMatch(/8 characters/);
  });

  it('explains a wrong device clock and server trouble', () => {
    expect(friendlyError({ code: '22023', message: "p_today must be the caller's local date" })).toMatch(/date/);
    expect(friendlyError({ name: 'AuthRetryableFetchError', message: 'Error sending recovery email', status: 500 })).toMatch(
      /email/,
    );
    expect(friendlyError({ name: 'AuthRetryableFetchError', message: '', status: 502 })).toMatch(/server/);
  });

  it('never shows raw server text it does not recognise', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(friendlyError({ message: 'JSON object requested, multiple (or no) rows returned' })).toBe(
      'Something went wrong. Please try again.',
    );
    warn.mockRestore();
  });
});
