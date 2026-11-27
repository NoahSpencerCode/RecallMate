/// <reference types="node" />
/**
 * Validates the embedded-ai profession in content/professions/embedded-ai.
 *
 *   npx jest curriculum.embedded-ai
 *   MODULE=<module-slug> npx jest curriculum.embedded-ai     # just one module
 */
import { describe, expect, it } from '@jest/globals';

import { crossProblems, listProfessions, loadProfession, moduleProblems, structureProblems } from './curriculumChecks';

// Skipped until the profession's folder exists; from then on it must be valid.
const present = listProfessions().includes('embedded-ai');
const loaded = loadProfession('embedded-ai');
const only = (process.env.MODULE ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const modules = [...loaded.files.keys()].filter((m) => !only.length || only.includes(m)).sort();

(present ? describe : describe.skip)('embedded-ai', () => {
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
