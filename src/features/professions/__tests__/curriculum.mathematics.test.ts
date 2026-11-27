/// <reference types="node" />
/**
 * Validates the mathematics profession in content/professions/mathematics.
 *
 *   npx jest curriculum.mathematics
 *   MODULE=<module-slug> npx jest curriculum.mathematics     # just one module
 */
import { describe, expect, it } from '@jest/globals';

import { crossProblems, listProfessions, loadProfession, moduleProblems, structureProblems } from './curriculumChecks';

// Skipped until the profession's folder exists; from then on it must be valid.
const present = listProfessions().includes('mathematics');
const loaded = loadProfession('mathematics');
const only = (process.env.MODULE ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const modules = [...loaded.files.keys()].filter((m) => !only.length || only.includes(m)).sort();

(present ? describe : describe.skip)('mathematics', () => {
  it('has a valid profession and curriculum', () => {
    expect(structureProblems(loaded)).toEqual([]);
  });

  if (modules.length) {
    it.each(modules)('module %s', (module) => {
      expect(moduleProblems(loaded, module)).toEqual([]);
    });
  }

  if (!only.length) {
    it('has no clashes across modules', () => {
      expect(crossProblems(loaded)).toEqual([]);
    });
  }
});
